import type { ViewModel } from '../FrictionDemo';
import { IG_GRADIENT, MONO, Ring, SERIF, monoLabel } from './shared';

const headline = { font: `400 36px/1.06 ${SERIF}` } as const;

export default function InterventionScreen({ v }: { v: ViewModel }) {
  const { phase } = v;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#16130F', color: '#F3EDE2', display: 'flex', flexDirection: 'column', padding: '64px 24px 44px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: IG_GRADIENT }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Instagram</span>
        </div>
        <span style={{ font: `400 11px ${MONO}`, color: '#A69C8F', letterSpacing: '.06em' }}>{v.ivTag}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
        <div style={{ position: 'relative', width: 196, height: 196 }}>
          <Ring size={196} r={90} stroke={5} track="#2E2822" color={v.ringColor} progress={v.ringProgress} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <span style={{ font: `400 92px/0.9 ${SERIF}` }}>{v.ivNum}</span>
            <span style={{ font: `400 10px ${MONO}`, color: '#A69C8F', letterSpacing: '.12em' }}>SECONDS</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        {phase === 'intent' && (
          <>
            <span style={{ font: `400 32px/1.08 ${SERIF}`, textAlign: 'center', textWrap: 'balance' }}>What are you opening Instagram for?</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center' }}>
              {v.intents.map(it => (
                <button key={it.label} className="hv-intent press-96" onClick={it.pick} style={{ height: 48, padding: '0 18px', borderRadius: 999, border: '1px solid #3A332C', background: '#221E19', color: '#F3EDE2', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
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
      </div>
    </div>
  );
}
