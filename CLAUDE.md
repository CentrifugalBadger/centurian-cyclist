# Claude memory — centurian-cyclist

Single-user training tracker for Zaid's **Bike the Coast 100** (Oceanside CA, Sat Oct 24 2026). 24-week polarized plan, Mon May 11 2026 → Sat Oct 24 2026.

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- pnpm, Node 22
- No backend yet — all state is in-memory React Context
- Deploys to GitHub Pages via `.github/workflows/pages.yml` (push to `main`)
- Base path: `/centurian-cyclist/` (set in `vite.config.ts`)

## Plan model

`src/data/plan.ts` is the canonical source.

- `PLAN_DATA.weeks[24]` — one row per training week; each holds 7 `PlanDay` rows (Mon..Sun, `d=0..6`).
- Phases: Base 1-8, Build 9-16, Peak 17-22, Taper 23-24.
- `TODAY_W = 1`, `TODAY_D = 0` (Mon May 11 2026). Day-of-plan = `(w-1)*7 + d`. Race = W24 D5.
- `dateForDay(w, d)` returns a UTC Date. `formatShort(date)` → "Mon · May 11".
- `dayKind(planDay)` → `'rest' | 'quality' | 'long_ride'`. Drives `KCAL_TARGETS` and `MACRO_TARGETS`.
- `RACE`, `ATHLETE_NAME`, `DAYS_TO_RACE` exposed for the Hero card.
- Plan TSS values are coarse — they drive heatmap intensity, not training prescription.

## State

- `WorkoutLogProvider` in `src/data/workoutLog.tsx` holds per-(w, plannedD) workout entries: status, rpe, durationMin, distanceMi, avgHr, notes, savedAt.
- `WeightLogProvider` in `src/data/weightLog.tsx` holds an ascending array of `{ date: 'YYYY-MM-DD', weightLb, source, loggedAt }`. Exposes `latest()` and `rollingAvg(days)`.
- `SwapsProvider` in `src/data/swaps.tsx` holds per-week permutations σ where `σ[effectiveSlot] = plannedSlot`. Missing weeks default to identity. `swapBlocker(w, a, b)` enforces the "no 3 consecutive long-ride days" rule (PRD FR-4.5).
- Hooks:
  - `useWorkoutLog()` → `{ getEntry, saveEntry, clearEntry }`. **Keys are planned slots** — log entries stay attached to their workout regardless of swaps.
  - `useWeightLog()` → `{ entries, latest, rollingAvg, save, remove }`.
  - `useSwaps()` → `{ effectiveDay, plannedSlot, effectiveSlot, isSwapped, swapBlocker, swap, resetWeek }`. Components render off `effectiveDay(w, effD)` and log against `plannedSlot(w, effD)`.
- **Nothing is persisted yet** — that's the final roadmap step.

## UI shape

- `App.tsx` — root, 4 tabs (Today / Calendar / Plan / Body), accent + density loaded from localStorage.
- `screens/Today.tsx` — Hero, SessionCard (today's workout, derived from plan), WeekStrip (tappable to open log), Load / Recovery / Macros / Fueling / Alerts / Next-3. Load / Recovery / Alerts are still placeholder.
- `screens/Calendar.tsx` — Week / Agenda / Heat modes. All three render real plan rows and open the WorkoutSheet on tap.
- `screens/Body.tsx` — Weight hero (start/target/7-day avg/projection/sparkline) backed by `useWeightLog`; benchmark TT comparison (W1/8/16/22) derived from `useWorkoutLog` entries on each Tue.
- `components/LogSheet.tsx` — meal + weight bottom sheet. Weight form is wired to `useWeightLog` in lb (±1 / ±0.1 adjusters). Meal form is still mock content.
- `components/WorkoutSheet.tsx` — workout log bottom sheet: status (Done/Partial/Modified/Skipped), RPE 1-10, duration, distance (ride/run only), avg HR, notes.
- `components/SwapSheet.tsx` — "Move workout" bottom sheet: pick another day in the same week to swap with. Disabled targets show the blocking reason (e.g. "Would create 3 consecutive long rides"). Includes a "Reset week" action when the week has been swapped.

## Plan constants

- `WEIGHT_START_LB = 240`, `WEIGHT_TARGET_LB = 215` — PRD goal of 20-30 lb loss.
- `BENCHMARK_WEEKS = [1, 8, 16, 22]` — the four 20-min TT calibration points.

## Conventions

- One activity type per day (`ride | lift | yoga | run | rest`). Strength + run on the same calendar day collapses to whatever dominates.
- All hardcoded "Theo / Mt Tam / 27d countdown" copy was placeholder. Today derives everything from `plan.ts`.
- Power-meter UI deliberately omitted — Zaid is on a Diverge with Claris, no power meter (per PRD).
- No emojis in source unless asked.

## Workflow

- `pnpm build` is the gate: `tsc -b && vite build`. Treat it as the test suite for now (there are no Vitest/Playwright tests yet).
- Feature work goes on a `claude/<thing>` branch → draft PR → merge once build is green.
- `.github/workflows/pages.yml` includes `enablement: true` on `actions/configure-pages@v5`, so Pages auto-enables on first run.

## Roadmap

In progress, work-down order:

1. ~~Workout detail / log flow~~ — merged.
2. ~~Body screen with real targets~~ — merged.
3. ~~Day-shifting~~ — merged. Within-week swap via the SwapSheet picker, triggered from Today SessionCard's "Move" button, Calendar Week-mode DayCard, and a small ⇆ button on each Calendar agenda row. Day-type and kcal target follow the workout automatically because all consumers render off `effectiveDay()`. The no-3-consecutive-long-rides constraint is enforced in `swapBlocker`.
4. Persistence — localStorage round-trip for workout log, weight, meals, and swap permutations.

## Source PRD

`PRD: Century Coach` and the actual `24-Week Cycling Training Plan: Bike the Coast 100` live in conversation history (not yet checked in). The plan is encoded in `src/data/plan.ts` SEEDS.
