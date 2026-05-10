import type { AccentKey } from '../types';

type AccentPreset = { l: number; c: number; h: number; name: string };

export const ACCENT_PRESETS: Record<AccentKey, AccentPreset> = {
  green: { l: 0.82, c: 0.20, h: 145, name: 'Signal' },
  orange: { l: 0.78, c: 0.18, h: 35, name: 'Cycling' },
  yellow: { l: 0.86, c: 0.18, h: 95, name: 'Hi-vis' },
  blue: { l: 0.78, c: 0.16, h: 240, name: 'Cobalt' },
  white: { l: 0.96, c: 0.0, h: 0, name: 'Mono' },
};

export function applyAccent(key: AccentKey): void {
  const p = ACCENT_PRESETS[key];
  const root = document.documentElement;
  root.style.setProperty('--accent', `oklch(${p.l} ${p.c} ${p.h})`);
  root.style.setProperty(
    '--accent-d',
    `oklch(${Math.max(0.4, p.l - 0.27)} ${p.c * 0.8} ${p.h})`,
  );
  root.style.setProperty(
    '--accent-soft',
    `oklch(0.30 ${Math.max(0.05, p.c * 0.55)} ${p.h} / 0.35)`,
  );
  root.style.setProperty(
    '--accent-glow',
    `oklch(${p.l} ${p.c} ${p.h} / 0.18)`,
  );
}
