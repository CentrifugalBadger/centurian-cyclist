import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type WorkoutStatus = 'completed' | 'partial' | 'skipped' | 'modified';

export type WorkoutEntry = {
  status: WorkoutStatus;
  rpe?: number;
  durationMin?: number;
  distanceMi?: number;
  avgHr?: number;
  notes?: string;
  savedAt: number;
};

type Ctx = {
  getEntry(w: number, d: number): WorkoutEntry | undefined;
  saveEntry(w: number, d: number, e: WorkoutEntry): void;
  clearEntry(w: number, d: number): void;
};

const WorkoutLogContext = createContext<Ctx | null>(null);

const key = (w: number, d: number) => `${w}:${d}`;

export function WorkoutLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Record<string, WorkoutEntry>>({});

  const getEntry = useCallback(
    (w: number, d: number) => entries[key(w, d)],
    [entries],
  );
  const saveEntry = useCallback((w: number, d: number, e: WorkoutEntry) => {
    setEntries((prev) => ({ ...prev, [key(w, d)]: e }));
  }, []);
  const clearEntry = useCallback((w: number, d: number) => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[key(w, d)];
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({ getEntry, saveEntry, clearEntry }),
    [getEntry, saveEntry, clearEntry],
  );

  return (
    <WorkoutLogContext.Provider value={value}>
      {children}
    </WorkoutLogContext.Provider>
  );
}

export function useWorkoutLog(): Ctx {
  const ctx = useContext(WorkoutLogContext);
  if (!ctx) throw new Error('useWorkoutLog must be used within WorkoutLogProvider');
  return ctx;
}
