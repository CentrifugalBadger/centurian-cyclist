import { useState, type CSSProperties } from 'react';
import { PLAN_DATA, dateForDay, formatShort } from '../data/plan';
import { useWorkoutLog, type WorkoutStatus } from '../data/workoutLog';

const STATUS: { key: WorkoutStatus; label: string }[] = [
  { key: 'completed', label: 'Done' },
  { key: 'partial', label: 'Partial' },
  { key: 'modified', label: 'Modified' },
  { key: 'skipped', label: 'Skipped' },
];

function durationGuess(tss: number): number {
  if (tss === 0) return 0;
  return Math.max(15, Math.round((tss / 55) * 60));
}

export function WorkoutSheet({
  w,
  d,
  onClose,
}: {
  w: number;
  d: number;
  onClose: () => void;
}) {
  const day = PLAN_DATA.weeks[w - 1].days[d];
  const { getEntry, saveEntry, clearEntry } = useWorkoutLog();
  const existing = getEntry(w, d);

  const [status, setStatus] = useState<WorkoutStatus>(existing?.status ?? 'completed');
  const [rpe, setRpe] = useState<number | undefined>(existing?.rpe ?? (day.tss > 0 ? 5 : undefined));
  const [durationMin, setDurationMin] = useState<string>(
    existing?.durationMin?.toString() ?? (day.tss > 0 ? durationGuess(day.tss).toString() : ''),
  );
  const [avgHr, setAvgHr] = useState<string>(existing?.avgHr?.toString() ?? '');
  const [notes, setNotes] = useState<string>(existing?.notes ?? '');

  const rpeRequired = status !== 'skipped';
  const canSave = !rpeRequired || (rpe !== undefined && rpe >= 1 && rpe <= 10);

  const save = () => {
    saveEntry(w, d, {
      status,
      rpe: rpeRequired ? rpe : undefined,
      durationMin: durationMin ? Number(durationMin) : undefined,
      avgHr: avgHr ? Number(avgHr) : undefined,
      notes: notes.trim() || undefined,
      savedAt: Date.now(),
    });
    onClose();
  };

  const remove = () => {
    clearEntry(w, d);
    onClose();
  };

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
              <div className="cap">
                {formatShort(dateForDay(w, d))} · Week {w}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>
                {day.name}
              </div>
            </div>
            <button onClick={onClose} style={closeBtn}>
              Cancel
            </button>
          </div>

          <div className="cap" style={{ marginBottom: 6 }}>
            Status
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
            {STATUS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setStatus(s.key)}
                style={{
                  ...pillBtn,
                  background: status === s.key ? 'var(--accent)' : 'var(--bg-2)',
                  color: status === s.key ? '#0a0a0a' : 'var(--ink)',
                  borderColor: status === s.key ? 'var(--accent)' : 'var(--line)',
                  fontWeight: status === s.key ? 600 : 500,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {rpeRequired && (
            <>
              <div className="cap" style={{ marginBottom: 6 }}>
                RPE (1-10)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4, marginBottom: 14 }}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                  const sel = rpe === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRpe(n)}
                      style={{
                        ...rpeBtn,
                        background: sel ? 'var(--accent)' : 'var(--bg-2)',
                        color: sel ? '#0a0a0a' : 'var(--ink)',
                        borderColor: sel ? 'var(--accent)' : 'var(--line)',
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            <NumField
              label="Duration (min)"
              value={durationMin}
              onChange={setDurationMin}
              placeholder="—"
            />
            <NumField label="Avg HR" value={avgHr} onChange={setAvgHr} placeholder="—" />
          </div>

          <div className="cap" style={{ marginBottom: 6 }}>
            Notes
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="How did it feel? Wind, traffic, anything to remember…"
            style={notesBox}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {existing && (
              <button type="button" onClick={remove} style={secondaryBtn}>
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!canSave}
              style={{
                ...primaryBtn,
                opacity: canSave ? 1 : 0.5,
                cursor: canSave ? 'pointer' : 'not-allowed',
              }}
            >
              {existing ? 'Save changes' : 'Log workout'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function NumField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <div className="cap" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={numInput}
      />
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

const pillBtn: CSSProperties = {
  padding: '10px 8px',
  border: '1px solid var(--line)',
  borderRadius: 10,
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  cursor: 'pointer',
};

const rpeBtn: CSSProperties = {
  padding: '10px 0',
  border: '1px solid var(--line)',
  borderRadius: 8,
  fontFamily: 'var(--font-mono)',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
};

const numInput: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
  borderRadius: 10,
  fontFamily: 'var(--font-mono)',
  fontSize: 14,
  outline: 'none',
};

const notesBox: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
  borderRadius: 10,
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  resize: 'vertical',
  outline: 'none',
};

const primaryBtn: CSSProperties = {
  flex: 1,
  padding: '14px',
  background: 'var(--accent)',
  border: 0,
  color: '#0a0a0a',
  borderRadius: 12,
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '0.01em',
};

const secondaryBtn: CSSProperties = {
  padding: '14px 18px',
  background: 'var(--bg-2)',
  border: '1px solid var(--line)',
  color: 'var(--ink-2)',
  borderRadius: 12,
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  cursor: 'pointer',
};
