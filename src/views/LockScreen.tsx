import type { ViewModel } from '../FrictionDemo';
import { Ring, SERIF, monoLabel } from './shared';

const glass = { background: 'rgba(255,255,255,.16)', backdropFilter: 'blur(20px)' } as const;

export default function LockScreen({ v }: { v: ViewModel }) {
  return (
    <button onClick={v.unlock} style={{ position: 'absolute', inset: 0, border: 0, cursor: 'pointer', textAlign: 'center', background: 'radial-gradient(120% 70% at 30% 20%,#8A5A3A 0%,#3B2A20 50%,#16130F 100%)', color: '#F7F1E7', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '96px 0 0', boxSizing: 'border-box' }}>
      <span style={{ fontSize: 19, fontWeight: 600, opacity: 0.9 }}>{v.dateLabel}</span>
      <span style={{ font: `400 104px/1 ${SERIF}`, letterSpacing: '-.02em', marginTop: 2 }}>{v.clock}</span>
      <div style={{ display: 'flex', gap: 12, marginTop: 14, alignItems: 'center' }}>
        <div style={{ ...glass, width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Ring size={72} r={30} stroke={5} track="rgba(255,255,255,.22)" color="#F7F1E7" progress={v.rate / 100} />
          <span style={{ fontSize: 17, fontWeight: 700 }}>{v.rateLabel}</span>
        </div>
        <div style={{ ...glass, width: 170, height: 72, borderRadius: 22, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '0 16px', boxSizing: 'border-box', gap: 2 }}>
          <span style={monoLabel(10, 'inherit', { opacity: 0.75 })}>Friction</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{v.stopped} opens stopped</span>
          <span style={{ fontSize: 13, opacity: 0.85 }}>{v.streak} streak</span>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 14, fontWeight: 500, opacity: 0.7, marginBottom: 44 }}>Tap to unlock</span>
    </button>
  );
}
