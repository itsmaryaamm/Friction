import type { Phase } from './views/InterventionScreen';

/** Shared Friction rules, used by both the investor demo and the live app. */

export const INTENTS = ['Reply to someone', 'Post something', 'Find something', 'Just scrolling', "I don't know"];

export const DONE_LINES: Record<string, string> = {
  'Reply to someone': 'Go reply. Then come back.',
  'Post something': 'Post it. Then come back.',
  'Find something': 'Find it. Then close it.',
  'Just scrolling': 'You know what this is. Still your choice.',
};

export const DEFAULT_DONE_LINE = 'You waited. Still your choice.';

export const MILESTONES = [5, 10, 25, 50];

export const nextMilestone = (streak: number) => MILESTONES.find(m => m > streak) || 100;

/** Rough minutes saved per stopped open. */
export const MINUTES_SAVED_PER_STOP = 7;

export function ord(n: number) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Which step of the pause to show. The first third asks for intent, the
 * middle third mirrors the user's pattern, the last third is a calm
 * countdown, and at zero the choice is theirs.
 */
export function pausePhase(elapsed: number, duration: number, opts: { askWhy: boolean; showPattern: boolean; intent: string | null }): Phase {
  const third = duration / 3;
  if (elapsed >= duration) return 'done';
  if (elapsed >= third * 2) return 'final';
  if (opts.askWhy && !opts.intent && elapsed < third) return 'intent';
  return opts.showPattern ? 'reality' : 'plain';
}

export const chipColors = (result: string) =>
  result === 'Never mind' ? { chipBg: 'rgba(168,85,247,.18)', chipFg: '#C084FC' } : { chipBg: '#232327', chipFg: '#9CA3AF' };
