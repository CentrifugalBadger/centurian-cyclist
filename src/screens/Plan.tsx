import { ICONS } from '../components/icons';
import { Pill, Stat, SectionH } from '../components/atoms';

export function Plan() {
  return (
    <div style={{ paddingBottom: 28 }}>
      <div style={{ padding: '8px 16px 0' }}>
        <div className="cap">A-Race · Mt Tam Century</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 2 }}>
          Plan
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
          Custom block · Polarized 80/20
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <PhaseProgress />
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionH kicker="24-week block">Weekly volume</SectionH>
        <div style={{ padding: '0 16px' }}>
          <div className="card" style={{ padding: 14 }}>
            <WeeklyVolume />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionH kicker="Top priority">Key sessions ahead</SectionH>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <KeyRow date="Tue 12 May" name="VO₂ 5×4 @ 115%" tag="VO2" tss={105} highlight />
          <KeyRow date="Sun 17 May" name="FTP test · 20-min" tag="Test" tss={95} />
          <KeyRow date="Sat 23 May" name="5h endurance + 3×20" tag="Long" tss={295} />
          <KeyRow date="Sat 30 May" name="Race simulation" tag="Brick" tss={325} />
          <KeyRow date="Sat 06 Jun" name="Mt Tam Century · A" tag="Race" tss={350} race />
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionH kicker="FTP progression · 24w">Threshold trend</SectionH>
        <div style={{ padding: '0 16px' }}>
          <div className="card" style={{ padding: 14 }}>
            <FTPCurve />
          </div>
        </div>
      </div>

      <div style={{ padding: '22px 16px 0' }}>
        <button
          type="button"
          style={{
            width: '100%',
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
          }}
        >
          <ICONS.fork s={14} /> Adjust plan
        </button>
      </div>
    </div>
  );
}

type PhaseRow = {
  name: string;
  weeks: number;
  done?: boolean;
  current?: boolean;
  progress?: number;
};

function PhaseProgress() {
  const phases: PhaseRow[] = [
    { name: 'Base', weeks: 8, done: true },
    { name: 'Build', weeks: 10, current: true, progress: 9 / 10 },
    { name: 'Peak', weeks: 4 },
    { name: 'Taper', weeks: 2 },
  ];
  return (
    <div className="card" style={{ padding: 14 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 12,
        }}
      >
        <span className="cap">Phase</span>
        <span className="num" style={{ fontSize: 11, color: 'var(--ink-3)' }}>17 / 24 weeks</span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {phases.map((p) => (
          <div
            key={p.name}
            style={{ flex: p.weeks, display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: p.done
                  ? 'var(--accent)'
                  : p.current
                    ? 'var(--line-3)'
                    : 'var(--line)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {p.current && p.progress != null && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${p.progress * 100}%`,
                    background: 'var(--accent)',
                  }}
                />
              )}
            </div>
            <div
              className="cap"
              style={{
                fontSize: 9,
                color: p.current
                  ? 'var(--accent)'
                  : p.done
                    ? 'var(--ink-2)'
                    : 'var(--ink-4)',
              }}
            >
              {p.name}
            </div>
            <div className="num" style={{ fontSize: 9, color: 'var(--ink-4)' }}>
              {p.weeks}w
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Build · week 9 of 10</div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
          Sweet-spot + threshold focus, 2 quality + 1 long ride per week.
        </div>
      </div>
    </div>
  );
}

function WeeklyVolume() {
  const data = [
    8, 9, 10, 11, 9, 11, 12, 7,
    10, 11, 13, 14, 11, 13, 14, 15, 11,
    15, 16, 18, 14,
    12, 8, 5,
  ];
  const max = Math.max(...data);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80 }}>
        {data.map((v, i) => {
          const isCurrent = i === 16;
          const inFuture = i > 16;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${(v / max) * 100}%`,
                background: isCurrent
                  ? 'var(--accent)'
                  : inFuture
                    ? 'var(--line-2)'
                    : 'var(--ink-3)',
                borderRadius: 1,
                opacity: isCurrent ? 1 : inFuture ? 1 : 0.5,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
          fontSize: 9,
          color: 'var(--ink-4)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>W1</span>
        <span>Race day W24</span>
      </div>
      <div
        style={{
          marginTop: 8,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          paddingTop: 10,
          borderTop: '1px solid var(--line)',
        }}
      >
        <Stat label="This wk" value="14" unit="h" />
        <Stat label="Peak wk" value="18" unit="h" />
        <Stat label="Avg" value="11.4" unit="h" />
      </div>
    </div>
  );
}

type KeyRowProps = {
  date: string;
  name: string;
  tag: string;
  tss: number;
  highlight?: boolean;
  race?: boolean;
};

function KeyRow({ date, name, tag, tss, highlight, race }: KeyRowProps) {
  const parts = date.split(' ');
  return (
    <div
      className="card"
      style={{
        padding: '11px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderColor: race ? 'var(--accent)' : highlight ? 'var(--line-2)' : 'var(--line)',
        background: race ? 'var(--accent-glow)' : highlight ? 'var(--bg-2)' : 'var(--bg-1)',
      }}
    >
      <div style={{ width: 56 }}>
        <div className="cap" style={{ fontSize: 9 }}>
          {parts[0]} {parts[1]}
        </div>
        <div className="num" style={{ fontSize: 14, fontWeight: 500 }}>{parts[2]}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <Pill
            color={race ? 'var(--accent)' : 'var(--ink-2)'}
            bg={race ? 'var(--accent-soft)' : 'var(--bg-3)'}
          >
            {tag}
          </Pill>
          <Pill>TSS {tss}</Pill>
        </div>
      </div>
      <ICONS.chev s={12} />
    </div>
  );
}

function FTPCurve() {
  const ftp: (number | null)[] = [
    255, 255, 258, 260, 263, 265, 268, 270, 272, 275, 278, 280, 283, 285, 287, 285, 287,
    null, null, null, null, null, null, null,
  ];
  const projected: (number | null)[] = [...ftp];
  for (let i = 17; i < 24; i++) projected[i] = (ftp[16] as number) + (i - 16) * 1.3;
  const max = 305;
  const min = 250;
  const W = 320;
  const H = 80;

  const path = (data: (number | null)[]) => {
    return (
      'M ' +
      data
        .map((v, i) => {
          if (v == null) return null;
          const x = (i / 23) * W;
          const y = H - ((v - min) / (max - min)) * H;
          return `${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .filter(Boolean)
        .join(' L ')
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <Stat label="Current FTP" value="287" unit="W" accent />
        <div style={{ textAlign: 'right' }}>
          <div className="cap">vs start</div>
          <div className="num" style={{ fontSize: 13, marginTop: 2, color: 'var(--accent)' }}>
            +32W (+12.5%)
          </div>
        </div>
      </div>
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: 'block', marginTop: 6 }}
      >
        {[270, 290].map((v) => {
          const y = H - ((v - min) / (max - min)) * H;
          return (
            <line key={v} x1="0" x2={W} y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 3" />
          );
        })}
        <path
          d={path(projected)}
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <path
          d={path(ftp)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {(() => {
          const i = 16;
          const x = (i / 23) * W;
          const y = H - (((ftp[i] as number) - min) / (max - min)) * H;
          return <circle cx={x} cy={y} r="3" fill="var(--accent)" />;
        })()}
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          fontSize: 9,
          color: 'var(--ink-4)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span>Dec '25</span>
        <span>Today</span>
        <span>Race</span>
      </div>
    </div>
  );
}
