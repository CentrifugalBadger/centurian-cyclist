// Small localStorage wrapper with try/catch and a key prefix.
// Read once on mount via useState(() => loadJson(...)); write on change via useEffect.

const PREFIX = 'cc.';

export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // quota exceeded, private mode, etc. — silently ignore
  }
}
