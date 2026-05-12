import { useEffect, useState, type ComponentType } from 'react';
import { ICONS } from './components/icons';
import { LogSheet, type LogKind } from './components/LogSheet';
import { WorkoutSheet } from './components/WorkoutSheet';
import { SwapSheet } from './components/SwapSheet';
import { Today } from './screens/Today';
import { Calendar, type CalendarMode } from './screens/Calendar';
import { Plan } from './screens/Plan';
import { Body } from './screens/Body';
import { applyAccent } from './theme/accent';
import { WorkoutLogProvider } from './data/workoutLog';
import { WeightLogProvider } from './data/weightLog';
import { SwapsProvider } from './data/swaps';
import type { AccentKey, Density } from './types';

type TabKey = 'today' | 'cal' | 'plan' | 'body';

type TabDef = {
  k: TabKey;
  label: string;
  icon: ComponentType<{ s?: number }>;
};

const TABS: TabDef[] = [
  { k: 'today', label: 'Today', icon: ICONS.today },
  { k: 'cal', label: 'Calendar', icon: ICONS.cal },
  { k: 'plan', label: 'Plan', icon: ICONS.plan },
  { k: 'body', label: 'Body', icon: ICONS.body },
];

const STORAGE = {
  accent: 'ct.accent',
  density: 'ct.density',
} as const;

function loadAccent(): AccentKey {
  try {
    const v = localStorage.getItem(STORAGE.accent);
    if (v === 'green' || v === 'orange' || v === 'yellow' || v === 'blue' || v === 'white') {
      return v;
    }
  } catch {
    // localStorage unavailable (private mode, etc.) — fall through to default.
  }
  return 'white';
}

function loadDensity(): Density {
  try {
    const v = localStorage.getItem(STORAGE.density);
    if (v === 'minimal' || v === 'medium' || v === 'dense') return v;
  } catch {
    // localStorage unavailable.
  }
  return 'dense';
}

export function App() {
  const [tab, setTab] = useState<TabKey>('today');
  const [calMode, setCalMode] = useState<CalendarMode>('agenda');
  const [logKind, setLogKind] = useState<LogKind | null>(null);
  const [workoutTarget, setWorkoutTarget] = useState<{ w: number; d: number } | null>(null);
  const [swapTarget, setSwapTarget] = useState<{ w: number; effD: number } | null>(null);
  const [accent] = useState<AccentKey>(loadAccent);
  const [density] = useState<Density>(loadDensity);

  useEffect(() => {
    applyAccent(accent);
    try {
      localStorage.setItem(STORAGE.accent, accent);
    } catch {
      // ignore persistence failure
    }
  }, [accent]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE.density, density);
    } catch {
      // ignore persistence failure
    }
  }, [density]);

  const onLog = (k: LogKind) => setLogKind(k);
  const onLogWorkout = (w: number, d: number) => setWorkoutTarget({ w, d });
  const onMoveWorkout = (w: number, effD: number) => setSwapTarget({ w, effD });

  return (
    <SwapsProvider>
      <WorkoutLogProvider>
        <WeightLogProvider>
          <div className="app">
        <div className="app-scroll">
          {tab === 'today' && (
            <Today
              density={density}
              onLog={onLog}
              onLogWorkout={onLogWorkout}
              onMoveWorkout={onMoveWorkout}
            />
          )}
          {tab === 'cal' && (
            <Calendar
              mode={calMode}
              onModeChange={setCalMode}
              onLogWorkout={onLogWorkout}
              onMoveWorkout={onMoveWorkout}
            />
          )}
          {tab === 'plan' && <Plan />}
          {tab === 'body' && <Body onLog={onLog} />}
        </div>

        <div className="tab-bar">
          {TABS.map((t) => {
            const Ic = t.icon;
            return (
              <button
                key={t.k}
                type="button"
                onClick={() => setTab(t.k)}
                className={`tab ${tab === t.k ? 'active' : ''}`}
              >
                <Ic s={20} />
                <span className="tab-label">{t.label}</span>
              </button>
            );
          })}
        </div>

        {logKind && <LogSheet kind={logKind} onClose={() => setLogKind(null)} />}
        {workoutTarget && (
          <WorkoutSheet
            w={workoutTarget.w}
            d={workoutTarget.d}
            onClose={() => setWorkoutTarget(null)}
          />
        )}
        {swapTarget && (
          <SwapSheet
            w={swapTarget.w}
            effD={swapTarget.effD}
            onClose={() => setSwapTarget(null)}
          />
        )}
          </div>
        </WeightLogProvider>
      </WorkoutLogProvider>
    </SwapsProvider>
  );
}
