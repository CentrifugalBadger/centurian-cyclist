import type { CSSProperties, ReactNode } from 'react';
import { ICONS, ACT_ICON } from '../components/icons';
import { Spark, Ring, Pill, Stat, SectionH } from '../components/atoms';
import type { Density, ActivityType } from '../types';
import type { LogKind } from '../components/LogSheet';

type TodayProps = {
  density?: Density;
  onLog: (kind: LogKind) => void;
};

export function Today({ density = 'dense', onLog }: TodayProps) {
  const showWeek = density !== 'minimal';
  const showLoad = density === 'dense';
  const showRecovery = density !== 'minimal';
  const showAlerts = density !== 'minimal';
  const showNext3 = density === 'dense';
  const showFueling = density === 'dense';

  return (
    <div style={{ paddingBottom: 28 }}>
      <Hero />

      <div style={{ padding: '0 16px', marginTop: 18 }}>
        <SessionCard />
      </div>

      {showWeek && (
        <div style={{ marginTop: 18 }}>
          <WeekStrip />
        </div>
      )}

      {showLoad && (
        <div style={{ marginTop: 22 }}>
          <SectionH kicker="Load · 42-day" action="View →">Form & fitness</SectionH>
          <div style={{ padding: '0 16px' }}>
            <LoadCard />
          </div>
        </div>
      )}

      {showRecovery && (
        <div style={{ marginTop: 22 }}>
          <SectionH kicker="Recovery · last night">Readiness 78</SectionH>
          <RecoveryRow />
        </div>
      )}

      <div
        style={{
          marginTop: 22,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '0 16px',
        }}
      >
        <MacrosCard onLog={onLog} />
        <WeightCard onLog={onLog} />
      </div>

      {showFueling && (
        <div style={{ marginTop: 10, padding: '0 16px' }}>
          <FuelingCard />
        </div>
      )}

      {showAlerts && (
        <div style={{ marginTop: 22 }}>
          <SectionH kicker="Coach signals">Things to know</SectionH>
          <div
            style={{
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <Alert
              tone="warn"
              title="HRV trending low — 4d"
              body="Below 30-day baseline. Threshold workout shifted to Thu."
            />
            <Alert
              tone="ok"
              title="FTP test scheduled"
              body="Sun May 17 · 8:00. Last test 287W → ramp +2.4%/wk."
            />
          </div>
        </div>
      )}

      {showNext3 && (
        <div style={{ marginTop: 22 }}>
          <SectionH kicker="Up next" action="Open plan →">Next three days</SectionH>
          <Next3 />
        </div>
      )}
    </div>
  );
}

function Hero() {
  return (
    <div style={{ padding: '6px 16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="cap" style={{ marginBottom: 4 }}>Sun · May 10</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em' }}>
            Good morning, Theo.
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 1 }}>
            Week 17 of 24 · <span style={{ color: 'var(--accent)' }}>Build phase</span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          background:
            'linear-gradient(180deg, var(--accent-glow), transparent 90%), var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-2)',
          padding: '14px 14px 14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
            width: 3,
            background: 'var(--accent)',
          }}
        />
        <div>
          <div className="cap" style={{ color: 'var(--accent)' }}>A-Race · T-27d</div>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 2 }}>
            Mt Tam Century
          </div>
          <div className="num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>
            Sat Jun 06 · 161 km · 2,950 m gain
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            className="num"
            style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1 }}
          >
            27
          </div>
          <div className="cap" style={{ marginTop: 4 }}>Days</div>
        </div>
      </div>
    </div>
  );
}

function SessionCard() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '14px 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Pill bg="var(--accent-soft)" color="var(--accent)">
            <ICONS.bike s={10} /> Ride · Sweet spot
          </Pill>
          <Pill>2h 15m</Pill>
          <Pill>TSS 142</Pill>
          <div style={{ flex: 1 }} />
          <span className="num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>09:00</span>
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          4×12 @ 88-93% FTP
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>
          Marin Headlands loop · ~2,950 kJ · key build session
        </div>
      </div>

      <div style={{ padding: '0 14px 12px' }}>
        <PowerProfile />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid var(--line)',
        }}
      >
        {(
          [
            ['Power', '253', 'W avg'],
            ['IF', '0.82', ''],
            ['NP', '264', 'W'],
            ['kJ', '2,940', ''],
          ] as const
        ).map(([l, v, u]) => (
          <div key={l} style={{ padding: '10px 12px', borderRight: '1px solid var(--line)' }}>
            <div className="cap" style={{ fontSize: 9 }}>{l}</div>
            <div
              className="num"
              style={{ fontSize: 16, fontWeight: 500, marginTop: 2, letterSpacing: '-0.02em' }}
            >
              {v}
            </div>
            {u && <div className="num" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{u}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        <button type="button" style={btnDarkSecondary}>Move</button>
        <button
          type="button"
          style={{ ...btnDarkSecondary, borderLeft: '1px solid var(--line)' }}
        >
          Details
        </button>
        <button type="button" style={btnDarkPrimary}>
          Start workout <ICONS.chev s={12} />
        </button>
      </div>
    </div>
  );
}

function PowerProfile() {
  const segs = [
    { t: 12, p: 0.5, label: 'WU' },
    { t: 12, p: 0.9, label: '#1' },
    { t: 5, p: 0.55 },
    { t: 12, p: 0.92, label: '#2' },
    { t: 5, p: 0.55 },
    { t: 12, p: 0.91, label: '#3' },
    { t: 5, p: 0.55 },
    { t: 12, p: 0.93, label: '#4' },
    { t: 8, p: 0.45, label: 'CD' },
  ];
  const total = segs.reduce((a, b) => a + b.t, 0);
  const W = 320;
  const H = 50;
  let x = 0;
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ display: 'block' }}
    >
      {[0.5, 1].map((y) => (
        <line
          key={y}
          x1={0}
          x2={W}
          y1={H - y * H}
          y2={H - y * H}
          stroke="var(--line)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
      ))}
      {segs.map((s, i) => {
        const w = (s.t / total) * W;
        const h = s.p * H;
        const isHard = s.p > 0.7;
        const r = (
          <rect
            key={i}
            x={x}
            y={H - h}
            width={Math.max(0.4, w - 0.6)}
            height={h}
            fill={isHard ? 'var(--accent)' : 'var(--line-3)'}
            opacity={isHard ? 0.85 : 0.7}
            rx="1"
          />
        );
        x += w;
        return r;
      })}
    </svg>
  );
}

const btnDarkPrimary: CSSProperties = {
  flex: 2,
  padding: '13px 14px',
  border: 0,
  borderTop: '1px solid var(--accent-d)',
  background: 'var(--accent)',
  color: '#0a0a0a',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  letterSpacing: '0.01em',
};

const btnDarkSecondary: CSSProperties = {
  flex: 1,
  padding: '13px 12px',
  border: 0,
  borderTop: '1px solid var(--line)',
  background: 'var(--bg-1)',
  color: 'var(--ink-2)',
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  cursor: 'pointer',
};

type WeekDay = {
  d: string;
  n: number;
  type: ActivityType;
  tss: number;
  done?: boolean;
  today?: boolean;
  label?: string;
};

function WeekStrip() {
  const days: WeekDay[] = [
    { d: 'M', n: 4, type: 'rest', tss: 0, done: true },
    { d: 'T', n: 5, type: 'ride', tss: 78, done: true, label: '1h Z2' },
    { d: 'W', n: 6, type: 'lift', tss: 35, done: true, label: 'Lift A' },
    { d: 'T', n: 7, type: 'ride', tss: 95, done: true, label: 'VO2' },
    { d: 'F', n: 8, type: 'yoga', tss: 18, done: true, label: 'Mobility' },
    { d: 'S', n: 9, type: 'ride', tss: 215, done: true, label: '4h endurance' },
    { d: 'S', n: 10, type: 'ride', tss: 142, today: true, label: 'Sweet spot' },
  ];
  const target = 580;
  const completed = 401;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          padding: '0 16px',
          marginBottom: 8,
        }}
      >
        <div>
          <div className="cap">This week · TSS</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 3 }}>
            <span
              className="num"
              style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              {completed}
            </span>
            <span className="num" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              / {target}
            </span>
            <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 6 }}>
              {Math.round((completed / target) * 100)}%
            </span>
          </div>
        </div>
        <div className="num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>11h 24m / 14h</div>
      </div>

      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <div
          style={{
            height: 3,
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
              width: `${(completed / target) * 100}%`,
              background: 'var(--accent)',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, padding: '0 12px' }}>
        {days.map((d, i) => {
          const I = ACT_ICON[d.type] ?? ICONS.rest;
          const isToday = d.today;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px 4px',
                border: `1px solid ${isToday ? 'var(--accent)' : 'var(--line)'}`,
                borderRadius: 10,
                background: isToday ? 'var(--accent-glow)' : 'var(--bg-1)',
                gap: 6,
                position: 'relative',
              }}
            >
              <div
                className="cap"
                style={{ fontSize: 9, color: isToday ? 'var(--accent)' : 'var(--ink-3)' }}
              >
                {d.d}
              </div>
              <div
                className="num"
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: isToday ? 'var(--ink)' : 'var(--ink-2)',
                }}
              >
                {d.n}
              </div>
              <div
                style={{
                  color: isToday
                    ? 'var(--accent)'
                    : d.done
                      ? 'var(--ink-3)'
                      : 'var(--ink-4)',
                }}
              >
                <I s={12} />
              </div>
              <div className="num" style={{ fontSize: 9, color: 'var(--ink-3)' }}>
                {d.tss || '—'}
              </div>
              {d.done && !isToday && (
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    background: 'var(--accent)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadCard() {
  const ctl = Array.from({ length: 42 }, (_, i) => 58 + i * 0.45 + Math.sin(i / 4) * 1.2);
  const atl = Array.from(
    { length: 42 },
    (_, i) => 60 + i * 0.55 + Math.sin(i / 2.2) * 6 + Math.cos(i / 1.5) * 4,
  );
  const tsb = ctl.map((c, i) => c - atl[i]);

  return (
    <div className="card" style={{ padding: 14 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 10,
        }}
      >
        <Stat label="Fitness · CTL" value="76" sub="+12 / 30d ↑" />
        <Stat label="Fatigue · ATL" value="89" sub="+6 / 7d ↑" />
        <Stat label="Form · TSB" value="−13" sub="Productive" accent />
      </div>

      <svg
        width="100%"
        height="80"
        viewBox="0 0 320 80"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <line x1="0" x2="320" y1="60" y2="60" stroke="var(--line)" strokeDasharray="2 3" />
        <path
          d={
            'M 0 60 ' +
            tsb.map((v, i) => `L ${(i / (tsb.length - 1)) * 320} ${60 - v * 1.2}`).join(' ') +
            ' L 320 60 Z'
          }
          fill="var(--accent-glow)"
        />
        <path
          d={
            'M ' +
            ctl.map((v, i) => `${(i / (ctl.length - 1)) * 320} ${78 - v * 0.5}`).join(' L ')
          }
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        <path
          d={
            'M ' +
            atl.map((v, i) => `${(i / (atl.length - 1)) * 320} ${78 - v * 0.5}`).join(' L ')
          }
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
      </svg>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 8,
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--ink-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 2, background: 'var(--accent)' }} /> CTL
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 2, background: 'var(--ink-3)' }} /> ATL
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 6, background: 'var(--accent-glow)' }} /> TSB
        </span>
      </div>
    </div>
  );
}

function RecoveryRow() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        padding: '0 16px',
      }}
    >
      <RecCard
        icon={<ICONS.heart s={12} />}
        label="HRV"
        value="48"
        unit="ms"
        delta="−8"
        deltaTone="warn"
        spark={[58, 56, 54, 52, 50, 47, 49, 48]}
        baseline="56"
      />
      <RecCard
        icon={<ICONS.drop s={12} />}
        label="RHR"
        value="52"
        unit="bpm"
        delta="+1"
        deltaTone="warn"
        spark={[50, 51, 50, 51, 53, 51, 52, 52]}
        baseline="51"
      />
      <RecCard
        icon={<ICONS.bed s={12} />}
        label="Sleep"
        value="7:42"
        unit="hrs"
        delta="86%"
        deltaTone="ok"
        spark={[7.2, 6.8, 7.5, 8.1, 6.9, 7.4, 7.2, 7.7]}
        baseline="7:18"
      />
    </div>
  );
}

type RecCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
  delta: string;
  deltaTone: 'ok' | 'warn';
  spark: number[];
  baseline: string;
};

function RecCard({ icon, label, value, unit, delta, deltaTone, spark, baseline }: RecCardProps) {
  const tone = deltaTone === 'warn' ? 'var(--warn)' : 'var(--accent)';
  return (
    <div className="card" style={{ padding: '10px 11px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          color: 'var(--ink-3)',
          marginBottom: 4,
        }}
      >
        {icon}
        <span className="cap" style={{ fontSize: 9 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span
          className="num"
          style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          {value}
        </span>
        <span className="num" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{unit}</span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <span className="num" style={{ fontSize: 10, color: tone }}>{delta}</span>
        <div style={{ color: tone }}>
          <Spark
            data={spark}
            width={48}
            height={16}
            stroke="currentColor"
            strokeWidth={1.2}
            dot={false}
          />
        </div>
      </div>
      <div className="num" style={{ fontSize: 9, color: 'var(--ink-4)', marginTop: 2 }}>
        vs {baseline} 30d
      </div>
    </div>
  );
}

function MacrosCard({ onLog }: { onLog: (k: LogKind) => void }) {
  const cals = 1640;
  const calsTarget = 3850;
  const macros = [
    { label: 'P', value: 142, target: 165, color: 'var(--accent)' },
    { label: 'C', value: 184, target: 520, color: 'oklch(0.78 0.16 90)' },
    { label: 'F', value: 56, target: 105, color: 'oklch(0.7 0.16 240)' },
  ];
  return (
    <div className="card" style={{ padding: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div className="cap">Fuel · today</div>
        <button
          type="button"
          onClick={() => onLog('meal')}
          style={{
            background: 'transparent',
            border: 0,
            color: 'var(--ink-2)',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <ICONS.plus s={14} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Ring value={cals / calsTarget} size={62} stroke={5} color="var(--accent)">
          <div
            className="num"
            style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {Math.round((cals / calsTarget) * 100)}
            <span style={{ fontSize: 8, color: 'var(--ink-3)' }}>%</span>
          </div>
        </Ring>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="num"
            style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {cals.toLocaleString()}
            <span style={{ fontSize: 9, color: 'var(--ink-3)' }}>
              {' '}/ {calsTarget.toLocaleString()} kcal
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
            {macros.map((m) => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
                  <span className="num" style={{ color: 'var(--ink-3)' }}>{m.label}</span>
                  <span className="num" style={{ color: 'var(--ink-2)' }}>
                    {m.value}/{m.target}
                    <span style={{ color: 'var(--ink-4)' }}>g</span>
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    background: 'var(--line)',
                    borderRadius: 99,
                    overflow: 'hidden',
                    marginTop: 2,
                  }}
                >
                  <div
                    style={{
                      width: `${(m.value / m.target) * 100}%`,
                      height: '100%',
                      background: m.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeightCard({ onLog }: { onLog: (k: LogKind) => void }) {
  const data = [
    74.8, 74.9, 74.6, 74.5, 74.7, 74.3, 74.2, 74.0, 74.1, 73.9, 73.8, 73.7, 73.5, 73.6,
  ];
  return (
    <div className="card" style={{ padding: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div className="cap">Weight · 14d</div>
        <button
          type="button"
          onClick={() => onLog('weight')}
          style={{
            background: 'transparent',
            border: 0,
            color: 'var(--ink-2)',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <ICONS.plus s={14} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span
          className="num"
          style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          73.6
        </span>
        <span className="num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>kg</span>
        <span className="num" style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 4 }}>
          −1.2
        </span>
      </div>
      <div className="num" style={{ fontSize: 10, color: 'var(--ink-3)' }}>target 72.0 · 4 wks</div>

      <div style={{ marginTop: 8, color: 'var(--accent)' }}>
        <Spark data={data} width={140} height={36} stroke="currentColor" strokeWidth={1.4} fill />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 9,
          color: 'var(--ink-4)',
          fontFamily: 'var(--font-mono)',
          marginTop: 4,
        }}
      >
        <span>Apr 26</span>
        <span>May 10</span>
      </div>
    </div>
  );
}

function FuelingCard() {
  return (
    <div
      className="card"
      style={{
        padding: 12,
        marginTop: 10,
        borderColor: 'color-mix(in oklch, var(--accent) 20%, var(--line))',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="cap" style={{ color: 'var(--accent)' }}>In-ride fueling · 2h 15m</div>
        <span className="num" style={{ fontSize: 10, color: 'var(--ink-3)' }}>auto-calc'd</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginTop: 10,
        }}
      >
        <Stat label="Carbs/hr" value="85" unit="g" />
        <Stat label="Fluid" value="1.4" unit="L" />
        <Stat label="Sodium" value="700" unit="mg" />
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        <Pill>2× SiS Beta Fuel</Pill>
        <Pill>1× Maurten 320</Pill>
        <Pill>1× Bar</Pill>
      </div>
    </div>
  );
}

type AlertTone = 'ok' | 'warn' | 'bad';

function Alert({ tone = 'ok', title, body }: { tone?: AlertTone; title: string; body: string }) {
  const tones: Record<AlertTone, { fg: string }> = {
    warn: { fg: 'var(--warn)' },
    ok: { fg: 'var(--accent)' },
    bad: { fg: 'var(--bad)' },
  };
  const fg = tones[tone].fg;
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: '11px 12px',
        background: 'var(--bg-1)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-2)',
      }}
    >
      <div style={{ color: fg, marginTop: 1 }}>
        {tone === 'ok' ? <ICONS.check s={14} /> : <ICONS.alert s={14} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{body}</div>
      </div>
      <ICONS.chev s={12} />
    </div>
  );
}

type Next3Item = {
  d: string;
  n: number;
  type: ActivityType;
  name: string;
  desc: string;
  tss: number;
};

function Next3() {
  const items: Next3Item[] = [
    { d: 'Mon', n: 11, type: 'rest', name: 'Rest', desc: 'Walk + mobility', tss: 0 },
    { d: 'Tue', n: 12, type: 'ride', name: 'VO₂ 5×4', desc: '110-120% FTP · 1h 15m', tss: 105 },
    { d: 'Wed', n: 13, type: 'lift', name: 'Lower B', desc: 'Squat 4×5 · 1h', tss: 38 },
  ];
  return (
    <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((it, i) => {
        const I = ACT_ICON[it.type] ?? ICONS.rest;
        return (
          <div
            key={i}
            className="card"
            style={{
              padding: '11px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ width: 38, textAlign: 'center' }}>
              <div className="cap" style={{ fontSize: 9 }}>{it.d}</div>
              <div className="num" style={{ fontSize: 16, fontWeight: 500 }}>{it.n}</div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--bg-3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-2)',
              }}
            >
              <I s={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{it.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{it.desc}</div>
            </div>
            {it.tss > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div className="num" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{it.tss}</div>
                <div className="cap" style={{ fontSize: 8 }}>TSS</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
