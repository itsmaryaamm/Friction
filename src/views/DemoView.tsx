import { useEffect, useState } from 'react';
import type { ViewModel } from '../FrictionDemo';
import { FrictionMark, MONO, SERIF, monoLabel } from './shared';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import ShieldScreen from './ShieldScreen';
import InterventionScreen from './InterventionScreen';
import InstagramScreen from './InstagramScreen';
import FrictionApp from './FrictionApp';

const PHONE_QUERY = '(max-width: 500px)';

/** True on a real phone, where the demo runs full-screen like an app. */
function useIsPhone() {
  const [isPhone, setIsPhone] = useState(() => window.matchMedia(PHONE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const onChange = () => setIsPhone(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isPhone;
}

export default function DemoView({ v }: { v: ViewModel }) {
  const isPhone = useIsPhone();
  if (isPhone) {
    return (
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#16130F' }}>
        <PhoneScreen v={v} fullscreen />
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap', gap: 48, justifyContent: 'center', alignItems: 'center', padding: '48px 32px', boxSizing: 'border-box' }}>
      {v.showPanels && <StoryPanel v={v} />}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <Phone v={v} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 414, maxWidth: '100%' }}>
          <div style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 15, lineHeight: 1.4, fontWeight: 500, color: '#16130F', textWrap: 'balance', padding: '0 8px' }}>
            {v.captionText}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="hv-play" onClick={v.togglePlay} style={{ border: 0, background: '#16130F', color: '#F3EDE2', borderRadius: 999, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#A855F7' }} />
              {v.playLabel}
            </button>
            <button className="hv-reset" onClick={v.reset} style={{ border: '1px solid rgba(22,19,15,.2)', background: 'transparent', color: '#16130F', borderRadius: 999, padding: '11px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {v.showPanels && <MetricPanel v={v} />}
    </div>
  );
}

function StoryPanel({ v }: { v: ViewModel }) {
  return (
    <div style={{ width: 320, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#1C1C1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FrictionMark w={14} h={4} gap={2} />
          </div>
          <div style={monoLabel(11, '#6B6258')}>Friction · investor demo</div>
        </div>
        <div style={{ font: `400 42px/1.02 ${SERIF}`, letterSpacing: '-.01em', textWrap: 'pretty' }}>
          Friction catches the taps you didn't mean to make.
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.5, color: '#4D463E', textWrap: 'pretty' }}>
          It doesn't stop Instagram. It stops <em>unconscious</em> Instagram — a 15-second pause, a reason, and a mirror of your own pattern.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {v.steps.map(st => (
          <button key={st.n} className="hv-step" onClick={st.go} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 10, textAlign: 'left', background: 'transparent', border: 0, borderTop: '1px solid rgba(22,19,15,.12)', padding: '13px 6px 13px 0', cursor: 'pointer', color: '#16130F' }}>
            <span style={{ font: `500 12px ${MONO}`, color: '#7E22CE', paddingTop: 2 }}>{st.n}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{st.title}</span>
              <span style={{ fontSize: 13, lineHeight: 1.45, color: '#6B6258', textWrap: 'pretty' }}>{st.why}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricPanel({ v }: { v: ViewModel }) {
  return (
    <div style={{ width: 300, maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <span style={monoLabel(11, '#6B6258')}>Core metric · live</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ font: `400 76px/0.9 ${SERIF}` }}>{v.rateLabel}</span>
        <span style={{ fontSize: 14, color: '#4D463E' }}>impulse opens prevented</span>
        <span style={{ font: `400 12px ${MONO}`, color: '#8A7F72', marginTop: 4 }}>{v.stopped} abandoned ÷ {v.attempts} attempts</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={monoLabel(11, '#6B6258', { marginBottom: 8 })}>Event log</span>
        {v.eventLog.map(ev => (
          <div key={`${ev.n}-${ev.t}-${ev.result}`} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 10, padding: '9px 0', borderTop: '1px solid rgba(22,19,15,.12)', fontSize: 13, animation: 'fr-pop .3s ease-out' }}>
            <span style={{ font: `400 11px ${MONO}`, color: '#8A7F72', paddingTop: 2 }}>{ev.t}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 600 }}>#{ev.n} · {ev.intent}</span>
              <span style={{ color: '#6B6258' }}>
                waited {ev.waited}s → <b style={{ color: ev.result === 'Never mind' ? '#7E22CE' : '#16130F' }}>{ev.result}</b>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Phone({ v }: { v: ViewModel }) {
  return (
    <div style={{ width: 414, height: 868, borderRadius: 64, background: '#0B0A09', padding: 12, boxSizing: 'border-box', boxShadow: '0 40px 80px -30px rgba(22,19,15,.55),inset 0 0 0 2px #2B2724', flex: 'none' }}>
      <div style={{ position: 'relative', width: 390, height: 844, borderRadius: 52, overflow: 'hidden', background: '#16130F' }}>
        <PhoneScreen v={v} />
      </div>
    </div>
  );
}

/**
 * The phone's contents. Framed on desktop; on a real phone it fills the
 * viewport and the device's own status bar replaces the drawn one.
 */
function PhoneScreen({ v, fullscreen = false }: { v: ViewModel; fullscreen?: boolean }) {
  const sc = v.screen;
  return (
    <>
      {sc === 'lock' && <LockScreen v={v} />}
      {sc === 'home' && <HomeScreen v={v} />}
      {sc === 'shield' && <ShieldScreen v={v} />}
      {sc === 'intervene' && <InterventionScreen v={v} />}
      {sc === 'insta' && <InstagramScreen v={v} />}
      {sc === 'friction' && <FrictionApp v={v} />}

      {!fullscreen && (
        <>
          {/* Status bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 34px 0 44px', boxSizing: 'border-box', pointerEvents: 'none', color: v.statusColor, fontSize: 16, fontWeight: 600 }}>
            <span>{v.clock}</span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 18, height: 11, borderRadius: 2, border: `1.5px solid ${v.statusColor}`, opacity: 0.5 }} />
              <div style={{ width: 26, height: 12, borderRadius: 4, border: `1.5px solid ${v.statusColor}`, padding: 1.5, boxSizing: 'border-box' }}>
                <div style={{ width: '70%', height: '100%', borderRadius: 2, background: v.statusColor }} />
              </div>
            </div>
          </div>
          {/* Dynamic island */}
          <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 124, height: 36, borderRadius: 20, background: '#000', pointerEvents: 'none' }} />
        </>
      )}
      {v.showHomeBar && (
        <button onClick={v.goHome} title="Go home" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 180, height: 26, border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <div style={{ width: 134, height: 5, borderRadius: 3, background: v.statusColor }} />
        </button>
      )}
    </>
  );
}
