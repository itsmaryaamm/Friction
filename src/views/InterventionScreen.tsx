import { MONO, Ring, SANS, SERIF, monoLabel } from './shared';

const headline = { font: `400 36px/1.06 ${SERIF}` } as const;

/** Steps of the pause, in order. */
export type Phase = 'intent' | 'reality' | 'plain' | 'final' | 'done';

export interface InterventionVM {
  phase: Phase;
  /** Real attempt count, shown as the screen's heading. */
  attempt: number;
  ringColor: string;
  /** 0–1, how much of the pause has elapsed. */
  ringProgress: number;
  ivNum: number;
  intents: { label: string; pick: () => void }[];
  realityTag: string;
  reality: { h: string; s: string };
  doneLine: string;
  nevermindLabel: string;
  openInsta: () => void;
  neverMind: () => void;
  /** Small note under the buttons once Instagram can be opened. */
  openHint?: string;
}

/**
 * The 15-second pause. `fullscreen` is for a real phone browser: padding
 * follows the safe areas and the ring shrinks on short screens.
 */
export default function InterventionScreen({ v, fullscreen = false }: { v: InterventionVM; fullscreen?: boolean }) {
  const { phase } = v;
  // On real phones, scale with the visible height so short screens (iPhone SE
  // with Safari's toolbars) still fit everything without scrolling.
  const ringSize = fullscreen ? 'min(196px, 22svh)' : '196px';
  const questionSize = fullscreen ? 'min(32px, 4.6svh)' : '32px';
  const chipHeight = fullscreen ? 'min(48px, 6.4svh)' : '48px';
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#16130F', color: '#F3EDE2', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto',
      padding: fullscreen
        ? 'calc(env(safe-area-inset-top, 0px) + 28px) 24px calc(env(safe-area-inset-bottom, 0px) + 24px)'
        : '64px 24px 44px',
    }}>
      <h1 style={{ margin: 0, textAlign: 'center', font: `700 30px/1.1 ${SANS}`, letterSpacing: '.1em', textTransform: 'uppercase' }}>
        Attempt <span style={{ color: '#C084FC' }}>#{v.attempt}</span>
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: fullscreen ? 'min(28px, 3svh)' : 26 }}>
        <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
          <Ring size={196} r={90} stroke={5} track="#2E2822" color={v.ringColor} progress={v.ringProgress} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <span style={{ font: `400 ${fullscreen ? 'min(92px, 10svh)' : '92px'}/0.9 ${SERIF}` }}>{v.ivNum}</span>
            <span style={{ font: `400 10px ${MONO}`, color: '#A69C8F', letterSpacing: '.12em' }}>SECONDS</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: fullscreen ? 14 : 18, padding: fullscreen ? '12px 0' : 0 }}>
        {phase === 'intent' && (
          <>
            <span style={{ font: `400 ${questionSize}/1.08 ${SERIF}`, textAlign: 'center', textWrap: 'balance' }}>What are you opening Instagram for?</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center' }}>
              {v.intents.map(it => (
                <button key={it.label} className="hv-intent press-96" onClick={it.pick} style={{ height: chipHeight, padding: '0 18px', borderRadius: 999, border: '1px solid #3A332C', background: '#221E19', color: '#F3EDE2', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  {it.label}
                </button>
              ))}
            </div>
          </>
        )}
        {phase === 'reality' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center', animation: 'fr-pop .35s ease-out' }}>
            <span style={monoLabel(11, '#A855F7')}>{v.realityTag}</span>
            <span style={{ ...headline, textWrap: 'balance' }}>{v.reality.h}</span>
            <span style={{ fontSize: 18, color: '#D9CFC2', fontWeight: 600 }}>{v.reality.s}</span>
          </div>
        )}
        {phase === 'plain' && (
          <span style={{ font: `400 32px/1.1 ${SERIF}`, textAlign: 'center' }}>A few seconds. Then it's your call.</span>
        )}
        {phase === 'final' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center', animation: 'fr-pop .3s ease-out' }}>
            <span style={headline}>Still want to go in?</span>
            <span style={{ fontSize: 16, color: '#C9BFB2' }}>That's fine. Make it intentional.</span>
          </div>
        )}
        {phase === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center', animation: 'fr-pop .3s ease-out' }}>
            <span style={headline}>Your call.</span>
            <span style={{ fontSize: 16, color: '#C9BFB2' }}>{v.doneLine}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {phase === 'done' && (
          <button className="press-98" onClick={v.openInsta} style={{ height: 56, borderRadius: 18, border: 0, background: '#F3EDE2', color: '#16130F', fontSize: 17, fontWeight: 700, cursor: 'pointer', animation: 'fr-pop .25s ease-out' }}>
            Open Instagram
          </button>
        )}
        <button className="hv-dark" onClick={v.neverMind} style={{ height: 52, borderRadius: 18, border: '1px solid #3A332C', background: 'transparent', color: '#F3EDE2', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
          {v.nevermindLabel}
        </button>
        {phase === 'done' && v.openHint && (
          <span style={{ fontSize: 12, color: '#A69C8F', textAlign: 'center', marginTop: 2 }}>{v.openHint}</span>
        )}
      </div>
    </div>
  );
}
