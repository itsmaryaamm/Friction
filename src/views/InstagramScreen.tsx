import type { ViewModel } from '../FrictionDemo';
import { AVATAR, FrictionMark, IG_GRADIENT, MONO, SANS, SERIF, monoLabel, stripes } from './shared';

export default function InstagramScreen({ v }: { v: ViewModel }) {
  const reels = v.iTab === 'reels';
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', color: '#111', display: 'flex', flexDirection: 'column', animation: 'fr-pop .25s ease-out' }}>
      {v.iTab === 'feed' && <Feed v={v} />}
      {reels && <Reels v={v} />}
      {v.iTab === 'dms' && (v.thread ? <ThreadView v={v} /> : <Inbox v={v} />)}

      <SessionBar v={v} />

      <div style={{ height: 84, borderTop: `1px solid ${reels ? '#222' : '#EFEFEF'}`, background: reels ? '#111' : '#fff', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', paddingBottom: 26, boxSizing: 'border-box' }}>
        {v.igTabs.map(tb => (
          <button key={tb.key} onClick={tb.go} style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: tb.active ? 800 : 500, color: reels ? (tb.active ? '#fff' : '#9A9089') : (tb.active ? '#111' : '#8A8A8A') }}>
            {tb.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Feed({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ padding: '54px 16px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ font: `italic 400 30px ${SERIF}` }}>Instagram</span>
        <button onClick={v.goDms} style={{ border: 0, background: 'transparent', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 6 }}>Messages</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: 14, padding: '6px 14px 12px', overflowX: 'auto', borderBottom: '1px solid #EFEFEF' }}>
          {v.stories.map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 'none' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', padding: 2.5, background: IG_GRADIENT, boxSizing: 'border-box' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2.5px solid #fff', boxSizing: 'border-box', background: AVATAR(6) }} />
              </div>
              <span style={{ fontSize: 11, color: '#333' }}>{s}</span>
            </div>
          ))}
        </div>
        {v.posts.map(p => (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: AVATAR(5) }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{p.user}</span>
                <span style={{ fontSize: 11, color: '#777' }}>{p.place}</span>
              </div>
            </div>
            <div style={{ height: 390, background: stripes('#F0ECE5', '#E6E0D6', 10), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ font: `400 11px ${MONO}`, color: '#8C8276', background: '#F7F4EF', padding: '4px 8px', borderRadius: 4 }}>{p.ph}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, padding: '10px 14px 4px', alignItems: 'center' }}>
              <button onClick={p.like} aria-label={p.liked ? 'Unlike' : 'Like'} style={{ border: 0, background: 'transparent', padding: 0, fontSize: 24, lineHeight: 1, cursor: 'pointer', color: p.liked ? '#E2456A' : '#111' }}>
                {p.liked ? '♥' : '♡'}
              </button>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{p.likes} likes</span>
            </div>
            <span style={{ fontSize: 13, padding: '0 14px', lineHeight: 1.4 }}><b>{p.user}</b> {p.cap}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Reels({ v }: { v: ViewModel }) {
  return (
    <button onClick={v.nextReel} style={{ flex: 1, border: 0, padding: 0, cursor: 'pointer', position: 'relative', background: stripes('#25211D', '#1D1A17', 12), color: '#fff', textAlign: 'left' }}>
      <span style={{ position: 'absolute', top: 58, left: 16, fontSize: 20, fontWeight: 700 }}>Reels</span>
      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', font: `400 11px ${MONO}`, color: '#B3A99C', background: 'rgba(0,0,0,.4)', padding: '5px 9px', borderRadius: 4 }}>{v.reel.ph}</span>
      <div style={{ position: 'absolute', right: 14, bottom: 110, display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', fontSize: 12, fontWeight: 600 }}>
        <span style={{ fontSize: 26 }}>♡</span>
        <span>{v.reel.likes}</span>
        <span style={{ fontSize: 22 }}>◌</span>
        <span>{v.reel.comments}</span>
      </div>
      <div style={{ position: 'absolute', left: 16, right: 70, bottom: 100, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{v.reel.user}</span>
        <span style={{ fontSize: 13, lineHeight: 1.4, opacity: 0.9 }}>{v.reel.cap}</span>
        <span style={{ font: `400 10px ${MONO}`, opacity: 0.6 }}>TAP FOR NEXT · {v.reelCount}</span>
      </div>
    </button>
  );
}

function Inbox({ v }: { v: ViewModel }) {
  return (
    <>
      <div style={{ padding: '54px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>Messages</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {v.threads.map(th => (
          <button key={th.id} className="hv-thread" onClick={th.open} style={{ width: '100%', border: 0, background: 'transparent', display: 'flex', gap: 12, alignItems: 'center', padding: '10px 16px', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', flex: 'none', background: AVATAR(6) }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 14, fontWeight: th.unread ? 700 : 500 }}>{th.name}</span>
              <span style={{ fontSize: 13, color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{th.last}</span>
            </div>
            {th.unread && <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#3B6FD8' }} />}
          </button>
        ))}
      </div>
    </>
  );
}

function ThreadView({ v }: { v: ViewModel }) {
  const thread = v.thread!;
  return (
    <>
      <div style={{ padding: '54px 14px 10px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #EFEFEF' }}>
        <button onClick={v.closeThread} aria-label="Back" style={{ border: 0, background: 'transparent', fontSize: 22, cursor: 'pointer', padding: '0 6px' }}>‹</button>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: AVATAR(5) }} />
        <span style={{ fontWeight: 700, fontSize: 15 }}>{thread.name}</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 14px' }}>
        {thread.msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '75%', background: m.me ? '#3B6FD8' : '#EFEFEF', color: m.me ? '#fff' : '#111', padding: '9px 13px', borderRadius: 20, fontSize: 14, lineHeight: 1.35 }}>
            {m.t}
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 14px 40px', display: 'flex', gap: 8 }}>
        <input value={v.draft} onChange={v.setDraft} onKeyDown={v.draftKey} placeholder="Message…" style={{ flex: 1, height: 42, borderRadius: 21, border: '1px solid #DDD', padding: '0 16px', font: `16px ${SANS}`, outline: 'none' }} />
        <button onClick={v.send} style={{ border: 0, background: 'transparent', color: '#3B6FD8', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Send</button>
      </div>
    </>
  );
}

/** Floating Friction pill shown for the whole Instagram session. */
function SessionBar({ v }: { v: ViewModel }) {
  return (
    <div style={{ position: 'absolute', left: 14, right: 14, bottom: 96, zIndex: 5, display: 'flex', flexDirection: 'column', gap: 6, animation: 'fr-drop .35s ease-out' }}>
      {v.sessionNote && (
        <div style={{ alignSelf: 'center', background: 'rgba(168,85,247,.95)', color: '#fff', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 999, animation: 'fr-pop .3s ease-out' }}>
          {v.sessionNote}
        </div>
      )}
      <div style={{ background: v.iTab === 'reels' ? 'rgba(28,28,31,.92)' : 'rgba(20,20,22,.94)', backdropFilter: 'blur(16px)', borderRadius: 999, padding: '8px 8px 8px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 28px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.08)', color: '#F4F4F5' }}>
        <div style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <FrictionMark w={12} h={4} gap={2} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={monoLabel(9.5, '#9CA3AF')}>Friction · on Instagram</span>
          <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.sessionLabel}</span>
        </div>
        <span style={{ font: `500 18px ${MONO}`, color: '#C084FC', fontVariantNumeric: 'tabular-nums' }}>{v.sessionTime}</span>
        <button className="press-96" onClick={v.goHome} style={{ border: 0, borderRadius: 999, background: '#F4F4F5', color: '#0E0E10', fontSize: 13, fontWeight: 700, padding: '9px 14px', cursor: 'pointer' }}>Done</button>
      </div>
    </div>
  );
}
