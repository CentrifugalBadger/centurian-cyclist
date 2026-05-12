# centurian-cyclist

Personal training tracker for **Bike the Coast 100** (Oceanside CA, Oct 24 2026). Renders a 24-week polarized plan, lets you log workouts against it, and computes day-type macros (rest / quality / long ride).

Single-user, no backend, deploys to GitHub Pages as a PWA-ready static site.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:5173/centurian-cyclist/
pnpm build        # tsc -b && vite build
pnpm typecheck    # tsc -b --noEmit
pnpm preview      # serve dist/
```

Node 22 / pnpm 10.

## Project layout

```
src/
  data/
    plan.ts            # 24-week SEEDS, race/athlete metadata, date helpers
    storage.ts         # tiny localStorage wrapper (loadJson/saveJson, `cc.` key prefix)
    workoutLog.tsx     # React Context for workout log entries (keyed by planned slot), persisted
    weightLog.tsx      # React Context for weight entries (lb), persisted
    swaps.tsx          # React Context for per-week day permutations, persisted
  screens/
    Today.tsx          # Hero, today's session, week strip, macros, fueling
    Calendar.tsx       # Week / Agenda / Heat views; tap any day to log
    Plan.tsx           # 24-week browser (read-only)
    Body.tsx           # Weight tracker (start/target/7d avg/projection) + 4-TT comparison
  components/
    LogSheet.tsx       # Meal + weight log sheets
    WorkoutSheet.tsx   # Workout log sheet (status, RPE, duration, HR, notes)
    SwapSheet.tsx      # Move-workout sheet (pick another day in the same week)
    icons.tsx          # Inline SVG icon set
    atoms.tsx          # Spark, Ring, Pill, Stat, SectionH
  theme/
    accent.ts          # accent presets (green/orange/yellow/blue/white)
  styles.css           # design tokens
  App.tsx              # tab shell + sheet host + provider
  main.tsx             # entry
```

## Deployment

Pushes to `main` trigger `.github/workflows/pages.yml`, which builds with pnpm and publishes `dist/` to GitHub Pages at `https://centrifugalbadger.github.io/centurian-cyclist/`. The workflow self-enables Pages (`enablement: true` on `actions/configure-pages@v5`), so no manual repo settings are required.

## Plan editing

The 24-week plan lives as one `SEEDS` array in `src/data/plan.ts`. Each row is 7 tuples (Mon..Sun) of `[type, tss, name]`. Edits to that array flow through to the Calendar, Today, and Plan screens automatically.

## Status

Phase-1 scaffold complete. Workout logging, weight tracking, the 4-TT benchmark comparison, within-week day-shifting, and localStorage persistence are all wired up. Phase-2 (meal logging, Apple Health ingest, benchmark chart, adjustment-trigger inbox) is outlined in `CLAUDE.md`.

### Reset

To wipe local state during dev, run this in the browser console:

```js
Object.keys(localStorage).filter(k => k.startsWith('cc.')).forEach(k => localStorage.removeItem(k))
```
