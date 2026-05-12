import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type WeightEntry = {
  date: string; // YYYY-MM-DD
  weightLb: number;
  source: 'manual' | 'health';
  loggedAt: number;
};

type Ctx = {
  entries: WeightEntry[]; // sorted ascending by date
  latest(): WeightEntry | undefined;
  rollingAvg(days: number): number | undefined; // returns avg of last `days` entries (max), undefined if 0
  save(entry: WeightEntry): void;
  remove(date: string): void;
};

const WeightLogContext = createContext<Ctx | null>(null);

function sortByDate(a: WeightEntry, b: WeightEntry) {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

export function WeightLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WeightEntry[]>([]);

  const save = useCallback((entry: WeightEntry) => {
    setEntries((prev) => {
      const without = prev.filter((e) => e.date !== entry.date);
      return [...without, entry].sort(sortByDate);
    });
  }, []);

  const remove = useCallback((date: string) => {
    setEntries((prev) => prev.filter((e) => e.date !== date));
  }, []);

  const latest = useCallback(() => entries[entries.length - 1], [entries]);

  const rollingAvg = useCallback(
    (days: number) => {
      if (entries.length === 0) return undefined;
      const tail = entries.slice(-days);
      const sum = tail.reduce((a, b) => a + b.weightLb, 0);
      return sum / tail.length;
    },
    [entries],
  );

  const value = useMemo<Ctx>(
    () => ({ entries, latest, rollingAvg, save, remove }),
    [entries, latest, rollingAvg, save, remove],
  );

  return <WeightLogContext.Provider value={value}>{children}</WeightLogContext.Provider>;
}

export function useWeightLog(): Ctx {
  const ctx = useContext(WeightLogContext);
  if (!ctx) throw new Error('useWeightLog must be used within WeightLogProvider');
  return ctx;
}
