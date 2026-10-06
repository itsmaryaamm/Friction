import type { ViewModel } from '../FrictionDemo';
import { IG_GRADIENT, IgGlyph, MONO, SERIF } from './shared';

export default function ShieldScreen({ v }: { v: ViewModel }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#1E1A16', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 26px 60px', boxSizing: 'border-box', animation: 'fr-pop .2s ease-out' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
        <div style={{ width: 68, height: 68, borderRadius: 17, background: IG_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IgGlyph size={34} />
        </div>
        <span style={{ font: `400 48px/1 ${SERIF}`, color: '#F3EDE2', marginTop: 6 }}>Hold on.</span>
        <span style={{ fontSize: 17, lineHeight: 1.4, color: '#F3EDE2', fontWeight: 500 }}>You were about to open Instagram.</span>
        <span style={{ fontSize: 15, color: '#A69C8F' }}>{v.shieldSub}</span>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button className="press-98" onClick={v.shieldContinue} style={{ height: 54, borderRadius: 16, border: 0, background: '#F3EDE2', color: '#16130F', fontSize: 17, fontWeight: 600, cursor: 'pointer' }}>Continue →</button>
        <button onClick={v.neverMind} style={{ height: 50, borderRadius: 16, border: 0, background: 'transparent', color: '#F3EDE2', fontSize: 16, fontWeight: 500, cursor: 'pointer' }}>Never mind</button>
      </div>
      <span style={{ position: 'absolute', bottom: 24, font: `400 9.5px ${MONO}`, color: '#6E655B', letterSpacing: '.08em' }}>SCREEN TIME SHIELD · FRICTION</span>
    </div>
  );
}
