// Bike the Coast 100 — 24-week plan, Mon May 11 2026 → Sat Oct 24 2026.
// Single source of truth for the Calendar screen.

import type { ActivityType } from '../types';

export type PhaseInfo = {
  name: 'Base' | 'Build' | 'Peak' | 'Taper';
  weeks: [number, number];
  color: string;
};

export type PlanDay = {
  type: ActivityType;
  tss: number;
  name: string;
  past: boolean;
  today: boolean;
  completed: boolean;
};

export type PlanWeekRow = {
  w: number;
  phase: PhaseInfo;
  days: PlanDay[];
};

export type PlanData = {
  weeks: PlanWeekRow[];
  phases: PhaseInfo[];
  today: { w: number; d: number };
};

const PHASES: PhaseInfo[] = [
  { name: 'Base', weeks: [1, 8], color: 'oklch(0.6 0.04 240)' },
  { name: 'Build', weeks: [9, 16], color: 'var(--accent)' },
  { name: 'Peak', weeks: [17, 22], color: 'oklch(0.78 0.16 35)' },
  { name: 'Taper', weeks: [23, 24], color: 'oklch(0.7 0.16 280)' },
];

// Plan starts Mon May 11 2026. Calendar uses Mon..Sun (d=0..6).
const TODAY_W = 1;
const TODAY_D = 0;

type DaySeed = readonly [ActivityType, number, string];

// 24 weeks × 7 days (Mon..Sun). TSS values are coarse — they drive heatmap
// intensity, not training prescription.
const SEEDS: readonly (readonly DaySeed[])[] = [
  // W1 Base 1 — May 11-17, 5.5 hrs. Baseline TT.
  [
    ['rest', 0, 'Rest'],
    ['ride', 85, 'TT Test #1'],
    ['lift', 28, 'Strength A'],
    ['ride', 50, 'Z2 60\''],
    ['lift', 28, 'Strength B'],
    ['ride', 92, 'Long Z2 1:45'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W2 Base 1 — May 18-24, 6.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 72, '4×4 Z3'],
    ['lift', 30, 'Strength A'],
    ['ride', 65, 'Z2 + spinups'],
    ['lift', 30, 'Strength B'],
    ['ride', 105, 'Long Z2 2:00'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W3 Base 1 — May 25-31, 6.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 80, '3×8 Z3 tempo'],
    ['lift', 32, 'Strength A'],
    ['ride', 68, 'Z2 + force'],
    ['lift', 32, 'Strength B'],
    ['ride', 128, 'Long Z2 2:30'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W4 Recovery — Jun 1-7, 4.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 52, 'Z2 60\' + openers'],
    ['lift', 22, 'Light lift'],
    ['ride', 48, 'Easy Z2 60\''],
    ['yoga', 12, 'Mobility'],
    ['ride', 75, 'Long 1:30 easy'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W5 Base 2 — Jun 8-14, 7.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 82, '4×6 Z3'],
    ['lift', 35, 'Strength A'],
    ['ride', 80, 'Z2 + force 90\''],
    ['lift', 35, 'Strength B'],
    ['ride', 155, 'Long Z2 3:00'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W6 Base 2 — Jun 15-21, 7.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 96, '2×15 SS'],
    ['lift', 35, 'Strength A'],
    ['ride', 80, 'Z2 90\''],
    ['lift', 35, 'Strength B'],
    ['ride', 180, 'Long Z2 3:30'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W7 Base 2 — Jun 22-28, 7.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 100, '3×10 SS'],
    ['lift', 35, 'Strength A'],
    ['ride', 78, 'Z2 + surges'],
    ['lift', 35, 'Strength B'],
    ['ride', 205, 'Long Z2 4:00'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W8 Recovery + Test — Jun 29 – Jul 5, 5.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 88, 'TT Test #2'],
    ['lift', 22, 'Light lift'],
    ['ride', 50, 'Z2 60\''],
    ['yoga', 12, 'Mobility'],
    ['ride', 105, 'Long Z2 2:00'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W9 Base 3 — Jul 6-12, 7.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 108, '2×20 SS'],
    ['lift', 35, 'Strength A'],
    ['ride', 65, 'Z2 75\''],
    ['lift', 35, 'Strength B'],
    ['ride', 235, 'Long 4h + 2×20'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W10 Base 3 — Jul 13-19, 8.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 112, '3×12 Z3'],
    ['lift', 35, 'Strength A'],
    ['ride', 80, 'Z2 90\''],
    ['lift', 35, 'Strength B'],
    ['ride', 235, 'Long 4:30 rolling'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W11 Base 3 — Jul 20-26, 7.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 115, '4×8 Z4'],
    ['lift', 28, 'Maint. lift'],
    ['ride', 65, 'Z2 75\''],
    ['lift', 28, 'Maint. lift'],
    ['ride', 255, 'Long Z2 5:00'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W12 Recovery — Jul 27 – Aug 2, 5.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 55, 'Z2 60\' + Z4 openers'],
    ['lift', 22, 'Light lift'],
    ['ride', 48, 'Easy Z2 60\''],
    ['yoga', 12, 'Mobility'],
    ['ride', 128, 'Long Z2 2:30'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W13 Build + Heat #1 — Aug 3-9, 7.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 118, '2×20 Z4'],
    ['lift', 35, 'Strength A'],
    ['ride', 72, 'Z2 75\' heat'],
    ['lift', 35, 'Strength B'],
    ['ride', 215, 'Long 4h heat'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W14 Build + Heat #2 — Aug 10-16, 8.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 130, '3×15 Z4'],
    ['lift', 35, 'Strength A'],
    ['ride', 75, 'Z2 75\' + sauna'],
    ['lift', 35, 'Strength B'],
    ['ride', 245, 'Long 4:30 heat'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W15 Build — Aug 17-23, 8.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 122, '5×6 Z4'],
    ['lift', 35, 'Strength A'],
    ['ride', 80, 'Z2 90\''],
    ['lift', 35, 'Strength B'],
    ['ride', 290, 'Long 5h race-pace'],
    ['run', 25, 'Z2 run 30\''],
  ],
  // W16 Recovery + Test — Aug 24-30, 5.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 90, 'TT Test #3'],
    ['lift', 22, 'Light lift'],
    ['ride', 48, 'Easy Z2 60\''],
    ['yoga', 12, 'Mobility'],
    ['ride', 128, 'Long Z2 2:30'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W17 Peak 1 — Aug 31 – Sep 6, 8.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 125, '3×15 Z4'],
    ['lift', 28, 'Maint. lift'],
    ['ride', 78, 'Z2 + force'],
    ['lift', 28, 'Maint. lift'],
    ['ride', 295, 'Long 5:30 race-pace'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W18 Peak 2 — Sep 7-13, 8.0 hrs. Course recon.
  [
    ['rest', 0, 'Rest'],
    ['ride', 132, '4×12 Z4'],
    ['lift', 28, 'Maint. lift'],
    ['ride', 50, 'Z2 60\''],
    ['lift', 28, 'Maint. lift'],
    ['ride', 310, 'Long 6h on course'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W19 Peak 3 — Sep 14-20, 8.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 122, '2×20 Z4'],
    ['lift', 28, 'Maint. lift'],
    ['ride', 65, 'Z2 75\''],
    ['lift', 28, 'Maint. lift'],
    ['ride', 280, 'Long 5h race-pace ×4'],
    ['run', 18, 'Z2 run 20\''],
  ],
  // W20 Recovery — Sep 21-27, 5.5 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 55, 'Z2 60\' + openers'],
    ['lift', 22, 'Light lift'],
    ['ride', 48, 'Easy Z2 60\''],
    ['yoga', 12, 'Mobility'],
    ['ride', 155, 'Long Z2 3:00'],
    ['run', 22, 'Z2 run 25\''],
  ],
  // W21 Dress Rehearsal — Sep 28 – Oct 4, 8.5 hrs. 90mi on actual course.
  [
    ['rest', 0, 'Rest'],
    ['ride', 125, '3×15 Z4'],
    ['lift', 28, 'Maint. lift'],
    ['ride', 92, 'Z2 + 3×8 Z3'],
    ['lift', 28, 'Maint. lift'],
    ['ride', 360, 'Dress Reh. 90mi'],
    ['rest', 0, 'Rest'],
  ],
  // W22 Sharpening — Oct 5-11, 6.5 hrs. Final benchmark.
  [
    ['rest', 0, 'Rest'],
    ['ride', 92, 'TT Test #4'],
    ['lift', 22, 'Light lift'],
    ['ride', 75, 'Z2 + 4×3 Z4'],
    ['yoga', 12, 'Mobility'],
    ['ride', 165, 'Long 3h race-pace'],
    ['rest', 0, 'Rest'],
  ],
  // W23 Taper Wk 1 — Oct 12-18, 4.0 hrs.
  [
    ['rest', 0, 'Rest'],
    ['ride', 55, 'Z2 60\' + 4×4 Z4'],
    ['lift', 22, 'Light lift'],
    ['ride', 38, 'Easy Z2 45\''],
    ['yoga', 12, 'Mobility'],
    ['ride', 140, 'Long 2:30 + Z3'],
    ['rest', 0, 'Rest'],
  ],
  // W24 Race Week — Oct 19-25.
  [
    ['rest', 0, 'Rest'],
    ['ride', 30, 'Openers 45\''],
    ['rest', 0, 'Rest'],
    ['ride', 22, 'Easy Z2 30\''],
    ['ride', 12, 'V. easy spin 20\''],
    ['ride', 380, 'RACE 100mi'],
    ['rest', 0, 'Recovery walk'],
  ],
];

function buildPlan(): PlanData {
  const weeks: PlanWeekRow[] = SEEDS.map((seed, i) => {
    const w = i + 1;
    const phase = PHASES.find((p) => w >= p.weeks[0] && w <= p.weeks[1])!;
    const days: PlanDay[] = seed.map(([type, tss, name], d) => {
      const past = w < TODAY_W || (w === TODAY_W && d < TODAY_D);
      const today = w === TODAY_W && d === TODAY_D;
      return { type, tss, name, past, today, completed: past };
    });
    return { w, phase, days };
  });
  return { weeks, phases: PHASES, today: { w: TODAY_W, d: TODAY_D } };
}

export const PLAN_DATA: PlanData = buildPlan();

export const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

// ---- plan meta + date helpers ------------------------------------------------

export const ATHLETE_NAME = 'Zaid';

export const RACE = {
  name: 'Bike the Coast 100',
  dateLabel: 'Sat Oct 24',
  distanceKm: 161,
  elevationM: 1005, // 3,300 ft on the published course
};

// Body composition reference (PRD: ~240 lb start, 20-30 lb target loss).
export const WEIGHT_START_LB = 240;
export const WEIGHT_TARGET_LB = 215;

// The four 20-min benchmark TT weeks (Tue session in W1 / W8 / W16 / W22).
export const BENCHMARK_WEEKS = [1, 8, 16, 22] as const;
export type BenchmarkWeek = (typeof BENCHMARK_WEEKS)[number];

export type DayKind = 'rest' | 'quality' | 'long_ride';

export const KCAL_TARGETS: Record<DayKind, number> = {
  rest: 2100,
  quality: 2600,
  long_ride: 3200,
};

// Macro split shaped to the day's training load.
export const MACRO_TARGETS: Record<DayKind, { protein: number; carbs: number; fat: number }> = {
  rest: { protein: 140, carbs: 190, fat: 70 },
  quality: { protein: 150, carbs: 290, fat: 75 },
  long_ride: { protein: 160, carbs: 420, fat: 80 },
};

export function dayKind(day: PlanDay): DayKind {
  if (day.type === 'rest' || day.type === 'yoga') return 'rest';
  if (day.tss >= 200) return 'long_ride';
  return 'quality';
}

const RACE_DAY_IDX = (24 - 1) * 7 + 5; // W24 D5
const TODAY_DAY_IDX = (TODAY_W - 1) * 7 + TODAY_D;
export const DAYS_TO_RACE = RACE_DAY_IDX - TODAY_DAY_IDX;

const PLAN_START_MS = Date.UTC(2026, 4, 11); // May 11 2026

export function dateForDay(w: number, d: number): Date {
  return new Date(PLAN_START_MS + ((w - 1) * 7 + d) * 86_400_000);
}

const SHORT_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatShort(d: Date): string {
  return `${SHORT_DOW[d.getUTCDay()]} · ${SHORT_MON[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export const TODAY_DATE = dateForDay(TODAY_W, TODAY_D);

// Today's plan-week shortcut. Use useSwaps().effectiveDay for the actual workout shown today.
export const TODAY_WEEK: PlanWeekRow = PLAN_DATA.weeks[TODAY_W - 1];
