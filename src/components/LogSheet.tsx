import { useState, type CSSProperties } from 'react';
import { ICONS } from './icons';

export type LogKind = 'weight' | 'meal';

export function LogSheet({ kind, onClose }: { kind: LogKind; onClose: () => void }) {
  return (
    <>
      <div className="sheet-bg" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-handle" />
        {kind === 'weight' && <WeightLog onClose={onClose} />}
        {kind === 'meal' && <MealLog onClose={onClose} />}
      </div>
    </>
  );
}

function WeightLog({ onClose }: { onClose: () => void }) {
  const [val, setVal] = useState(73.6);

  const adj = (d: number) => setVal((v) => Math.round((v + d) * 10) / 10);

  return (
    <div style={{ padding: '6px 20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div className="cap">Quick log</div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>Morning weight</div>
        </div>
        <button onClick={onClose} style={closeBtn}>Cancel</button>
      </div>

      <div
        style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          borderRadius: 16,
          padding: '24px 16px',
          textAlign: 'center',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
          <span
            className="num"
            style={{
              fontSize: 56,
              fontWeight: 500,
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
              lineHeight: 1,
            }}
          >
            {val.toFixed(1)}
          </span>
          <span className="num" style={{ fontSize: 14, color: 'var(--ink-3)' }}>kg</span>
        </div>
        <div className="num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>
          Yesterday 73.7 · 7d avg 73.9 · target 72.0
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
        {[-0.5, -0.1, +0.1, +0.5].map((d) => (
          <button key={d} onClick={() => adj(d)} style={adjBtn}>
            {d > 0 ? '+' : ''}
            {d.toFixed(1)}
          </button>
        ))}
      </div>

      <div className="cap" style={{ marginBottom: 6 }}>Recorded</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['Now', 'On wake', 'Custom'].map((t, i) => (
          <button
            key={t}
            type="button"
            className={`btn-ghost ${i === 1 ? 'active' : ''}`}
            style={{ flex: 1 }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="cap" style={{ marginBottom: 6 }}>Tag</div>
      <div className="h-scroll" style={{ marginBottom: 18 }}>
        {['Post-ride', 'Fasted', 'Post-meal', 'Travel', 'Sick'].map((t) => (
          <button key={t} type="button" className="btn-ghost" style={{ flex: '0 0 auto' }}>
            {t}
          </button>
        ))}
      </div>

      <button onClick={onClose} style={savePrimaryBtn}>
        Save · {val.toFixed(1)} kg
      </button>
    </div>
  );
}

function MealLog({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'quick' | 'search' | 'scan'>('quick');
  return (
    <div style={{ padding: '6px 20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div className="cap">Quick log</div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>Add meal</div>
        </div>
        <button onClick={onClose} style={closeBtn}>Cancel</button>
      </div>

      <div className="h-scroll" style={{ marginBottom: 14 }}>
        {(
          [
            ['Breakfast', '07:30'],
            ['Pre-ride', '08:30'],
            ['On bike', '11:00'],
            ['Lunch', '12:30'],
            ['Snack', '15:00'],
            ['Dinner', '19:00'],
          ] as const
        ).map(([m, t], i) => (
          <button
            key={m}
            type="button"
            className={`btn-ghost ${i === 1 ? 'active' : ''}`}
            style={{ flex: '0 0 auto' }}
          >
            {m}{' '}
            <span className="num" style={{ opacity: 0.6, marginLeft: 4 }}>{t}</span>
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 3,
          background: 'var(--bg-2)',
          borderRadius: 10,
          marginBottom: 14,
        }}
      >
        {(
          [
            ['quick', 'Quick'],
            ['search', 'Search'],
            ['scan', 'Scan'],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            style={{
              flex: 1,
              padding: '8px 0',
              background: tab === k ? 'var(--bg-3)' : 'transparent',
              border: 0,
              borderRadius: 7,
              color: tab === k ? 'var(--ink)' : 'var(--ink-3)',
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === 'quick' && <QuickFoods />}
      {tab === 'search' && <SearchPlaceholder />}
      {tab === 'scan' && <ScanPlaceholder />}

      <button onClick={onClose} style={{ ...savePrimaryBtn, marginTop: 18 }}>
        Add to pre-ride · 1 item
      </button>
    </div>
  );
}

type FoodItem = {
  name: string;
  cat: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  sel?: boolean;
};

function QuickFoods() {
  const items: FoodItem[] = [
    { name: 'SiS Beta Fuel 80', cat: 'On-bike', kcal: 320, p: 0, c: 80, f: 0, sel: true },
    { name: 'Maurten Drink Mix 320', cat: 'On-bike', kcal: 320, p: 0, c: 80, f: 0 },
    { name: 'Oats + banana + honey', cat: 'Pre-ride', kcal: 480, p: 12, c: 88, f: 9 },
    { name: 'Greek yogurt + berries', cat: 'Breakfast', kcal: 230, p: 22, c: 28, f: 4 },
    { name: 'Salmon + rice + greens', cat: 'Dinner', kcal: 640, p: 42, c: 68, f: 22 },
    { name: 'Eggs + toast + avo', cat: 'Breakfast', kcal: 540, p: 26, c: 38, f: 30 },
  ];
  return (
    <div>
      <div className="cap" style={{ marginBottom: 6 }}>Frequent</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              background: it.sel ? 'var(--accent-glow)' : 'var(--bg-2)',
              border: `1px solid ${it.sel ? 'var(--accent-d)' : 'var(--line)'}`,
              borderRadius: 10,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{it.name}</div>
              <div className="num" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
                {it.kcal} kcal · P{it.p} · C{it.c} · F{it.f}
              </div>
            </div>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                border: `1px solid ${it.sel ? 'var(--accent)' : 'var(--line-3)'}`,
                background: it.sel ? 'var(--accent)' : 'transparent',
                color: it.sel ? 'var(--bg)' : 'var(--ink-3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {it.sel ? <ICONS.check s={12} /> : <ICONS.plus s={12} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchPlaceholder() {
  return (
    <div
      style={{
        padding: 12,
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        color: 'var(--ink-3)',
        fontSize: 13,
        textAlign: 'center',
      }}
    >
      Type a food, brand, or paste a recipe URL…
    </div>
  );
}

function ScanPlaceholder() {
  return (
    <div
      style={{
        padding: 36,
        background: 'var(--bg-2)',
        border: '1px dashed var(--line-2)',
        borderRadius: 10,
        color: 'var(--ink-3)',
        fontSize: 13,
        textAlign: 'center',
      }}
    >
      Point at a barcode or meal
    </div>
  );
}

const closeBtn: CSSProperties = {
  background: 'transparent',
  border: 0,
  color: 'var(--ink-3)',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  cursor: 'pointer',
  padding: 6,
};

const adjBtn: CSSProperties = {
  padding: '12px 8px',
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
  borderRadius: 10,
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  cursor: 'pointer',
  fontWeight: 500,
};

const savePrimaryBtn: CSSProperties = {
  width: '100%',
  padding: '14px',
  background: 'var(--accent)',
  border: 0,
  color: '#0a0a0a',
  borderRadius: 12,
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  letterSpacing: '0.01em',
};
