import { Component, type ChangeEvent, type KeyboardEvent } from 'react';
import DemoView from './views/DemoView';

export type Screen = 'lock' | 'home' | 'shield' | 'intervene' | 'insta' | 'friction';
type FTab = 'today' | 'rules' | 'streak';
type ITab = 'feed' | 'reels' | 'dms';
type RuleKey = 'everyOpen' | 'askWhy' | 'showPattern';
type Result = 'Opened' | 'Never mind';

interface LogEntry {
  n: number;
  t: string;
  intent: string;
  waited: number;
  result: Result;
  stay?: number;
}

interface Thread {
  id: string;
  name: string;
  unread: boolean;
  msgs: { me: boolean; t: string }[];
}

interface Toast {
  title: string;
  body: string;
}

export interface DemoState {
  screen: Screen;
  fTab: FTab;
  iTab: ITab;
  thread: string | null;
  draft: string;
  attempts: number;
  stopped: number;
  streak: number;
  best: number;
  /** Simulated clock, in minutes since midnight. */
  min: number;
  /** Seconds elapsed in the current pause. */
  elapsed: number;
  intent: string | null;
  variant: number;
  toast: Toast | null;
  caption: string | null;
  playing: boolean;
  lastIntent: string;
  lastStay: number;
  reel: number;
  reelCount: number;
  liked: Record<string, boolean>;
  rules: Record<RuleKey, boolean>;
  log: LogEntry[];
  threads: Thread[];
  sessionSec: number;
  sessionIntent: string | null;
  lastIntentPending: string | null;
  prevStreak: number;
}

export interface DemoProps {
  /** Show the narrative panel and live metric panel beside the phone. */
  showPanels?: boolean;
  /** Length of the intervention pause, in seconds (min 3). */
  pauseSeconds?: number;
}

const INTENTS = ['Reply to someone', 'Post something', 'Find something', 'Just scrolling', "I don't know"];

const DONE_LINES: Record<string, string> = {
  'Reply to someone': 'Go reply. Then come back.',
  'Post something': 'Post it. Then come back.',
  'Find something': 'Find it. Then close it.',
  'Just scrolling': 'You know what this is. Still your choice.',
};

const APPS: [string, string][] = [
  ['Calendar', '#B65C4A'], ['Photos', '#C9A24A'], ['Camera', '#5B5550'], ['Clock', '#3A3633'],
  ['Maps', '#5E8A6A'], ['Weather', '#4E7BA6'], ['Notes', '#C8A23E'], ['Mail', '#4C72B0'],
  ['Music', '#B8455A'], ['Files', '#4F6FA0'], ['Settings', '#6D6863'],
];

const DOCK: [string, string][] = [['Phone', '#4F8A5B'], ['Browser', '#4C72B0'], ['Messages', '#5DA06A']];

const REELS = [
  { user: 'campus.eats', cap: "rating every dining hall so you don't have to", ph: 'reel · vertical video', likes: '48.2K', comments: '912' },
  { user: 'studywithjen', cap: 'pov: 3am and the deadline is 9am', ph: 'reel · vertical video', likes: '201K', comments: '3.1K' },
  { user: 'ali.k', cap: 'this cat understood the assignment', ph: 'reel · vertical video', likes: '1.2M', comments: '14K' },
];

const POSTS = [
  { id: 'p1', user: 'maya.k', place: 'Library, 3rd floor', ph: 'photo · study desk', likes: 128, cap: 'finals szn survival kit' },
  { id: 'p2', user: 'uni.dbclub', place: 'Sponsored by Student Union', ph: 'photo · event poster', likes: 342, cap: 'SQL workshop moved to Thursday 6pm — bring a laptop' },
  { id: 'p3', user: 'sam_r', place: '', ph: 'photo · sunset', likes: 87, cap: 'walked home the long way' },
];

const RULES: [RuleKey, string, string][] = [
  ['everyOpen', 'Step in every time I open Instagram', 'The shield appears on every launch'],
  ['askWhy', "Ask why I'm opening it", "Reply · Post · Find · Scroll · Don't know"],
  ['showPattern', 'Show me my pattern', 'Your own numbers during the pause'],
];

const MILESTONES = [5, 10, 25, 50];

function initialState(): DemoState {
  return {
    screen: 'lock', fTab: 'today', iTab: 'feed', thread: null, draft: '',
    attempts: 16, stopped: 5, streak: 3, best: 7, min: 10 * 60 + 42,
    elapsed: 0, intent: null, variant: 0, toast: null, caption: null, playing: false,
    lastIntent: 'Reply to someone', lastStay: 24, reel: 0, reelCount: 1, liked: {},
    rules: { everyOpen: true, askWhy: true, showPattern: true },
    log: [
      { n: 12, t: '09:12', intent: 'Reply to someone', waited: 15, result: 'Opened', stay: 24 },
      { n: 13, t: '09:41', intent: 'Just scrolling', waited: 6, result: 'Never mind' },
      { n: 14, t: '10:03', intent: 'Find something', waited: 15, result: 'Opened', stay: 9 },
      { n: 15, t: '10:21', intent: "I don't know", waited: 4, result: 'Never mind' },
      { n: 16, t: '10:33', intent: 'Just scrolling', waited: 8, result: 'Never mind' },
    ],
    threads: [
      { id: 'sarah', name: 'Sarah · DB group', unread: true, msgs: [{ me: false, t: 'did you finish the ER diagram?' }, { me: false, t: 'need it before 5 pls' }] },
      { id: 'club', name: 'uni.dbclub', unread: false, msgs: [{ me: false, t: 'Workshop moved to Thursday' }, { me: true, t: 'noted 👍' }] },
      { id: 'ali', name: 'ali.k', unread: false, msgs: [{ me: false, t: 'sent you a reel' }] },
      { id: 'mom', name: 'Mom', unread: false, msgs: [{ me: false, t: 'Call me when free' }] },
    ],
    sessionSec: 0, sessionIntent: null, lastIntentPending: null, prevStreak: 0,
  };
}

function fmt(m: number) {
  const h = Math.floor(m / 60) % 24, mm = m % 60;
  return `${h}:${String(mm).padStart(2, '0')}`;
}

function ord(n: number) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default class FrictionDemo extends Component<DemoProps, DemoState> {
  state = initialState();
  /** Bumped to cancel an in-flight guided demo. */
  runId = 0;
  timer: ReturnType<typeof setInterval> | null = null;
  sessT: ReturnType<typeof setInterval> | undefined;
  toastT: ReturnType<typeof setTimeout> | undefined;

  get D() {
    return Math.max(3, this.props.pauseSeconds ?? 15);
  }

  componentWillUnmount() {
    this.stopTimer();
    clearInterval(this.sessT);
    clearTimeout(this.toastT);
    this.runId++;
  }

  stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  showToast(t: Toast) {
    clearTimeout(this.toastT);
    this.setState({ toast: t });
    this.toastT = setTimeout(() => this.setState({ toast: null }), 3400);
  }

  go(screen: Screen, extra: Partial<DemoState> = {}) {
    this.stopTimer();
    if (screen === 'insta' && this.state.screen !== 'insta') {
      clearInterval(this.sessT);
      const t0 = Date.now();
      extra = { ...extra, sessionSec: 0, sessionIntent: extra.lastIntentPending || this.state.intent || null };
      this.sessT = setInterval(() => this.setState({ sessionSec: Math.floor((Date.now() - t0) / 1000) }), 1000);
    } else if (screen !== 'insta') {
      clearInterval(this.sessT);
    }
    this.setState({ screen, ...extra } as DemoState);
  }

  tapInstagram = () => {
    const s = this.state;
    const min = s.min + 3;
    if (!s.rules.everyOpen) {
      this.setState({
        min,
        attempts: s.attempts + 1,
        log: [...s.log, { n: s.attempts + 1, t: fmt(min), intent: 'Rule off', waited: 0, result: 'Opened' }],
        streak: 0,
      });
      return this.go('insta', { iTab: 'feed', thread: null });
    }
    this.go('shield', { attempts: s.attempts + 1, min });
  };

  shieldContinue = () => {
    this.stopTimer();
    this.setState(s => ({ screen: 'intervene', elapsed: 0, intent: null, variant: s.variant + 1 }));
    const t0 = Date.now();
    this.timer = setInterval(() => {
      const e = Math.min(this.D, (Date.now() - t0) / 1000);
      this.setState({ elapsed: e });
      if (e >= this.D) this.stopTimer();
    }, 80);
  };

  record(result: Result): LogEntry[] {
    const s = this.state;
    const atShield = s.screen === 'shield';
    return [...s.log, {
      n: s.attempts,
      t: fmt(s.min),
      intent: atShield ? 'At shield' : (s.intent || 'No answer'),
      waited: Math.round(atShield ? 0 : s.elapsed),
      result,
    }];
  }

  neverMind = () => {
    const s = this.state;
    const streak = s.streak + 1, stopped = s.stopped + 1;
    const log = this.record('Never mind');
    this.go('home', { streak, stopped, best: Math.max(s.best, streak), log });
    this.showToast({ title: `Instagram closed. ${streak} in a row.`, body: `${stopped} autopilot opens stopped today` });
  };

  openInsta = () => {
    const s = this.state;
    const log = this.record('Opened');
    this.go('insta', {
      log, streak: 0, iTab: 'feed', thread: null,
      lastIntentPending: s.intent || "I don't know", prevStreak: s.streak,
    });
  };

  goHome = () => {
    const s = this.state;
    if (s.screen === 'insta') {
      const it = s.lastIntentPending;
      const stay = it === 'Just scrolling' || it === "I don't know" ? 27 : it === 'Reply to someone' ? 21 : 12;
      const log = s.log.slice();
      const last = log[log.length - 1];
      if (last && last.result === 'Opened' && !last.stay) log[log.length - 1] = { ...last, stay };
      this.go('home', { lastIntent: it || s.lastIntent, lastStay: stay, log, min: s.min + stay, lastIntentPending: null });
      if (s.prevStreak) this.showToast({ title: 'Fresh run.', body: `Last run: ${s.prevStreak} never-minds · best ${s.best}` });
      return;
    }
    this.go('home');
  };

  reset = () => {
    this.runId++;
    this.stopTimer();
    clearInterval(this.sessT);
    clearTimeout(this.toastT);
    this.setState(initialState());
  };

  pickIntent(label: string) {
    this.setState({ intent: label });
  }

  sendMsg() {
    const s = this.state;
    if (!s.draft.trim() || !s.thread) return;
    this.setState({
      draft: '',
      threads: s.threads.map(t => (t.id === s.thread ? { ...t, msgs: [...t.msgs, { me: true, t: s.draft.trim() }] } : t)),
    });
  }

  stopPlaying() {
    this.runId++;
    this.setState({ playing: false, caption: null });
  }

  async autoplay() {
    this.reset();
    const run = this.runId;
    this.setState({ playing: true });
    const w = (ms: number) =>
      new Promise<void>((res, rej) => setTimeout(() => (this.runId === run ? res() : rej(new Error('stop'))), ms));
    const cap = (c: string | null) => this.setState({ caption: c });
    const D = this.D * 1000;
    try {
      cap("Lock screen widget: today's stopped opens and the never-mind streak."); await w(3200);
      this.go('home'); cap('Home screen. Friction lives in a widget — the student never has to "start a session".'); await w(3400);
      cap('Mid-assignment, on autopilot: tap Instagram.'); await w(1600);
      this.tapInstagram(); cap('Screen Time shield fires instantly. Understood in under a second.'); await w(3200);
      this.shieldContinue(); cap("Continue doesn't open Instagram. The pause starts — and asks why."); await w(2200);
      this.pickIntent('Just scrolling'); cap('Then a mirror: their own behaviour, not a lecture.'); await w(4200);
      cap('"Never mind" is available the whole time. Friction is toward Instagram, never toward the good choice.'); await w(2600);
      this.neverMind(); await w(3600);
      cap('Later — a real reason to open it.'); this.tapInstagram(); await w(2000);
      this.shieldContinue(); await w(1500);
      this.pickIntent('Reply to someone'); cap('Intentional opens still work. They just wait the full pause.'); await w(Math.max(1000, D - 1500 + 700));
      cap('At zero: no guilt, no second timer. Open it.'); await w(1800);
      this.openInsta(); cap('Instagram opens normally — feed…'); await w(2800);
      this.setState({ iTab: 'reels' }); cap('…reels…'); await w(2200);
      this.setState({ iTab: 'dms', thread: 'sarah' }); cap('…and the DM they actually came for.'); await w(2800);
      this.goHome(); await w(2200);
      this.go('friction', { fTab: 'today' }); cap('Inside Friction: attempts vs. changed minds — the core metric.'); await w(3600);
      this.setState({ fTab: 'rules' }); cap('Rules: one app, one pause. Nothing to configure.'); await w(3000);
      this.setState({ fTab: 'streak' }); cap('Streak: consecutive never-minds. Opening starts a fresh run, no penalty.'); await w(3600);
      cap(null);
    } catch {
      // Cancelled by the user or by reset.
    }
    if (this.runId === run) this.setState({ playing: false });
  }

  /** Everything the view needs, derived from state. */
  viewModel() {
    const s = this.state, D = this.D, e = s.elapsed;
    const rate = s.attempts ? Math.round((s.stopped / s.attempts) * 100) : 0;
    const scr = s.screen;
    // Any manual tap on the phone takes over from the guided demo.
    const tap = (fn: () => void) => () => {
      if (s.playing) this.stopPlaying();
      fn();
    };

    const third = D / 3;
    let phase: 'intent' | 'reality' | 'plain' | 'final' | 'done' = 'intent';
    if (scr === 'intervene') {
      if (e >= D) phase = 'done';
      else if (e >= third * 2) phase = 'final';
      else if (s.rules.askWhy && !s.intent && e < third) phase = 'intent';
      else phase = s.rules.showPattern ? 'reality' : 'plain';
    }

    const recentCount = s.log.slice(-3).length;
    const v = s.variant % 3;
    const reality = !s.intent && s.rules.askWhy && v !== 1
      ? { h: 'No answer usually means autopilot.', s: `This is your ${ord(s.attempts)} open today.` }
      : v === 1 ? { h: `Last time you said "${s.lastIntent}."`, s: `You stayed ${s.lastStay} minutes.` }
      : v === 2 ? { h: `This is your ${ord(s.attempts)} Instagram open today.`, s: `You changed your mind ${s.stopped} times.` }
      : { h: `${ord(recentCount + 1)} check in the last 40 minutes.`, s: 'Two of those lasted under 2 minutes.' };

    const counts: Record<string, number> = {};
    s.log.forEach(l => { if (INTENTS.includes(l.intent)) counts[l.intent] = (counts[l.intent] || 0) + 1; });
    const topIntent = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'Just scrolling';

    const chip = (r: Result) => (r === 'Never mind' ? ['rgba(168,85,247,.18)', '#C084FC'] : ['#232327', '#9CA3AF']);
    const next = MILESTONES.find(m => m > s.streak) || 100;
    const light = scr === 'insta' && s.iTab !== 'reels';
    const thread = s.threads.find(t => t.id === s.thread);
    const notInDemo = (title: string) => () => this.showToast({ title, body: 'Not part of the demo — try Instagram.' });
    const sessionSec = s.sessionSec || 0;

    const steps: [string, string, string, () => void][] = [
      ['01', 'Lock screen widget', 'Glanceable proof: opens stopped and the streak.', () => this.go('lock')],
      ['02', 'Home screen', 'Small widget sits next to Instagram. No app to remember to open.', () => this.go('home')],
      ['03', 'The tap', 'Tap Instagram — the Screen Time shield intercepts.', () => { this.go('home'); this.tapInstagram(); }],
      ['04', 'The 15-second pause', 'Intent → their own pattern → a calm countdown.', () => {
        if (this.state.screen !== 'shield') this.setState(x => ({ attempts: x.attempts + 1, min: x.min + 3 }));
        this.shieldContinue();
      }],
      ['05', 'Mock Instagram', 'Feed, Reels and DMs — what they get after deciding.', () => this.go('insta', { iTab: 'feed', thread: null })],
      ['06', 'Inside Friction', 'Today, Rules and Streak — setup and results only.', () => this.go('friction', { fTab: 'today' })],
    ];

    return {
      showPanels: this.props.showPanels ?? true,
      steps: steps.map(([n, title, why, fn]) => ({ n, title, why, go: tap(fn) })),
      screen: scr,
      clock: fmt(s.min),
      dateLabel: 'Tuesday, October 6',
      attempts: s.attempts, stopped: s.stopped, streak: s.streak, best: s.best,
      rate,
      rateLabel: rate + '%',
      savedLabel: s.stopped * 7 + 'm',
      unlock: tap(() => this.go('home')),
      openStreak: tap(() => this.go('friction', { fTab: 'streak' })),
      openToday: tap(() => this.go('friction', { fTab: 'today' })),
      apps: APPS.map(([name, bg]) => ({ name, bg, letter: name[0], tap: notInDemo(name) })),
      dock: DOCK.map(([name, bg]) => ({ name, bg, letter: name[0], tap: notInDemo(name) })),
      tapInstagram: tap(this.tapInstagram),
      toast: scr === 'home' ? s.toast : null,

      // Shield + intervention
      shieldSub: `You've already opened it ${s.attempts - 1} times today.`,
      shieldContinue: tap(this.shieldContinue),
      neverMind: tap(this.neverMind),
      openInsta: tap(this.openInsta),
      ivTag: `ATTEMPT #${s.attempts} · ${fmt(s.min)}`,
      phase,
      ringColor: phase === 'final' || phase === 'done' ? '#A855F7' : '#F3EDE2',
      ringProgress: e / D,
      ivNum: Math.max(0, Math.ceil(D - e - 0.001)),
      intents: INTENTS.map(label => ({ label, pick: tap(() => this.pickIntent(label)) })),
      reality,
      realityTag: s.intent ? `You said: ${s.intent}` : 'Your pattern',
      doneLine: (s.intent && DONE_LINES[s.intent]) || 'You waited. Still your choice.',
      nevermindLabel: phase === 'done' ? 'Never mind' : 'Actually, never mind',

      // Instagram
      iTab: s.iTab,
      goDms: () => this.setState({ iTab: 'dms', thread: null }),
      stories: ['Your story', 'maya.k', 'dbclub', 'sam_r', 'ali.k', 'jen'],
      posts: POSTS.map(p => {
        const l = !!s.liked[p.id];
        return {
          ...p,
          liked: l,
          likes: p.likes + (l ? 1 : 0),
          like: () => this.setState(x => ({ liked: { ...x.liked, [p.id]: !x.liked[p.id] } })),
        };
      }),
      reel: REELS[s.reel % REELS.length],
      reelCount: `${s.reelCount} WATCHED`,
      nextReel: () => this.setState(x => ({ reel: x.reel + 1, reelCount: x.reelCount + 1 })),
      thread: thread ? { name: thread.name, msgs: thread.msgs } : null,
      threads: s.threads.map(t => ({
        id: t.id,
        name: t.name,
        last: t.msgs[t.msgs.length - 1].t,
        unread: t.unread,
        open: () => this.setState(x => ({ thread: t.id, threads: x.threads.map(y => (y.id === t.id ? { ...y, unread: false } : y)) })),
      })),
      closeThread: () => this.setState({ thread: null }),
      draft: s.draft,
      setDraft: (ev: ChangeEvent<HTMLInputElement>) => this.setState({ draft: ev.target.value }),
      send: () => this.sendMsg(),
      draftKey: (ev: KeyboardEvent<HTMLInputElement>) => { if (ev.key === 'Enter') this.sendMsg(); },
      igTabs: ([['feed', 'Home'], ['reels', 'Reels'], ['dms', 'Messages']] as [ITab, string][]).map(([k, label]) => ({
        key: k,
        label,
        active: s.iTab === k,
        go: () => this.setState({ iTab: k, thread: null }),
      })),
      sessionTime: `${Math.floor(sessionSec / 60)}:${String(sessionSec % 60).padStart(2, '0')}`,
      sessionLabel: s.sessionIntent ? `You said: ${s.sessionIntent}` : 'Session time',
      sessionNote: sessionSec >= 60
        ? `Over a minute. You came to ${(s.sessionIntent || 'look').toLowerCase().replace("i don't know", 'look')}.`
        : null,

      // Friction app
      fTab: s.fTab,
      topIntent,
      recent: s.log.slice(-6).reverse().map(l => {
        const [chipBg, chipFg] = chip(l.result);
        return { ...l, stayLabel: l.stay ? ` · stayed ${l.stay} min` : '', chipBg, chipFg };
      }),
      ruleRows: RULES.map(([k, label, sub], i) => ({
        key: k,
        label,
        sub,
        first: i === 0,
        on: s.rules[k],
        toggle: () => this.setState(x => ({ rules: { ...x.rules, [k]: !x.rules[k] } })),
      })),
      pauseLabel: D + 's',
      nextMilestone: `${next} in a row`,
      milestoneFilled: Math.round((s.streak / next) * 10),
      decisions: s.log.slice(-14).map(l => l.result === 'Never mind'),
      fTabs: ([['today', 'Today'], ['rules', 'Rules'], ['streak', 'Streak']] as [FTab, string][]).map(([k, label]) => ({
        key: k,
        label,
        active: s.fTab === k,
        go: () => this.setState({ fTab: k }),
      })),

      // Chrome
      light,
      statusColor: light ? '#111' : '#F3EDE2',
      showHomeBar: scr === 'insta' || scr === 'friction',
      goHome: tap(this.goHome),
      captionText: s.caption || (s.playing ? '' : 'Tap anything on the phone, or play the guided demo.'),
      playLabel: s.playing ? 'Stop demo' : 'Play guided demo',
      togglePlay: () => { if (s.playing) this.stopPlaying(); else void this.autoplay(); },
      reset: this.reset,
      eventLog: s.log.slice(-7).reverse(),
    };
  }

  render() {
    return <DemoView v={this.viewModel()} />;
  }
}

export type ViewModel = ReturnType<FrictionDemo['viewModel']>;
