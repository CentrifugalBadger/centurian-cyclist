// Domain types — see PRD §5.

export type Phase = 'base' | 'build' | 'peak' | 'taper';

export type ActivityType = 'ride' | 'lift' | 'yoga' | 'run' | 'rest';

export type Interval = {
  durationMin: number;
  pctFtp: number;
  label?: string;
};

export type Workout = {
  id: string;
  date: string;
  type: ActivityType;
  name: string;
  tss: number;
  durationMin: number;
  targetWatts?: number;
  intervals?: Interval[];
  intensityFactor?: number;
  normalizedPower?: number;
  kJ?: number;
  completed: boolean;
  activityId?: string;
};

export type DailyMetric = {
  date: string;
  weightKg?: number;
  bodyFatPct?: number;
  hrvRmssd?: number;
  restingHr?: number;
  sleepHours?: number;
  readinessScore?: number;
};

export type LoadPoint = {
  date: string;
  ctl: number;
  atl: number;
  tsb: number;
};

export type MealSlot =
  | 'breakfast'
  | 'pre-ride'
  | 'on-bike'
  | 'lunch'
  | 'snack'
  | 'dinner';

export type Meal = {
  id: string;
  timestamp: string;
  slot: MealSlot;
  items: { foodId: string; grams: number }[];
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type EventPriority = 'A' | 'B' | 'C';

export type RaceEvent = {
  id: string;
  name: string;
  date: string;
  distanceKm: number;
  elevationM: number;
  priority: EventPriority;
};

export type PlanApproach = 'polarized' | 'sweet-spot' | 'pyramidal';

export type PlanWeek = {
  n: number;
  phase: Phase;
  hours: number;
  recovery: boolean;
};

export type Plan = {
  startDate: string;
  weeks: PlanWeek[];
  eventId: string;
  approach: PlanApproach;
};

// UI tweaks
export type AccentKey = 'green' | 'orange' | 'yellow' | 'blue' | 'white';
export type Density = 'minimal' | 'medium' | 'dense';
