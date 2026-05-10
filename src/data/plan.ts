// Mock plan data — generates the 24-week build for the Calendar screen.
// Today is week 17 day 6 (Sun May 10, 2026), mid-Build.

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
  { name: 'Build', weeks: [9, 18], color: 'var(--accent)' },
  { name: 'Peak', weeks: [19, 22], color: 'oklch(0.78 0.16 35)' },
  { name: 'Taper', weeks: [23, 24], color: 'oklch(0.7 0.16 280)' },
];

function generatePlan(): PlanData {
  const TODAY_W = 17;
  const TODAY_D = 6;
  const weeks: PlanWeekRow[] = [];

  for (let w = 1; w <= 24; w++) {
    const phase = PHASES.find((p) => w >= p.weeks[0] && w <= p.weeks[1])!;
    const days: PlanDay[] = [];
    for (let d = 0; d < 7; d++) {
      const past = w < TODAY_W || (w === TODAY_W && d < TODAY_D);
      const today = w === TODAY_W && d === TODAY_D;
      let type: ActivityType = 'ride';
      let tss = 0;
      let name = '';
      const isTaper = phase.name === 'Taper';
      const isPeak = phase.name === 'Peak';
      const isBase = phase.name === 'Base';
      switch (d) {
        case 0:
          type = 'rest';
          tss = 0;
          name = 'Rest';
          break;
        case 1:
          type = 'ride';
          tss = 90 - (isBase ? 20 : 0) - (isTaper ? 30 : 0);
          name = isBase ? 'Z2 1h' : 'VO₂';
          break;
        case 2:
          type = 'lift';
          tss = isTaper ? 0 : 38;
          name = isTaper ? 'Mobility' : 'Lift';
          break;
        case 3:
          type = 'ride';
          tss = 105 - (isTaper ? 50 : 0);
          name = isTaper ? 'Openers' : 'Threshold';
          break;
        case 4:
          type = 'yoga';
          tss = 18;
          name = 'Mobility';
          break;
        case 5:
          type = 'ride';
          tss = isBase ? 160 : (isPeak ? 240 : 215) - (isTaper ? 80 : 0);
          name = isBase ? 'Long Z2' : 'Endurance';
          break;
        case 6:
          type = 'ride';
          tss = isBase ? 95 : isPeak ? 170 : 142;
          name = isPeak ? 'Race sim' : 'Sweet spot';
          break;
      }
      if (w === 24 && d === 5) {
        type = 'ride';
        tss = 280;
        name = 'A-RACE';
      }
      if (w === 24 && d === 6) {
        type = 'rest';
        tss = 0;
        name = 'Recovery';
      }
      days.push({ type, tss, name, past, today, completed: past });
    }
    weeks.push({ w, phase, days });
  }
  return { weeks, phases: PHASES, today: { w: TODAY_W, d: TODAY_D } };
}

export const PLAN_DATA: PlanData = generatePlan();

export const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
