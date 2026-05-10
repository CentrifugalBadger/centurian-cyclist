import type { ComponentType } from 'react';
import type { ActivityType } from '../types';

type IconProps = { s?: number };
type ChevProps = IconProps & { dir?: 'right' | 'down' | 'left' | 'up' };

export const ICONS = {
  today: ({ s = 20 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  cal: ({ s = 20 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  plan: ({ s = 20 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 19l5-9 4 5 4-7 5 11" />
      <path d="M3 19h18" />
    </svg>
  ),
  body: ({ s = 20 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a3 3 0 100 6 3 3 0 000-6z" />
      <path d="M6 21v-3a3 3 0 013-3h6a3 3 0 013 3v3" />
      <path d="M9 12l-2 4M15 12l2 4" />
    </svg>
  ),
  bolt: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 11-13h-7z" /></svg>
  ),
  heart: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 8.5c0 6-8 11-8 11s-8-5-8-11a4.5 4.5 0 018-2.7A4.5 4.5 0 0120 8.5z" /></svg>
  ),
  bed: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12V5M21 18v-5a3 3 0 00-3-3H3M3 18h18M7 10V8a1 1 0 011-1h3a1 1 0 011 1v2" />
    </svg>
  ),
  drop: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z" /></svg>
  ),
  bike: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5l3.5-7h6l-2-4M9 10.5l3.5 7M14 6h3" />
    </svg>
  ),
  run: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="15" cy="4.5" r="1.7" />
      <path d="M9 21l3-6-3-3 4-3 3 4 3 1M5 13l3-2" />
    </svg>
  ),
  lift: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M5 9v6M9 7v10M15 7v10M19 9v6M3 12h18" />
    </svg>
  ),
  yoga: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="1.6" />
      <path d="M12 7v4M5 10l7 1 7-1M9 21l3-9 3 9" />
    </svg>
  ),
  rest: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
  ),
  plus: ({ s = 16 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
  ),
  chev: ({ s = 14, dir = 'right' }: ChevProps) => {
    const r = { right: 0, down: 90, left: 180, up: 270 }[dir];
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${r}deg)` }}>
        <path d="M9 5l7 7-7 7" />
      </svg>
    );
  },
  check: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-12" /></svg>
  ),
  alert: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4M12 17h.01M3 19h18L12 3 3 19z" />
    </svg>
  ),
  trend: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-9M14 6h7v7" /></svg>
  ),
  fork: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3v6a3 3 0 003 3h0a3 3 0 003-3V3M8 12v9M19 3v8a3 3 0 01-3 3v7" />
    </svg>
  ),
  weight: ({ s = 14 }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h14l-2 13H7L5 8z" />
      <path d="M9 8c0-2 1-4 3-4s3 2 3 4" />
    </svg>
  ),
} as const;

export const ACT_ICON: Record<ActivityType, ComponentType<IconProps>> = {
  ride: ICONS.bike,
  run: ICONS.run,
  lift: ICONS.lift,
  yoga: ICONS.yoga,
  rest: ICONS.rest,
};
