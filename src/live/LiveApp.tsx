import { useEffect, useRef, useState } from 'react';
import { DEFAULT_DONE_LINE, DONE_LINES, INTENTS, MINUTES_SAVED_PER_STOP, chipColors, nextMilestone, ord, pausePhase } from '../core';
import ShieldScreen from '../views/ShieldScreen';
import InterventionScreen from '../views/InterventionScreen';
import FrictionApp from '../views/FrictionApp';
import { SERIF, monoLabel } from '../views/shared';
import {
  type Attempt, type LiveData, bestStreak, clock, currentStreak, emptyData, isToday, load, save,
  topIntent, vulnerableTime, when,
} from './store';

/** iOS shortcut that grants a short pass and then opens Instagram. */
export const OPEN_SHORTCUT = 'Friction Open';
const OPEN_SHORTCUT_URL = `shortcuts://run-shortcut?name=${encodeURIComponent(OPEN_SHORTCUT)}`;

const PAUSE_SECONDS = 15;

type Step = 'shield' | 'intervene' | 'closed';

const params = () => new URLSearchParams(window.location.search);

/**
 * The real Friction app. Opened with `?pause` (by the iOS Shortcuts
 * automation that fires when Instagram opens) it runs the shield and pause;
 * otherwise it shows Today / Rules / Streak from real, on-device data.
 */
export default function LiveApp() {
  const [data, setData] = useState<LiveData>(load);
  const [mode, setMode] = useState<'pause' | 'app'>(() => (params().has('pause') ? 'pause' : 'app'));

  const commit = (fn: (d: LiveData) => LiveData) => {
    setData(prev => {
      const next = fn(prev);
      save(next);
      return next;
    });
  };

  const showApp = () => {
    window.history.replaceState(null, '', window.location.pathname);
    setMode('app');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#16130F' }}>
      {mode === 'pause'
        ? <Pause data={data} commit={commit} onShowStats={showApp} />
        : <Stats data={data} commit={commit} />}
    </div>
  );
}

type Commit = (fn: (d: LiveData) => LiveData) => void;

function Pause({ data, commit, onShowStats }: { data: LiveData; commit: Commit; onShowStats: () => void }) {
  // One attempt per pause page. The id lives in the URL so a reload or a
  // restored Safari tab doesn't count the same attempt twice.
  const [id] = useState(() => {
    const fromUrl = Number(params().get('id'));
    if (fromUrl) return fromUrl;
    const fresh = Date.now();
    const p = params();
    p.set('id', String(fresh));
    window.history.replaceState(null, '', `${window.location.pathname}?${p.toString().replace('pause=', 'pause')}`);
    return fresh;
  });
  useEffect(() => {
    commit(d => (d.attempts.some(a => a.id === id)
      ? d
      : { ...d, attempts: [...d.attempts, { id, intent: null, waited: 0, result: 'Never mind' }] }));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [step, setStep] = useState<Step>('shield');
  const [elapsed, setElapsed] = useState(0);
  const [intent, setIntent] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);

  const update = (patch: Partial<Attempt>) =>
    commit(d => ({ ...d, attempts: d.attempts.map(a => (a.id === id ? { ...a, ...patch } : a)) }));

  const startPause = () => {
    setStep('intervene');
    const t0 = Date.now();
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      const e = Math.min(PAUSE_SECONDS, (Date.now() - t0) / 1000);
      setElapsed(e);
      if (e >= PAUSE_SECONDS) clearInterval(timer.current);
    }, 80);
  };

  const neverMind = () => {
    clearInterval(timer.current);
    update({ intent: step === 'shield' ? 'At shield' : intent, waited: Math.round(elapsed), result: 'Never mind' });
    setStep('closed');
  };

  const openInsta = () => {
    const patch: Partial<Attempt> = { intent: intent || "I don't know", waited: Math.round(elapsed), result: 'Opened' };
    // Save synchronously: we're about to leave the page.
    const latest = load();
    save({ ...latest, attempts: latest.attempts.map(a => (a.id === id ? { ...a, ...patch } : a)) });
    update(patch);
    window.location.href = OPEN_SHORTCUT_URL;
  };

  // Stats as they stood before this attempt.
  const others = data.attempts.filter(a => a.id !== id);
  const today = others.filter(a => isToday(a.id));
  const n = today.length + 1;
  const stoppedToday = today.filter(a => a.result === 'Never mind').length;

  if (step === 'closed') {
    const streak = currentStreak(data.attempts);
    const stopped = data.attempts.filter(a => isToday(a.id) && a.result === 'Never mind').length;
    return <Closed streak={streak} stopped={stopped} onShowStats={onShowStats} />;
  }

  if (step === 'shield') {
    return <ShieldScreen v={{ shieldSub: n === 1 ? 'First time today.' : `You've already opened it ${n - 1} ${n === 2 ? 'time' : 'times'} today.`, shieldContinue: startPause, neverMind }} />;
  }

  const { askWhy, showPattern } = data.rules;
  const phase = pausePhase(elapsed, PAUSE_SECONDS, { askWhy, showPattern, intent });
  const lastOpened = [...others].reverse().find(a => a.result === 'Opened' && a.intent);
  const recent = others.filter(a => id - a.id <= 40 * 60 * 1000);
  const v = id % 3;
  const reality = !intent && askWhy && v !== 1
    ? { h: 'No answer usually means autopilot.', s: `This is your ${ord(n)} open today.` }
    : v === 1 && lastOpened ? { h: `Last time you said "${lastOpened.intent}."`, s: `That was ${when(lastOpened.id)}.` }
    : v === 0 && recent.length ? { h: `${ord(recent.length + 1)} check in the last 40 minutes.`, s: `You changed your mind on ${recent.filter(a => a.result === 'Never mind').length} of them.` }
    : { h: `This is your ${ord(n)} Instagram open today.`, s: `You changed your mind ${stoppedToday} ${stoppedToday === 1 ? 'time' : 'times'}.` };

  return (
    <InterventionScreen v={{
      phase,
      ivTag: `ATTEMPT #${n} · ${clock(id)}`,
      ringColor: phase === 'final' || phase === 'done' ? '#A855F7' : '#F3EDE2',
      ringProgress: elapsed / PAUSE_SECONDS,
      ivNum: Math.max(0, Math.ceil(PAUSE_SECONDS - elapsed - 0.001)),
      intents: INTENTS.map(label => ({ label, pick: () => setIntent(label) })),
      realityTag: intent ? `You said: ${intent}` : 'Your pattern',
      reality,
      doneLine: (intent && DONE_LINES[intent]) || DEFAULT_DONE_LINE,
      nevermindLabel: phase === 'done' ? 'Never mind' : 'Actually, never mind',
      openInsta,
      neverMind,
    }} />
  );
}

function Closed({ streak, stopped, onShowStats }: { streak: number; stopped: number; onShowStats: () => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#16130F', color: '#F3EDE2', display: 'flex', flexDirection: 'column', padding: '64px 24px 44px', boxSizing: 'border-box', animation: 'fr-pop .25s ease-out' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14, textAlign: 'center' }}>
        <span style={monoLabel(11, '#A855F7')}>Instagram closed</span>
        <span style={{ font: `400 52px/1 ${SERIF}` }}>{streak} in a row.</span>
        <span style={{ fontSize: 17, color: '#D9CFC2', fontWeight: 600 }}>{stopped} autopilot {stopped === 1 ? 'open' : 'opens'} stopped today</span>
        <span style={{ fontSize: 15, color: '#A69C8F', marginTop: 8 }}>You can close this tab now.</span>
      </div>
      <button className="hv-dark" onClick={onShowStats} style={{ height: 52, borderRadius: 18, border: '1px solid #3A332C', background: 'transparent', color: '#F3EDE2', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
        See my stats
      </button>
    </div>
  );
}

function Stats({ data, commit }: { data: LiveData; commit: Commit }) {
  const [fTab, setFTab] = useState('today');
  const all = data.attempts;
  const today = all.filter(a => isToday(a.id));
  const stopped = today.filter(a => a.result === 'Never mind').length;
  const rate = today.length ? Math.round((stopped / today.length) * 100) : 0;
  const streak = currentStreak(all);
  const next = nextMilestone(streak);

  const ruleDefs: ['askWhy' | 'showPattern', string, string][] = [
    ['askWhy', "Ask why I'm opening it", "Reply · Post · Find · Scroll · Don't know"],
    ['showPattern', 'Show me my pattern', 'Your own numbers during the pause'],
  ];

  const testPause = () => { window.location.href = `${window.location.pathname}?pause`; };
  const resetData = () => {
    if (window.confirm('Delete all your Friction history on this phone?')) commit(d => ({ ...emptyData(), rules: d.rules }));
  };

  return (
    <FrictionApp v={{
      fTab,
      fTabs: [['today', 'Today'], ['rules', 'Rules'], ['streak', 'Streak']].map(([key, label]) => ({ key, label, active: fTab === key, go: () => setFTab(key) })),
      dateLabel: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      attempts: today.length,
      stopped,
      rate,
      rateLabel: rate + '%',
      savedLabel: stopped * MINUTES_SAVED_PER_STOP + 'm',
      vulnerableTime: vulnerableTime(all),
      topIntent: topIntent(all),
      recent: all.slice(-6).reverse().map(a => ({
        key: String(a.id),
        t: clock(a.id),
        intent: a.intent ?? 'No answer',
        waited: a.waited,
        stayLabel: isToday(a.id) ? '' : ` · ${when(a.id)}`,
        result: a.result,
        ...chipColors(a.result),
      })),
      watchSource: 'Via iPhone Shortcuts',
      ruleRows: ruleDefs.map(([key, label, sub], i) => ({
        key, label, sub, first: i === 0, on: data.rules[key],
        toggle: () => commit(d => ({ ...d, rules: { ...d.rules, [key]: !d.rules[key] } })),
      })),
      pauseLabel: PAUSE_SECONDS + 's',
      rulesFooter: <SetupCard onTest={testPause} onReset={resetData} />,
      streak,
      best: bestStreak(all),
      nextMilestone: `${next} in a row`,
      milestoneFilled: Math.round((streak / next) * 10),
      decisions: all.slice(-14).map(a => a.result === 'Never mind'),
    }} />
  );
}

function SetupCard({ onTest, onReset }: { onTest: () => void; onReset: () => void }) {
  const btn = { height: 44, borderRadius: 14, border: 0, fontSize: 14, fontWeight: 700, cursor: 'pointer' } as const;
  return (
    <div style={{ background: '#18181B', borderRadius: 20, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 15, fontWeight: 600 }}>How it's connected</span>
      <span style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.45 }}>
        A Shortcuts automation sends you here whenever Instagram opens. Choosing "Open Instagram" runs the
        "{OPEN_SHORTCUT}" shortcut, which lets you in for 10 minutes.
      </span>
      <button onClick={onTest} style={{ ...btn, background: '#F4F4F5', color: '#0E0E10' }}>Test the pause</button>
      <button onClick={onReset} style={{ ...btn, background: 'transparent', color: '#9CA3AF', fontWeight: 600 }}>Reset my data</button>
    </div>
  );
}
