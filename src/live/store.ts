/** Real usage data for the live app, kept in this browser's localStorage. */

export type Result = 'Never mind' | 'Opened';

export interface Attempt {
  /** Creation time in ms; doubles as the id. */
  id: number;
  intent: string | null;
  /** Seconds waited before deciding. */
  waited: number;
  /** Starts as 'Never mind': walking away without choosing counts as a stop. */
  result: Result;
}

export interface LiveData {
  attempts: Attempt[];
  rules: { askWhy: boolean; showPattern: boolean };
}

const KEY = 'friction.live.v1';

export const emptyData = (): LiveData => ({ attempts: [], rules: { askWhy: true, showPattern: true } });

export function load(): LiveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...emptyData(), ...JSON.parse(raw) };
  } catch {
    // Storage unavailable or corrupt: start fresh.
  }
  return emptyData();
}

export function save(d: LiveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
    // Private mode or full storage; the app still works for this visit.
  }
}

const dayKey = (ms: number) => new Date(ms).toDateString();
export const isToday = (ms: number) => dayKey(ms) === dayKey(Date.now());

export function clock(ms: number) {
  const d = new Date(ms);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function when(ms: number) {
  if (isToday(ms)) return `at ${clock(ms)}`;
  if (dayKey(ms) === dayKey(Date.now() - 86400000)) return `yesterday at ${clock(ms)}`;
  return `on ${new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

/** Consecutive never-minds at the end of the list. */
export function currentStreak(list: Attempt[]) {
  let n = 0;
  for (let i = list.length - 1; i >= 0 && list[i].result === 'Never mind'; i--) n++;
  return n;
}

export function bestStreak(list: Attempt[]) {
  let best = 0, run = 0;
  for (const a of list) {
    run = a.result === 'Never mind' ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

const hourLabel = (h: number) => `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;

/** The one-hour window with the most attempts, e.g. "11 PM – 12 AM". */
export function vulnerableTime(list: Attempt[]) {
  if (!list.length) return '—';
  const counts = new Array(24).fill(0);
  list.forEach(a => counts[new Date(a.id).getHours()]++);
  const h = counts.indexOf(Math.max(...counts));
  return `${hourLabel(h)} – ${hourLabel((h + 1) % 24)}`;
}

export function topIntent(list: Attempt[]) {
  const counts: Record<string, number> = {};
  list.forEach(a => { if (a.intent) counts[a.intent] = (counts[a.intent] || 0) + 1; });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || '—';
}
