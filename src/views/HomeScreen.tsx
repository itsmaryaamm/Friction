import type { ViewModel } from '../FrictionDemo';
import { FrictionMark, IgGlyph, SANS, SERIF } from './shared';

const iconTile = { width: 62, height: 62, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
const letterTile = { ...iconTile, color: 'rgba(255,255,255,.92)', font: `600 21px ${SANS}` } as const;
const appButton = { border: 0, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', padding: 0 } as const;
const appLabel = { fontSize: 11, color: '#F3EDE2', fontWeight: 500 } as const;

export default function HomeScreen({ v }: { v: ViewModel }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 20% 10%,#6B5242 0%,#2E241D 55%,#16130F 100%)', padding: '66px 20px 0', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: 86, gap: '16px 14px' }}>
        <StreakWidget v={v} />
        {v.apps.map(app => (
          <button key={app.name} className="press-94" onClick={app.tap} style={appButton}>
            <div style={{ ...letterTile, background: app.bg, boxShadow: '0 4px 10px rgba(0,0,0,.22)' }}>{app.letter}</div>
            <span style={appLabel}>{app.name}</span>
          </button>
        ))}
        <button className="press-94" onClick={v.openToday} style={appButton}>
          <div style={{ ...iconTile, background: 'linear-gradient(160deg,#26262A,#141416)', boxShadow: '0 4px 10px rgba(0,0,0,.3),inset 0 0 0 1px rgba(255,255,255,.08)' }}>
            <FrictionMark w={29} h={8} gap={5} />
          </div>
          <span style={appLabel}>Friction</span>
        </button>
      </div>

      {/* Dock */}
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, height: 94, borderRadius: 34, background: 'rgba(243,237,226,.16)', backdropFilter: 'blur(20px)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', alignItems: 'center', justifyItems: 'center', padding: '0 8px' }}>
        {v.dock.map(d => (
          <button key={d.name} className="press-94" onClick={d.tap} title={d.name} style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer' }}>
            <div style={{ ...letterTile, background: d.bg }}>{d.letter}</div>
          </button>
        ))}
        <button className="press-90" onClick={v.tapInstagram} title="Instagram" style={{ ...iconTile, border: 0, padding: 0, cursor: 'pointer', background: 'linear-gradient(45deg,#F2A541 0%,#E2456A 52%,#8B4FC2 100%)' }}>
          <IgGlyph size={32} />
        </button>
      </div>

      {v.toast && (
        <div style={{ position: 'absolute', top: 54, left: 12, right: 12, background: 'rgba(243,237,226,.97)', borderRadius: 22, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 12px 30px rgba(0,0,0,.35)', animation: 'fr-drop .3s ease-out' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#1C1C1F', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <FrictionMark w={17} h={5} gap={3} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{v.toast.title}</span>
            <span style={{ fontSize: 13, color: '#4D463E' }}>{v.toast.body}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StreakWidget({ v }: { v: ViewModel }) {
  return (
    <button className="press-97" onClick={v.openStreak} style={{ gridColumn: 'span 2', gridRow: 'span 2', border: 0, borderRadius: 24, background: '#141416', padding: '14px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left', cursor: 'pointer', color: '#F4F4F5', boxShadow: '0 10px 26px rgba(0,0,0,.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FrictionMark w={8} h={2} gap={1} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#F4F4F5' }}>Friction</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ font: `400 58px/0.85 ${SERIF}`, color: '#C084FC' }}>{v.streak}</span>
        <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2, marginTop: 4 }}>streak</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignSelf: 'stretch' }}>
        <div style={{ height: 5, borderRadius: 3, background: '#2A2A2E', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: v.rateLabel, background: '#A855F7', borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{v.stopped} of {v.attempts} stopped today</span>
      </div>
    </button>
  );
}
