import type { CSSProperties } from 'react';
import { ICONS } from '../components/icons';
import { Spark, SectionH } from '../components/atoms';
import type { LogKind } from '../components/LogSheet';
import {
  ATHLETE_NAME,
  BENCHMARK_WEEKS,
  PLAN_DATA,
  WEIGHT_START_LB,
  WEIGHT_TARGET_LB,
  dateForDay,
  formatShort,
  type BenchmarkWeek,
} from '../data/plan';
import { useWeightLog, type WeightEntry } from '../data/weightLog';
import { useWorkoutLog, type WorkoutEntry } from '../data/workoutLog';

export function Body({ onLog }: { onLog: (k: LogKind) => void }) {
  return (
    <div style={{ paddingBottom: 28 }}>
      <div style={{ padding: '8px 16px 0' }}>
        <div className="cap">Athlete · {ATHLETE_NAME}</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 2 }}>
          Body
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <div className="card" style={{ padding: 14 }}>
          <WeightHero onLog={onLog} />
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionH kicker="20-min TT · zone calibration">Benchmarks</SectionH>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BenchmarkTable />
        </div>
      </div>

      <div
        style={{
          padding: '22px 16px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
        }}
      >
        <button type="button" onClick={() => onLog('weight')} style={quickBtn}>
          <ICONS.weight s={14} /> Log weight
        </button>
        <button type="button" onClick={() => onLog('meal')} style={quickBtn}>
          <ICONS.plus s={14} /> Log meal
        </button>
      </div>
    </div>
  );
}

function WeightHero({ onLog }: { onLog: (k: LogKind) => void }) {
  const { entries, latest, rollingAvg } = useWeightLog();
  const last = latest();
  const cur = last?.weightLb ?? WEIGHT_START_LB;
  const avg7 = rollingAvg(7);
  const totalLoss = WEIGHT_START_LB - cur;
  const totalToGo = cur - WEIGHT_TARGET_LB;
  const range = WEIGHT_START_LB - WEIGHT_TARGET_LB;
  const progressPct = Math.max(0, Math.min(100, (totalLoss / range) * 100));

  // sparkline data: pad with WEIGHT_START_LB so the line always has shape.
  const sparkData = entries.length > 0
    ? entries.map((e) => e.weightLb)
    : [WEIGHT_START_LB, WEIGHT_START_LB];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        <div>
          <div className="cap">Weight · {last ? formatShort(new Date(`${last.date}T00:00:00Z`)) : 'not logged'}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span
              className="num"
              style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em' }}
            >
              {cur.toFixed(1)}
            </span>
            <span className="num" style={{ fontSize: 13, color: 'var(--ink-3)' }}>lb</span>
          </div>
          {last && totalLoss > 0 && (
            <div className="num" style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>
              −{totalLoss.toFixed(1)} lb from start
            </div>
          )}
          {!last && (
            <div className="num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
              No entries yet — tap Log to start
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          onClick={() => onLog('weight')}
          style={{
            background: 'var(--bg-3)',
            border: '1px solid var(--line-2)',
            color: 'var(--ink)',
            padding: '8px 14px',
            borderRadius: 999,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <ICONS.plus s={12} /> Log
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 4,
            fontSize: 10,
            color: 'var(--ink-3)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <span>{WEIGHT_START_LB} start</span>
          <span>
            {totalToGo > 0 ? `${totalToGo.toFixed(1)} lb to go` : 'at target'}
          </span>
          <span>{WEIGHT_TARGET_LB} target</span>
        </div>
        <div
          style={{
            height: 4,
            background: 'var(--line)',
            borderRadius: 999,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progressPct}%`,
              background: 'var(--accent)',
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <Stat label="7-day avg" value={avg7 !== undefined ? avg7.toFixed(1) : '—'} unit="lb" />
          <Stat label="Entries" value={entries.length} />
          <Stat
            label="Projected"
            value={projectRaceWeight(entries) ?? '—'}
            unit={projectRaceWeight(entries) !== null ? 'lb' : ''}
          />
        </div>
        <div style={{ color: 'var(--accent)' }}>
          <Spark
            data={sparkData}
            width={300}
            height={42}
            stroke="currentColor"
            fill
            strokeWidth={1.4}
            dot={entries.length < 8}
          />
        </div>
      </div>
    </div>
  );
}

function projectRaceWeight(entries: WeightEntry[]): string | null {
  if (entries.length < 3) return null;
  // simple linear fit over last up-to-28 entries; project to race day index
  const tail = entries.slice(-28);
  const n = tail.length;
  const xs = tail.map((_, i) => i);
  const ys = tail.map((e) => e.weightLb);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  if (den === 0) return ys[n - 1].toFixed(1);
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  // project to day n + race-day offset from last entry; we don't track day index here,
  // so just project the trend ~120 days forward (conservative window from W1).
  const projected = intercept + slope * (n + 120);
  return projected.toFixed(1);
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div>
      <div className="cap" style={{ fontSize: 9 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 2 }}>
        <span
          className="num"
          style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          {value}
        </span>
        {unit && (
          <span className="num" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

function BenchmarkTable() {
  const { getEntry } = useWorkoutLog();
  const baselineEntry = getEntry(1, 1);
  const baseline = workoutSpeed(baselineEntry);
  return (
    <>
      {BENCHMARK_WEEKS.map((wk) => {
        const entry = getEntry(wk, 1);
        return (
          <BenchmarkRow
            key={wk}
            wk={wk}
            entry={entry}
            baselineSpeedMph={baseline}
            isBaseline={wk === 1}
          />
        );
      })}
    </>
  );
}

function workoutSpeed(e: WorkoutEntry | undefined): number | null {
  if (!e || !e.durationMin || !e.distanceMi) return null;
  return e.distanceMi / (e.durationMin / 60);
}

function BenchmarkRow({
  wk,
  entry,
  baselineSpeedMph,
  isBaseline,
}: {
  wk: BenchmarkWeek;
  entry: WorkoutEntry | undefined;
  baselineSpeedMph: number | null;
  isBaseline: boolean;
}) {
  const date = formatShort(dateForDay(wk, 1));
  const day = PLAN_DATA.weeks[wk - 1].days[1];
  const speed = workoutSpeed(entry);
  const deltaSpeed =
    speed !== null && baselineSpeedMph !== null && !isBaseline
      ? speed - baselineSpeedMph
      : null;

  return (
    <div
      className="card"
      style={{
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ width: 56 }}>
        <div className="cap" style={{ fontSize: 9 }}>W{wk}</div>
        <div className="num" style={{ fontSize: 13, fontWeight: 500, marginTop: 1 }}>
          {date}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{day.name}</div>
        {entry ? (
          <div className="num" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
            {entry.avgHr ? `HR ${entry.avgHr}` : ''}
            {entry.avgHr && (speed !== null || entry.rpe) ? ' · ' : ''}
            {speed !== null ? `${speed.toFixed(1)} mph` : ''}
            {speed !== null && entry.rpe ? ' · ' : ''}
            {entry.rpe ? `RPE ${entry.rpe}` : ''}
          </div>
        ) : (
          <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>
            Pending — log the Tue session to populate
          </div>
        )}
      </div>
      <div style={{ width: 72, textAlign: 'right' }}>
        {isBaseline && entry && (
          <span className="cap" style={{ fontSize: 9, color: 'var(--accent)' }}>
            Baseline
          </span>
        )}
        {deltaSpeed !== null && (
          <div
            className="num"
            style={{
              fontSize: 11,
              color: deltaSpeed >= 0 ? 'var(--accent)' : 'var(--warn)',
            }}
          >
            {deltaSpeed >= 0 ? '+' : ''}
            {deltaSpeed.toFixed(2)} mph
          </div>
        )}
      </div>
    </div>
  );
}

const quickBtn: CSSProperties = {
  padding: '14px',
  background: 'var(--bg-1)',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
  borderRadius: 12,
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
};
