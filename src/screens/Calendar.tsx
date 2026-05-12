import { useState, type CSSProperties } from 'react';
import { ICONS, ACT_ICON } from '../components/icons';
import { Stat } from '../components/atoms';
import {
  PLAN_DATA,
  DAY_LABELS,
  TODAY_WEEK,
  dateForDay,
  type PlanDay,
} from '../data/plan';
import { useWorkoutLog } from '../data/workoutLog';
import { useSwaps } from '../data/swaps';

export type CalendarMode = 'week' | 'agenda' | 'heat';

const RACE_NAME = 'RACE 100mi';

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type CalendarProps = {
  mode?: CalendarMode;
  onModeChange: (m: CalendarMode) => void;
  onLogWorkout: (w: number, d: number) => void;
  onMoveWorkout: (w: number, effD: number) => void;
};

export function Calendar({ mode = 'agenda', onModeChange, onLogWorkout, onMoveWorkout }: CalendarProps) {
  const today = dateForDay(TODAY_WEEK.w, PLAN_DATA.today.d);
  const headerLabel = `${MONTHS_LONG[today.getUTCMonth()]} ${today.getUTCFullYear()}`;
  return (
    <div style={{ paddingBottom: 28 }}>
      <div style={{ padding: '8px 16px 0' }}>
        <div className="cap">Plan · 24 weeks</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 2 }}>
          Calendar
        </div>
        <div className="num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
          {headerLabel} · Week {TODAY_WEEK.w}/24 ·{' '}
          <span style={{ color: 'var(--accent)' }}>{TODAY_WEEK.phase.name}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '14px 16px 12px' }}>
        {(
          [
            ['week', 'Week'],
            ['agenda', 'Agenda'],
            ['heat', 'Heat'],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => onModeChange(k)}
            className={`btn-ghost ${mode === k ? 'active' : ''}`}
          >
            {l}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button type="button" className="btn-ghost">
          <ICONS.plus s={12} />
        </button>
      </div>

      {mode === 'week' && <WeekMode onLogWorkout={onLogWorkout} onMoveWorkout={onMoveWorkout} />}
      {mode === 'agenda' && <AgendaMode onLogWorkout={onLogWorkout} onMoveWorkout={onMoveWorkout} />}
      {mode === 'heat' && <HeatMode onLogWorkout={onLogWorkout} />}
    </div>
  );
}

function WeekMode({
  onLogWorkout,
  onMoveWorkout,
}: {
  onLogWorkout: (w: number, d: number) => void;
  onMoveWorkout: (w: number, effD: number) => void;
}) {
  const [selW, setSelW] = useState(TODAY_WEEK.w);
  const [selD, setSelD] = useState(PLAN_DATA.today.d);
  const week = PLAN_DATA.weeks[selW - 1];
  const { getEntry } = useWorkoutLog();
  const { effectiveDay, plannedSlot, isSwapped } = useSwaps();
  const day = effectiveDay(selW, selD);

  return (
    <div>
      <div className="h-scroll" style={{ padding: '0 16px 12px' }}>
        {PLAN_DATA.weeks.map((w) => {
          const active = w.w === selW;
          const tss = w.days.reduce((a, b) => a + b.tss, 0);
          return (
            <button
              key={w.w}
              type="button"
              onClick={() => setSelW(w.w)}
              style={{
                flex: '0 0 auto',
                background: active ? 'var(--bg-3)' : 'transparent',
                border: `1px solid ${active ? 'var(--line-3)' : 'var(--line)'}`,
                color: active ? 'var(--ink)' : 'var(--ink-3)',
                padding: '8px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                minWidth: 64,
                fontFamily: 'var(--font-sans)',
                textAlign: 'left',
              }}
            >
              <div
                className="cap"
                style={{
                  fontSize: 9,
                  color:
                    w.phase.color === 'var(--accent)' ? 'var(--accent)' : 'var(--ink-3)',
                }}
              >
                W{w.w}
              </div>
              <div className="num" style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>
                {tss}
              </div>
              <div className="cap" style={{ fontSize: 8 }}>tss</div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '0 16px' }}>
        <div className="cap" style={{ marginBottom: 8 }}>
          Week {selW} · {week.phase.name}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
          {week.days.map((_, i) => {
            const d = effectiveDay(selW, i);
            const I = ACT_ICON[d.type] ?? ICONS.rest;
            const active = i === selD;
            const planned = plannedSlot(selW, i);
            const logged = !!getEntry(selW, planned);
            const isTodayEff = selW === TODAY_WEEK.w && i === PLAN_DATA.today.d;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelD(i)}
                style={{
                  background: active
                    ? 'var(--accent-glow)'
                    : isTodayEff
                      ? 'var(--bg-3)'
                      : 'var(--bg-1)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--line)'}`,
                  borderRadius: 8,
                  padding: '8px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div
                  className="cap"
                  style={{ fontSize: 9, color: active ? 'var(--accent)' : 'var(--ink-3)' }}
                >
                  {DAY_LABELS[i]}
                </div>
                <div style={{ color: logged ? 'var(--accent)' : 'var(--ink-2)' }}>
                  <I s={12} />
                </div>
                <div className="num" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                  {d.tss || '·'}
                </div>
                {logged && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 3,
                      right: 3,
                      width: 4,
                      height: 4,
                      borderRadius: 999,
                      background: 'var(--accent)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <DayCard
          day={day}
          weekNum={selW}
          dayIdx={selD}
          plannedD={plannedSlot(selW, selD)}
          isMoved={isSwapped(selW) && plannedSlot(selW, selD) !== selD}
          onLogWorkout={onLogWorkout}
          onMoveWorkout={onMoveWorkout}
        />
      </div>
    </div>
  );
}

const DAY_NAMES_LONG = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

function shortDate(weekNum: number, dayIdx: number): string {
  const d = dateForDay(weekNum, dayIdx);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function DayCard({
  day,
  weekNum,
  dayIdx,
  plannedD,
  isMoved,
  onLogWorkout,
  onMoveWorkout,
}: {
  day: PlanDay;
  weekNum: number;
  dayIdx: number;
  plannedD: number;
  isMoved: boolean;
  onLogWorkout: (w: number, d: number) => void;
  onMoveWorkout: (w: number, effD: number) => void;
}) {
  const I = ACT_ICON[day.type] ?? ICONS.rest;
  const date = shortDate(weekNum, dayIdx);
  const { getEntry } = useWorkoutLog();
  const logged = getEntry(weekNum, plannedD);

  return (
    <div className="card" style={{ padding: 14 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div>
          <div className="cap">{DAY_NAMES_LONG[dayIdx]} · {date}</div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 3 }}>
            {day.name}
          </div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: logged ? 'var(--accent-soft)' : 'var(--bg-3)',
            color: logged ? 'var(--accent)' : 'var(--ink-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {logged ? <ICONS.check s={16} /> : <I s={16} />}
        </div>
      </div>
      {day.tss > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            paddingTop: 10,
            borderTop: '1px solid var(--line)',
          }}
        >
          <Stat label="TSS" value={day.tss} />
          <Stat
            label="Status"
            value={
              logged
                ? logged.status === 'completed'
                  ? 'Done'
                  : logged.status[0].toUpperCase() + logged.status.slice(1)
                : 'Planned'
            }
          />
          <Stat
            label={logged?.rpe ? 'RPE' : 'Avg HR'}
            value={logged?.rpe ?? (logged?.avgHr ? `${logged.avgHr}` : '—')}
          />
        </div>
      ) : (
        <div
          style={{
            fontSize: 12,
            color: 'var(--ink-3)',
            paddingTop: 10,
            borderTop: '1px solid var(--line)',
          }}
        >
          {day.type === 'rest'
            ? 'No structured training. Move a little, eat a little, sleep a lot.'
            : 'Mobility & flexibility — 30 min'}
        </div>
      )}
      {isMoved && (
        <div
          className="cap"
          style={{ marginTop: 10, fontSize: 9, color: 'var(--accent)' }}
        >
          Moved from original slot
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => onMoveWorkout(weekNum, dayIdx)}
          style={daySecondaryBtn}
        >
          Move
        </button>
        <button
          type="button"
          onClick={() => onLogWorkout(weekNum, plannedD)}
          style={dayPrimaryBtn}
        >
          {logged ? 'Edit log →' : 'Log workout →'}
        </button>
      </div>
    </div>
  );
}

const daySecondaryBtn: CSSProperties = {
  flex: 1,
  padding: '10px',
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  color: 'var(--ink-2)',
  borderRadius: 8,
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  cursor: 'pointer',
};

const dayPrimaryBtn: CSSProperties = {
  flex: 2,
  padding: '10px',
  background: 'var(--bg-3)',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
  borderRadius: 8,
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
};

type AgendaItem =
  | { kind: 'header'; week: (typeof PLAN_DATA.weeks)[number] }
  | { kind: 'day'; day: PlanDay; weekNum: number; dayIdx: number };

function AgendaMode({
  onLogWorkout,
  onMoveWorkout,
}: {
  onLogWorkout: (w: number, d: number) => void;
  onMoveWorkout: (w: number, effD: number) => void;
}) {
  const startW = TODAY_WEEK.w;
  const startD = PLAN_DATA.today.d;
  const { effectiveDay } = useSwaps();
  const items: AgendaItem[] = [];
  for (let w = startW; w <= 24; w++) {
    const week = PLAN_DATA.weeks[w - 1];
    items.push({ kind: 'header', week });
    for (let di = 0; di < 7; di++) {
      if (w === startW && di < startD) continue;
      const d = effectiveDay(w, di);
      items.push({ kind: 'day', day: d, weekNum: w, dayIdx: di });
    }
  }

  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map((it, i) => {
        if (it.kind === 'header') {
          const tss = it.week.days.reduce((a, b) => a + b.tss, 0);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                marginTop: i === 0 ? 0 : 16,
                marginBottom: 2,
                paddingBottom: 4,
                borderBottom: '1px solid var(--line)',
              }}
            >
              <span
                className="cap"
                style={{ color: it.week.phase.color, fontWeight: 600 }}
              >
                Week {it.week.w} · {it.week.phase.name}
              </span>
              <span
                className="num"
                style={{
                  fontSize: 10,
                  color: 'var(--ink-4)',
                  marginLeft: 'auto',
                }}
              >
                {tss} TSS
              </span>
            </div>
          );
        }
        return (
          <AgendaRow
            key={i}
            day={it.day}
            weekNum={it.weekNum}
            dayIdx={it.dayIdx}
            onLogWorkout={onLogWorkout}
            onMoveWorkout={onMoveWorkout}
          />
        );
      })}
    </div>
  );
}

const DAY_NAMES_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function AgendaRow({
  day,
  weekNum,
  dayIdx,
  onLogWorkout,
  onMoveWorkout,
}: {
  day: PlanDay;
  weekNum: number;
  dayIdx: number;
  onLogWorkout: (w: number, d: number) => void;
  onMoveWorkout: (w: number, effD: number) => void;
}) {
  const I = ACT_ICON[day.type] ?? ICONS.rest;
  const date = dateForDay(weekNum, dayIdx);
  const isToday = weekNum === TODAY_WEEK.w && dayIdx === PLAN_DATA.today.d;
  const isRace = day.name === RACE_NAME;
  const { getEntry } = useWorkoutLog();
  const { plannedSlot, isSwapped } = useSwaps();
  const planned = plannedSlot(weekNum, dayIdx);
  const logged = !!getEntry(weekNum, planned);
  const isRest = day.type === 'rest';
  const isMoved = isSwapped(weekNum) && planned !== dayIdx;

  return (
    <div style={{ position: 'relative' }}>
    <button
      type="button"
      onClick={() => onLogWorkout(weekNum, planned)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        background: isRace ? 'var(--accent-glow)' : isToday ? 'var(--bg-2)' : 'var(--bg-1)',
        border: `1px solid ${
          isRace ? 'var(--accent)' : isToday ? 'var(--line-2)' : 'var(--line)'
        }`,
        borderRadius: 12,
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 38,
          textAlign: 'center',
          borderRight: '1px solid var(--line)',
          paddingRight: 10,
        }}
      >
        <div
          className="cap"
          style={{ fontSize: 9, color: isToday ? 'var(--accent)' : 'var(--ink-3)' }}
        >
          {isToday ? 'TODAY' : DAY_NAMES_SHORT[dayIdx]}
        </div>
        <div className="num" style={{ fontSize: 14, fontWeight: 500, marginTop: 1 }}>
          {date.getUTCDate()}
        </div>
      </div>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: isRace ? 'var(--accent)' : 'var(--bg-3)',
          color: isRace
            ? 'var(--bg)'
            : day.type === 'rest'
              ? 'var(--ink-4)'
              : 'var(--ink-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <I s={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: day.type === 'rest' ? 'var(--ink-3)' : 'var(--ink)',
          }}
        >
          {day.name}
        </div>
        {day.tss > 0 && (
          <div
            className="num"
            style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}
          >
            {day.tss > 200 ? '4h 12m' : day.tss > 100 ? '2h 15m' : '1h 05m'} · TSS {day.tss}
          </div>
        )}
        {logged && (
          <div className="cap" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 2 }}>
            Logged
          </div>
        )}
        {isMoved && !logged && (
          <div className="cap" style={{ fontSize: 9, color: 'var(--accent)', marginTop: 2 }}>
            Moved
          </div>
        )}
      </div>
      {!isRest && <ICONS.chev s={12} />}
    </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMoveWorkout(weekNum, dayIdx);
        }}
        aria-label="Move workout"
        style={moveTabBtn}
      >
        ⇆
      </button>
    </div>
  );
}

const moveTabBtn: CSSProperties = {
  position: 'absolute',
  top: 6,
  right: 32,
  width: 22,
  height: 22,
  borderRadius: 6,
  background: 'transparent',
  border: '1px solid var(--line)',
  color: 'var(--ink-3)',
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
};

function HeatMode({ onLogWorkout }: { onLogWorkout: (w: number, d: number) => void }) {
  const maxTss = 280;
  const { effectiveDay, plannedSlot } = useSwaps();

  return (
    <div>
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {PLAN_DATA.phases.map((p) => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div
              style={{ width: 10, height: 10, borderRadius: 2, background: p.color }}
            />
            <span className="cap" style={{ fontSize: 9 }}>{p.name}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        <div className="card" style={{ padding: '12px 10px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '20px repeat(7, 1fr)',
              gap: 3,
              marginBottom: 4,
            }}
          >
            <div />
            {DAY_LABELS.map((l, i) => (
              <div
                key={i}
                className="cap"
                style={{ fontSize: 8, textAlign: 'center', color: 'var(--ink-4)' }}
              >
                {l}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {PLAN_DATA.weeks.map((w) => (
              <div
                key={w.w}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px repeat(7, 1fr)',
                  gap: 3,
                  alignItems: 'center',
                }}
              >
                <div
                  className="num"
                  style={{
                    fontSize: 9,
                    color: w.w === TODAY_WEEK.w ? 'var(--accent)' : 'var(--ink-4)',
                    textAlign: 'right',
                    paddingRight: 4,
                  }}
                >
                  {w.w}
                </div>
                {w.days.map((_, i) => {
                  const d = effectiveDay(w.w, i);
                  const planned = plannedSlot(w.w, i);
                  const intensity = d.tss / maxTss;
                  const baseColor = w.phase.color;
                  const isToday = w.w === TODAY_WEEK.w && i === PLAN_DATA.today.d;
                  const isFuture = !d.past && !isToday;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onLogWorkout(w.w, planned)}
                      aria-label={`Log ${d.name}`}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 3,
                        padding: 0,
                        background:
                          d.tss === 0
                            ? 'var(--line)'
                            : isFuture
                              ? `color-mix(in oklch, ${baseColor} ${20 + intensity * 60}%, transparent)`
                              : `color-mix(in oklch, ${baseColor} ${30 + intensity * 70}%, var(--bg))`,
                        border: isToday
                          ? '1px solid var(--ink)'
                          : d.name === RACE_NAME
                            ? '1.5px solid var(--accent)'
                            : 'none',
                        opacity: isFuture ? 0.65 : 1,
                        cursor: 'pointer',
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div
            className="cap"
            style={{ fontSize: 9, color: 'var(--ink-4)', textAlign: 'right', marginTop: 6 }}
          >
            tap a cell to log
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 4,
              marginTop: 12,
            }}
          >
            <span className="cap" style={{ fontSize: 8, color: 'var(--ink-4)' }}>less</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
              <div
                key={o}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: `color-mix(in oklch, var(--accent) ${o * 100}%, var(--bg))`,
                }}
              />
            ))}
            <span className="cap" style={{ fontSize: 8, color: 'var(--ink-4)' }}>more</span>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '14px 16px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        <div className="card" style={{ padding: 10 }}>
          <Stat label="Total TSS" value="6,840" sub="planned" />
        </div>
        <div className="card" style={{ padding: 10 }}>
          <Stat label="Total hours" value="312" sub="planned" />
        </div>
        <div className="card" style={{ padding: 10 }}>
          <Stat label="Sessions" value="148" sub="planned" />
        </div>
      </div>
    </div>
  );
}
