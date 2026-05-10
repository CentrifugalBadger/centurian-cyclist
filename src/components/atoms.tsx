import type { CSSProperties, ReactNode } from 'react';

type SparkProps = {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: boolean;
  strokeWidth?: number;
  dot?: boolean;
};

export function Spark({
  data,
  width = 80,
  height = 26,
  stroke = 'currentColor',
  fill = false,
  strokeWidth = 1.5,
  dot = true,
}: SparkProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const r = max - min || 1;
  const step = width / (data.length - 1);
  const pts: [number, number][] = data.map((v, i) => [
    i * step,
    height - 4 - ((v - min) / r) * (height - 8),
  ]);
  const path = 'M ' + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ');
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && (
        <path
          d={`${path} L ${width} ${height} L 0 ${height} Z`}
          fill={stroke}
          fillOpacity="0.12"
        />
      )}
      <path d={path} className="spark" stroke={stroke} strokeWidth={strokeWidth} />
      {dot && <circle cx={last[0]} cy={last[1]} r="2" fill={stroke} />}
    </svg>
  );
}

type BarsProps = {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  highlight?: number;
};

export function Bars({
  data,
  width = 80,
  height = 26,
  color = 'currentColor',
  highlight = -1,
}: BarsProps) {
  const max = Math.max(...data, 1);
  const w = width / data.length;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((v, i) => {
        const h = Math.max(2, (v / max) * (height - 2));
        return (
          <rect
            key={i}
            x={i * w + 1}
            y={height - h}
            width={Math.max(2, w - 2)}
            height={h}
            rx={1}
            fill={color}
            opacity={i === highlight ? 1 : 0.4}
          />
        );
      })}
    </svg>
  );
}

type RingProps = {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
};

export function Ring({
  value,
  size = 64,
  stroke = 6,
  color = 'currentColor',
  track = 'rgba(255,255,255,0.06)',
  children,
}: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const d = c - Math.min(value, 1) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={d}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.2,0.9,0.3,1)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
    </div>
  );
}

type HBarSeg = { value: number; color: string };

export function HBar({ segs, height = 6 }: { segs: HBarSeg[]; height?: number }) {
  const total = segs.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div
      style={{
        display: 'flex',
        height,
        width: '100%',
        borderRadius: 999,
        overflow: 'hidden',
        background: 'var(--line)',
      }}
    >
      {segs.map((s, i) => (
        <div key={i} style={{ flex: s.value / total, background: s.color }} />
      ))}
    </div>
  );
}

type SectionHProps = {
  kicker?: string;
  children: ReactNode;
  action?: ReactNode;
};

export function SectionH({ kicker, children, action }: SectionHProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '0 16px',
        marginBottom: 10,
      }}
    >
      <div>
        {kicker && <div className="cap" style={{ marginBottom: 2 }}>{kicker}</div>}
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{children}</div>
      </div>
      {action && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{action}</div>}
    </div>
  );
}

type PillProps = {
  children: ReactNode;
  color?: string;
  bg?: string;
  mono?: boolean;
};

export function Pill({
  children,
  color = 'var(--ink-2)',
  bg = 'var(--bg-3)',
  mono = true,
}: PillProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 7px',
        borderRadius: 4,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        fontSize: 10,
        letterSpacing: mono ? '0.06em' : 0,
        color,
        background: bg,
        fontWeight: 500,
        textTransform: mono ? 'uppercase' : 'none',
      }}
    >
      {children}
    </span>
  );
}

type StatProps = {
  label: string;
  value: ReactNode;
  unit?: string;
  sub?: ReactNode;
  accent?: boolean;
};

export function Stat({ label, value, unit, sub, accent = false }: StatProps) {
  const valueStyle: CSSProperties = {
    fontSize: 22,
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: accent ? 'var(--accent)' : 'var(--ink)',
  };
  return (
    <div>
      <div className="cap">{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 3 }}>
        <span className="num" style={valueStyle}>{value}</span>
        {unit && <span className="num" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{unit}</span>}
      </div>
      {sub && (
        <div className="num" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 1 }}>{sub}</div>
      )}
    </div>
  );
}
