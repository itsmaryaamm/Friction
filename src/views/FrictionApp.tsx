import type { ReactNode } from 'react';
import { IG_GRADIENT, MONO, Ring, SANS, SERIF, monoLabel } from './shared';

export interface FrictionAppVM {
  fTab: string;
  fTabs: { key: string; label: string; active: boolean; go: () => void }[];
  dateLabel: string;
  attempts: number;
  stopped: number;
  rate: number;
  rateLabel: string;
  savedLabel: string;
  vulnerableTime: string;
  topIntent: string;
  recent: { key: string; t: string; intent: string; waited: number; stayLabel: string; result: string; chipBg: string; chipFg: string }[];
  watchSource: string;
  ruleRows: { key: string; label: string; sub: string; first: boolean; on: boolean; toggle: () => void }[];
  pauseLabel: string;
  /** Extra content at the bottom of the Rules tab. */
  rulesFooter?: ReactNode;
  streak: number;
  best: number;
  nextMilestone: string;
  milestoneFilled: number;
  /** Most recent decisions, oldest first; true = never mind. */
  decisions: boolean[];
}

type VMProps = { v: FrictionAppVM };

const muted = '#9CA3AF';
const card = { background: '#18181B', borderRadius: 20 } as const;
const divider = '1px solid rgba(255,255,255,.07)';

function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={monoLabel(11, muted)}>{eyebrow}</span>
      <span style={{ font: `700 28px/1.1 ${SANS}`, letterSpacing: '-.01em' }}>{title}</span>
    </div>
  );
}

export default function FrictionApp({ v }: VMProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0E0E10', color: '#F4F4F5', display: 'flex', flexDirection: 'column', animation: 'fr-pop .25s ease-out' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '62px 22px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {v.fTab === 'today' && <Today v={v} />}
        {v.fTab === 'rules' && <Rules v={v} />}
        {v.fTab === 'streak' && <Streak v={v} />}
      </div>
      <div style={{ height: 86, borderTop: divider, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', paddingBottom: 28, boxSizing: 'border-box', background: '#0E0E10' }}>
        {v.fTabs.map(ft => (
          <button key={ft.key} onClick={ft.go} style={{ border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, color: ft.active ? '#F4F4F5' : '#6B6B73', fontSize: 12, fontWeight: 600 }}>
            <div style={{ width: 22, height: 4, borderRadius: 2, background: ft.active ? '#A855F7' : 'transparent' }} />
            {ft.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Today({ v }: VMProps) {
  const stat = (value: string | number, label: string, mid = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, ...(mid ? { borderLeft: divider, borderRight: divider } : {}) }}>
      <span style={{ fontSize: 22, fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: 12, color: muted }}>{label}</span>
    </div>
  );
  return (
    <>
      <Header eyebrow="Today · Instagram" title={v.dateLabel} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <span style={{ fontSize: 28, lineHeight: 1.15, fontWeight: 700, letterSpacing: '-.01em', textWrap: 'balance' }}>
          You stopped <span style={{ color: '#C084FC' }}>{v.stopped} Instagram {v.stopped === 1 ? 'open' : 'opens'}</span> today.
        </span>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 200, height: 200 }}>
            <Ring size={200} r={86} stroke={16} track="#232327" color="url(#frg)" progress={v.rate / 100}
              defs={<linearGradient id="frg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C084FC" /><stop offset="1" stopColor="#7E22CE" /></linearGradient>} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.02em' }}>{v.rateLabel}</span>
              <span style={{ fontSize: 12, color: muted, textAlign: 'center', lineHeight: 1.3 }}>of attempts<br />stopped</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center' }}>
          {stat(v.attempts, 'Attempts')}
          {stat(v.stopped, 'Stopped', true)}
          {stat(v.savedLabel, 'Time saved')}
        </div>
        <div style={{ background: 'linear-gradient(135deg,rgba(168,85,247,.16),rgba(168,85,247,.05))', border: '1px solid rgba(168,85,247,.25)', borderRadius: 18, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 22, flex: 'none' }}>
            <div style={{ width: 4, height: 8, borderRadius: 2, background: '#A855F7' }} />
            <div style={{ width: 4, height: 14, borderRadius: 2, background: '#A855F7' }} />
            <div style={{ width: 4, height: 22, borderRadius: 2, background: '#C084FC' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>You're in control</span>
            <span style={{ fontSize: 13, color: muted }}>That's {v.savedLabel} back in your day. Keep going.</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ ...card, borderRadius: 18, padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, color: muted }}>Most vulnerable time</span>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{v.vulnerableTime}</span>
        </div>
        <div style={{ ...card, borderRadius: 18, padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, color: muted }}>Most common reason</span>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{v.topIntent}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={monoLabel(11, muted, { marginBottom: 6 })}>Recent attempts</span>
        {v.recent.map(e => (
          <div key={e.key} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: divider }}>
            <span style={{ font: `400 12px ${MONO}`, color: muted }}>{e.t}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{e.intent}</span>
              <span style={{ fontSize: 12, color: muted }}>waited {e.waited}s{e.stayLabel}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 9px', borderRadius: 999, background: e.chipBg, color: e.chipFg }}>{e.result}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Rules({ v }: VMProps) {
  return (
    <>
      <Header eyebrow="Rules" title="One app. One pause." />
      <div style={{ ...card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: IG_GRADIENT, flex: 'none' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Instagram</span>
          <span style={{ fontSize: 12, color: muted }}>{v.watchSource}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#C084FC' }}>Watching</span>
      </div>
      <div style={{ ...card, display: 'flex', flexDirection: 'column' }}>
        {v.ruleRows.map(r => (
          <button key={r.key} role="switch" aria-checked={r.on} onClick={r.toggle} style={{ border: 0, background: 'transparent', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', borderTop: `1px solid ${r.first ? 'transparent' : 'rgba(22,19,15,.08)'}`, color: '#F4F4F5' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{r.label}</span>
              <span style={{ fontSize: 12, color: muted, lineHeight: 1.35 }}>{r.sub}</span>
            </div>
            <div style={{ width: 50, height: 30, borderRadius: 15, background: r.on ? '#A855F7' : '#3A3A40', display: 'flex', justifyContent: r.on ? 'flex-end' : 'flex-start', padding: 3, boxSizing: 'border-box', flex: 'none', transition: 'background .2s' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
            </div>
          </button>
        ))}
      </div>
      <div style={{ ...card, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Pause length</span>
          <span style={{ fontSize: 12, color: muted }}>"Never mind" is always one tap away</span>
        </div>
        <span style={{ font: `400 30px ${SERIF}` }}>{v.pauseLabel}</span>
      </div>
      {v.rulesFooter}
    </>
  );
}

function Streak({ v }: VMProps) {
  return (
    <>
      <Header eyebrow="Streak" title="Never-minds in a row" />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        <span style={{ font: `700 130px/0.85 ${SANS}`, letterSpacing: '-.04em', color: '#C084FC' }}>{v.streak}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 10 }}>
          <span style={{ fontSize: 13, color: muted }}>Best</span>
          <span style={{ fontSize: 22, fontWeight: 700 }}>{v.best}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Next milestone · {v.nextMilestone}</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 5 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{ height: 30, borderRadius: 8, background: i < v.milestoneFilled ? '#A855F7' : '#232327' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={monoLabel(11, muted)}>Last decisions</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {v.decisions.map((stopped, i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: stopped ? '#A855F7' : 'transparent', boxShadow: `inset 0 0 0 2px ${stopped ? '#A855F7' : '#52525B'}` }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: muted }}>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#A855F7' }} />Never mind</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: '50%', boxShadow: 'inset 0 0 0 2px #52525B' }} />Opened</span>
        </div>
      </div>
      <div style={{ ...card, borderRadius: 18, padding: '14px 16px', fontSize: 14, lineHeight: 1.5, color: '#C4C4CC', textWrap: 'pretty' }}>
        Every "Never mind" adds one. Opening Instagram starts a fresh run — no penalty, no guilt.
      </div>
    </>
  );
}
