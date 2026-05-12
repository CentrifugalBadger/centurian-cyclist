import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PLAN_DATA, dayKind, type PlanDay } from './plan';

// Per-week permutation: σ[effectiveSlot] = plannedSlot.
// A missing week means identity (no swaps).
type SwapState = Record<number, number[]>;

const IDENTITY: readonly number[] = [0, 1, 2, 3, 4, 5, 6];

function identity(): number[] {
  return [...IDENTITY];
}

function perm(state: SwapState, w: number): number[] {
  return state[w] ?? identity();
}

function threeConsecutiveLongRides(w: number, p: number[]): boolean {
  let run = 0;
  for (let i = 0; i < 7; i++) {
    const planned = p[i];
    const d = PLAN_DATA.weeks[w - 1].days[planned];
    if (dayKind(d) === 'long_ride') {
      run += 1;
      if (run >= 3) return true;
    } else {
      run = 0;
    }
  }
  return false;
}

type Ctx = {
  // Look up the workout currently shown at calendar slot `effD` in week `w`.
  effectiveDay(w: number, effD: number): PlanDay;
  // Where does the workout shown at slot effD originally come from? (planned slot)
  plannedSlot(w: number, effD: number): number;
  // Inverse: at which effective slot is the workout planned for slot plannedD now showing?
  effectiveSlot(w: number, plannedD: number): number;
  isSwapped(w: number): boolean;
  // Returns null if the swap is allowed; a reason string if not.
  swapBlocker(w: number, a: number, b: number): string | null;
  swap(w: number, a: number, b: number): void;
  resetWeek(w: number): void;
};

const SwapsContext = createContext<Ctx | null>(null);

export function SwapsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SwapState>({});

  const effectiveDay = useCallback(
    (w: number, effD: number) => {
      const p = perm(state, w);
      return PLAN_DATA.weeks[w - 1].days[p[effD]];
    },
    [state],
  );

  const plannedSlot = useCallback(
    (w: number, effD: number) => perm(state, w)[effD],
    [state],
  );

  const effectiveSlot = useCallback(
    (w: number, plannedD: number) => perm(state, w).indexOf(plannedD),
    [state],
  );

  const isSwapped = useCallback(
    (w: number) => {
      const p = state[w];
      if (!p) return false;
      return p.some((v, i) => v !== i);
    },
    [state],
  );

  const swapBlocker = useCallback(
    (w: number, a: number, b: number) => {
      if (a === b) return 'Same day';
      const p = [...perm(state, w)];
      [p[a], p[b]] = [p[b], p[a]];
      if (threeConsecutiveLongRides(w, p)) {
        return 'Would create 3 consecutive long rides';
      }
      return null;
    },
    [state],
  );

  const swap = useCallback((w: number, a: number, b: number) => {
    setState((prev) => {
      const p = [...(prev[w] ?? identity())];
      [p[a], p[b]] = [p[b], p[a]];
      return { ...prev, [w]: p };
    });
  }, []);

  const resetWeek = useCallback((w: number) => {
    setState((prev) => {
      const next = { ...prev };
      delete next[w];
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      effectiveDay,
      plannedSlot,
      effectiveSlot,
      isSwapped,
      swapBlocker,
      swap,
      resetWeek,
    }),
    [effectiveDay, plannedSlot, effectiveSlot, isSwapped, swapBlocker, swap, resetWeek],
  );

  return <SwapsContext.Provider value={value}>{children}</SwapsContext.Provider>;
}

export function useSwaps(): Ctx {
  const ctx = useContext(SwapsContext);
  if (!ctx) throw new Error('useSwaps must be used within SwapsProvider');
  return ctx;
}
