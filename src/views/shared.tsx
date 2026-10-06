import type { CSSProperties, ReactNode } from 'react';

export const SERIF = "'Instrument Serif',serif";
export const SANS = "'Instrument Sans',sans-serif";
export const MONO = "'JetBrains Mono',monospace";

export const IG_GRADIENT = 'linear-gradient(45deg,#F2A541,#E2456A 52%,#8B4FC2)';
export const PURPLE_BAR = 'linear-gradient(90deg,#C084FC,#9333EA)';

/** Diagonal-stripe image placeholder. */
export const stripes = (a: string, b: string, w: number) =>
  `repeating-linear-gradient(135deg,${a} 0 ${w}px,${b} ${w}px ${w * 2}px)`;
export const AVATAR = (w: number) => stripes('#ECE7DF', '#E0D9CE', w);

export const monoLabel = (size: number, color: string, extra: CSSProperties = {}): CSSProperties => ({
  font: `500 ${size}px ${MONO}`,
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color,
  ...extra,
});

/** The Friction logo: two rounded purple bars, tilted. */
export function FrictionMark({ w, h, gap }: { w: number; h: number; gap: number }) {
  const bar: CSSProperties = { width: w, height: h, borderRadius: h, background: PURPLE_BAR };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, transform: 'rotate(-32deg)' }}>
      <div style={bar} />
      <div style={bar} />
    </div>
  );
}

/** Instagram camera glyph (white outline). */
export function IgGlyph({ size }: { size: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 10, border: '3px solid #fff', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', border: '3px solid #fff' }} />
    </div>
  );
}

/** Circular progress ring, starting at 12 o'clock. `progress` is 0–1. */
export function Ring({ size, r, stroke, track, color, progress, defs }: {
  size: number; r: number; stroke: number; track: string; color: string; progress: number; defs?: ReactNode;
}) {
  const c = 2 * Math.PI * r;
  const half = size / 2;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
      {defs && <defs>{defs}</defs>}
      <circle cx={half} cy={half} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={half} cy={half} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, Math.max(0, progress)))} />
    </svg>
  );
}
