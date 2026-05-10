import { useState } from 'react';
import { ICONS, ACT_ICON } from '../components/icons';
import { Stat } from '../components/atoms';
import { PLAN_DATA, DAY_LABELS, type PlanDay } from '../data/plan';

export type CalendarMode = 'week' | 'agenda' | 'heat';

type CalendarProps = {
  mode?: CalendarMode;
  onModeChange: (m: CalendarMode) => void;
};

export function Calendar({ mode = 'agenda', onModeChange }: CalendarProps) {
  return (
    <div style={{ paddingBottom: 28 }}>
      <div style={{ padding: '8px 16px 0' }}>
        <div className="cap">Plan · 24 weeks</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 2 }}>
          Calendar
        </div>
        <div className="num" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
          May 2026 · Week 17/24 · <span style={{ color: 'var(--accent)' }}>Build</span>
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

      {mode === 'week' && <WeekMode />}
      {mode === 'agenda' && <AgendaMode />}
      {mode === 'heat' && <HeatMode />}
    </div>
  );
}

function WeekMode() {
  const [selW, setSelW] = useState(17);
  const [selD, setSelD] = useState(6);
  const week = PLAN_DATA.weeks[selW - 1];
  const day = week.days[selD];

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
          {week.days.map((d, i) => {
            const I = ACT_ICON[d.type] ?? ICONS.rest;
            const active = i === selD;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelD(i)}
                style={{
                  background: active
                    ? 'var(--accent-glow)'
                    : d.today
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
                }}
              >
                <div
                  className="cap"
                  style={{ fontSize: 9, color: active ? 'var(--accent)' : 'var(--ink-3)' }}
                >
                  {DAY_LABELS[i]}
                </div>
                <div style={{ color: d.completed ? 'var(--ink-3)' : 'var(--ink-2)' }}>
                  <I s={12} />
                </div>
                <div className="num" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                  {d.tss || '·'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <DayCard day={day} weekNum={selW} dayIdx={selD} />
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

function dateFor(weekNum: number, dayIdx: number): string {
  const baseDate = new Date(2026, 4, 10);
  const diff = (weekNum - 17) * 7 + (dayIdx - 6);
  const d = new Date(baseDate);
  d.setDate(d.getDate() + diff);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

function DayCard({
  day,
  weekNum,
  dayIdx,
}: {
  day: PlanDay;
  weekNum: number;
  dayIdx: number;
}) {
  const I = ACT_ICON[day.type] ?? ICONS.rest;
  const date = dateFor(weekNum, dayIdx);

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
            background: day.completed ? 'var(--accent-soft)' : 'var(--bg-3)',
            color: day.completed ? 'var(--accent)' : 'var(--ink-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {day.completed ? <ICONS.check s={16} /> : <I s={16} />}
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
            label="Duration"
            value={day.tss > 200 ? '4h 12m' : day.tss > 100 ? '2h 15m' : '1h 05m'}
          />
          <Stat label="Avg power" value={day.tss > 200 ? 215 : 248} unit="W" />
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
      {day.completed && (
        <button
          type="button"
          style={{
            marginTop: 12,
            width: '100%',
            padding: '10px',
            background: 'var(--bg-3)',
            border: '1px solid var(--line)',
            color: 'var(--ink)',
            borderRadius: 8,
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          View activity →
        </button>
      )}
    </div>
  );
}

type AgendaItem =
  | { kind: 'header'; week: (typeof PLAN_DATA.weeks)[number] }
  | { kind: 'day'; day: PlanDay; weekNum: number; dayIdx: number };

function AgendaMode() {
  const startW = 17;
  const items: AgendaItem[] = [];
  for (let w = startW; w <= 24; w++) {
    const week = PLAN_DATA.weeks[w - 1];
    items.push({ kind: 'header', week });
    week.days.forEach((d, di) => {
      if (w === 17 && di < 6) return;
      items.push({ kind: 'day', day: d, weekNum: w, dayIdx: di });
    });
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
        return <AgendaRow key={i} day={it.day} weekNum={it.weekNum} dayIdx={it.dayIdx} />;
      })}
    </div>
  );
}

const DAY_NAMES_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function AgendaRow({
  day,
  weekNum,
  dayIdx,
}: {
  day: PlanDay;
  weekNum: number;
  dayIdx: number;
}) {
  const I = ACT_ICON[day.type] ?? ICONS.rest;
  const baseDate = new Date(2026, 4, 10);
  const diff = (weekNum - 17) * 7 + (dayIdx - 6);
  const date = new Date(baseDate);
  date.setDate(date.getDate() + diff);
  const isToday = day.today;
  const isRace = day.name === 'A-RACE';

  return (
    <div
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
          {date.getDate()}
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
      </div>
      <ICONS.chev s={12} />
    </div>
  );
}

function HeatMode() {
  const maxTss = 280;

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
                    color: w.w === 17 ? 'var(--accent)' : 'var(--ink-4)',
                    textAlign: 'right',
                    paddingRight: 4,
                  }}
                >
                  {w.w}
                </div>
                {w.days.map((d, i) => {
                  const intensity = d.tss / maxTss;
                  const baseColor = w.phase.color;
                  const isFuture = !d.past && !d.today;
                  return (
                    <div
                      key={i}
                      style={{
                        aspectRatio: '1',
                        borderRadius: 3,
                        background:
                          d.tss === 0
                            ? 'var(--line)'
                            : isFuture
                              ? `color-mix(in oklch, ${baseColor} ${20 + intensity * 60}%, transparent)`
                              : `color-mix(in oklch, ${baseColor} ${30 + intensity * 70}%, var(--bg))`,
                        border: d.today
                          ? '1px solid var(--ink)'
                          : d.name === 'A-RACE'
                            ? '1.5px solid var(--accent)'
                            : 'none',
                        opacity: isFuture ? 0.65 : 1,
                      }}
                    />
                  );
                })}
              </div>
            ))}
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
