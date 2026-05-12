import type { CSSProperties } from 'react';
import { ICONS, ACT_ICON } from './icons';
import {
  KCAL_TARGETS,
  dateForDay,
  dayKind,
  formatShort,
} from '../data/plan';
import { useSwaps } from '../data/swaps';

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export function SwapSheet({
  w,
  effD,
  onClose,
}: {
  w: number;
  effD: number;
  onClose: () => void;
}) {
  const { effectiveDay, swapBlocker, swap, isSwapped, resetWeek } = useSwaps();
  const source = effectiveDay(w, effD);
  const sourceKind = dayKind(source);

  return (
    <>
      <div className="sheet-bg" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-handle" />
        <div style={{ padding: '6px 20px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <div>
              <div className="cap">Move workout</div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>
                {source.name}
              </div>
              <div className="num" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
                {formatShort(dateForDay(w, effD))} · {sourceKind.replace('_', ' ')} · {KCAL_TARGETS[sourceKind]} kcal
              </div>
            </div>
            <button onClick={onClose} style={closeBtn}>
              Cancel
            </button>
          </div>

          <div className="cap" style={{ marginBottom: 6 }}>
            Swap with…
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            {Array.from({ length: 7 }, (_, i) => i)
              .filter((i) => i !== effD)
              .map((i) => {
                const target = effectiveDay(w, i);
                const targetKind = dayKind(target);
                const blocker = swapBlocker(w, effD, i);
                const TargetIcon = ACT_ICON[target.type] ?? ICONS.rest;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!!blocker}
                    onClick={() => {
                      swap(w, effD, i);
                      onClose();
                    }}
                    style={{
                      ...rowBtn,
                      opacity: blocker ? 0.4 : 1,
                      cursor: blocker ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        textAlign: 'center',
                        color: 'var(--ink-3)',
                      }}
                    >
                      <div className="cap" style={{ fontSize: 9 }}>
                        {DAY_LETTERS[i]}
                      </div>
                      <div className="num" style={{ fontSize: 13, fontWeight: 500, marginTop: 1, color: 'var(--ink)' }}>
                        {dateForDay(w, i).getUTCDate()}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: 'var(--bg-3)',
                        color: target.type === 'rest' ? 'var(--ink-4)' : 'var(--ink-2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TargetIcon s={13} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{target.name}</div>
                      <div className="num" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
                        {targetKind.replace('_', ' ')} · {KCAL_TARGETS[targetKind]} kcal
                        {blocker ? ` · ${blocker}` : ''}
                      </div>
                    </div>
                    {!blocker && <ICONS.chev s={12} />}
                  </button>
                );
              })}
          </div>

          {isSwapped(w) && (
            <button
              type="button"
              onClick={() => {
                resetWeek(w);
                onClose();
              }}
              style={resetBtn}
            >
              Reset week to original plan
            </button>
          )}
        </div>
      </div>
    </>
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

const rowBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 12px',
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
  borderRadius: 10,
  fontFamily: 'var(--font-sans)',
  width: '100%',
  textAlign: 'left',
};

const resetBtn: CSSProperties = {
  width: '100%',
  padding: '12px',
  background: 'transparent',
  border: '1px solid var(--line)',
  color: 'var(--ink-3)',
  borderRadius: 10,
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  cursor: 'pointer',
};
