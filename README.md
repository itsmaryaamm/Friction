# Friction

Interactive investor demo for Friction, an app that puts a short, deliberate pause in front of Instagram so that autopilot opens become intentional ones.

Built from the Claude Design prototype `Friction Prototype.dc.html`.

## Run

```sh
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build into dist/
```

## On your phone

The demo is published to GitHub Pages at https://itsmaryaamm.github.io/Friction/ by `.github/workflows/deploy.yml` on every push.

On a phone-sized screen it runs full-screen without the device frame or side panels. In Safari, tap **Share → Add to Home Screen** to open it like an app.

## Live app (real Instagram)

On a phone, or with `?app`, the site is the real Friction app: Today / Rules / Streak from real data stored on the device (localStorage). Opened with `?pause`, it runs the shield and 15-second pause for one Instagram attempt.

It's wired to the real Instagram with iPhone Shortcuts, which is free and needs no developer account. Both pieces live on the phone; the website can't change them.

- **Automation** (Instagram → Is Opened → Run Immediately):
  Get `friction-pass.txt` → Get Date Modified → If Date Modified is in the last 10 minutes: Stop This Shortcut → End If → Open `https://itsmaryaamm.github.io/Friction/?pause`
- **`Friction Open` shortcut**, run by **Open Instagram** after the pause:
  Save the pass text to `friction-pass.txt` (overwrite on) → Start Timer for 10 minutes (Clock) → Open Instagram

Every intent gets the same 10-minute pass. The Clock timer only shows how much of that pass is left (Lock Screen and, where supported, Dynamic Island). It counts elapsed time, including time outside Instagram, and alerts when it ends, but it doesn't close or block Instagram. On iOS 17 and later, Start Timer adds a new timer alongside any already running; on iOS 16 and earlier, the Clock app has a single timer, which this replaces.

Add `?demo` to see the investor demo on a phone.

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
