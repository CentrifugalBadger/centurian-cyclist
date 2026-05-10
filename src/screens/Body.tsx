import type { CSSProperties } from 'react';
import { ICONS } from '../components/icons';
import { HBar, Pill, Spark, SectionH } from '../components/atoms';
import type { LogKind } from '../components/LogSheet';

export function Body({ onLog }: { onLog: (k: LogKind) => void }) {
  return (
    <div style={{ paddingBottom: 28 }}>
      <div style={{ padding: '8px 16px 0' }}>
        <div className="cap">Athlete · 32 yr · 178 cm</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 2 }}>
          Body
        </div>
      </div>

      <div style={{ padding: '14px 16px 0' }}>
        <div className="card" style={{ padding: 14 }}>
          <BodyHero onLog={onLog} />
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionH kicker="Trends · 90d" action="All →">Vitals</SectionH>
        <div
          style={{
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <TrendRow
            label="Resting HR"
            value="51"
            unit="bpm"
            delta="−3 / 90d"
            tone="ok"
            data={Array.from(
              { length: 90 },
              (_, i) => 54 - i * 0.03 + Math.sin(i / 5) * 1.5,
            )}
          />
          <TrendRow
            label="HRV (rMSSD)"
            value="48"
            unit="ms"
            delta="−2 / 14d"
            tone="warn"
            data={Array.from(
              { length: 90 },
              (_, i) => 45 + i * 0.05 + Math.sin(i / 4) * 4 - (i > 75 ? 4 : 0),
            )}
          />
          <TrendRow
            label="Sleep"
            value="7:24"
            unit="avg"
            delta="+18m / 90d"
            tone="ok"
            data={Array.from(
              { length: 90 },
              (_, i) => 7 + Math.sin(i / 7) * 0.7 + i * 0.005,
            )}
          />
          <TrendRow
            label="Body fat"
            value="12.4"
            unit="%"
            delta="−1.8 / 90d"
            tone="ok"
            data={Array.from(
              { length: 90 },
              (_, i) => 14.2 - i * 0.02 + Math.sin(i / 9) * 0.3,
            )}
          />
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionH kicker="Personal records">Benchmarks</SectionH>
        <div
          style={{
            padding: '0 16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          <BenchCell label="FTP" value="287" unit="W" sub="3.90 W/kg" tag="PR · 2d" />
          <BenchCell label="20-min" value="302" unit="W" sub="4.10 W/kg" tag="PR · 2d" />
          <BenchCell label="5-min" value="412" unit="W" sub="5.60 W/kg" tag="48d" />
          <BenchCell label="1-min" value="624" unit="W" sub="8.48 W/kg" tag="71d" />
          <BenchCell label="Squat 1RM" value="142" unit="kg" sub="1.93 BW" tag="14d" />
          <BenchCell label="VO₂max" value="62.4" unit="ml/kg" sub="estimate" tag="lab" />
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

function BodyHero({ onLog }: { onLog: (k: LogKind) => void }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        <div>
          <div className="cap">Weight · today</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span
              className="num"
              style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.03em' }}
            >
              73.6
            </span>
            <span className="num" style={{ fontSize: 13, color: 'var(--ink-3)' }}>kg</span>
          </div>
          <div className="num" style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>
            −1.2 kg · 14d ↘ on track
          </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="cap">Target · race weight</span>
          <span className="num" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
            72.0 kg / Jun 06
          </span>
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
              width: '67%',
              background: 'var(--accent)',
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
        <div className="cap" style={{ marginBottom: 8 }}>Composition</div>
        <HBar
          segs={[
            { value: 64.5, color: 'var(--accent)' },
            { value: 9.1, color: 'oklch(0.78 0.16 90)' },
          ]}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 6,
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--ink-3)',
          }}
        >
          <span>
            <span style={{ color: 'var(--accent)' }}>●</span> Lean 64.5 kg · 87.6%
          </span>
          <span>
            <span style={{ color: 'oklch(0.78 0.16 90)' }}>●</span> Fat 9.1 kg · 12.4%
          </span>
        </div>
      </div>
    </div>
  );
}

type TrendRowProps = {
  label: string;
  value: string;
  unit: string;
  delta: string;
  tone: 'ok' | 'warn';
  data: number[];
};

function TrendRow({ label, value, unit, delta, tone, data }: TrendRowProps) {
  const c = tone === 'warn' ? 'var(--warn)' : 'var(--accent)';
  return (
    <div
      className="card"
      style={{
        padding: '11px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div style={{ width: 92 }}>
        <div className="cap">{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 2 }}>
          <span
            className="num"
            style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {value}
          </span>
          <span className="num" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{unit}</span>
        </div>
      </div>
      <div style={{ flex: 1, color: c, minWidth: 0 }}>
        <Spark
          data={data}
          width={140}
          height={28}
          stroke="currentColor"
          fill
          strokeWidth={1.2}
          dot={false}
        />
      </div>
      <div
        className="num"
        style={{ fontSize: 10, color: c, textAlign: 'right', minWidth: 56 }}
      >
        {delta}
      </div>
    </div>
  );
}

type BenchCellProps = {
  label: string;
  value: string;
  unit: string;
  sub: string;
  tag: string;
};

function BenchCell({ label, value, unit, sub, tag }: BenchCellProps) {
  const isPR = tag.startsWith('PR');
  return (
    <div className="card" style={{ padding: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="cap">{label}</span>
        <Pill
          color={isPR ? 'var(--accent)' : 'var(--ink-3)'}
          bg={isPR ? 'var(--accent-soft)' : 'var(--bg-3)'}
        >
          {tag}
        </Pill>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 6 }}>
        <span
          className="num"
          style={{ fontSize: 19, fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          {value}
        </span>
        <span className="num" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{unit}</span>
      </div>
      <div className="num" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 1 }}>
        {sub}
      </div>
    </div>
  );
}
