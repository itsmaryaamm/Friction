# Friction

Interactive investor demo for Friction, an app that puts a short, deliberate pause in front of Instagram so that autopilot opens become intentional ones.

Built from the Claude Design prototype `Friction Prototype.dc.html`.

## Run

```sh
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build into dist/
```

## What's in the demo

A phone mock with a narrative panel on the left and a live metric panel ("impulse opens prevented") plus event log on the right.

| Screen | What it shows |
|---|---|
| Lock screen | Widget with today's stop rate, opens stopped and the never-mind streak |
| Home screen | Streak widget, app grid and Instagram in the dock |
| Screen Time shield | "Hold on." Continue or Never mind |
| The pause | 15-second countdown: asks intent, mirrors the user's own pattern, then "Your call." |
| Mock Instagram | Feed, Reels and DMs, with a floating Friction session timer |
| Friction app | Today (core metric), Rules (toggles) and Streak |

**Play guided demo** runs a captioned walkthrough of the whole story. Tapping anything on the phone takes over manually, and **Reset** restores the seeded state.

`FrictionDemo` accepts `showPanels` (hide the side panels) and `pauseSeconds` (pause length, minimum 3).

## Code layout

- `src/FrictionDemo.tsx`: all demo state, timers, the guided-demo script and the derived view model
- `src/views/`: one component per screen, plus `shared.tsx` (logo mark, progress ring, font tokens)
- `src/styles.css`: global styles, keyframes and hover/press states
