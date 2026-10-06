/**
 * Inline SVG icon set. Kept local so the page ships with zero icon-library
 * dependencies. All icons are drawn on a 24x24 grid with currentColor strokes.
 */

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Svg = ({ children, ...rest }) => (
  <svg {...base} {...rest}>
    {children}
  </svg>
)

export const Chip = (p) => (
  <Svg {...p}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" opacity=".45" />
    <path d="M10 3.5v3M14 3.5v3M10 17.5v3M14 17.5v3M3.5 10h3M3.5 14h3M17.5 10h3M17.5 14h3" />
  </Svg>
)

export const Magnet = (p) => (
  <Svg {...p}>
    <path d="M6 4v7a6 6 0 0 0 12 0V4" />
    <path d="M6 9h4M14 9h4" />
    <path d="M6 4h4v5H6zM14 4h4v5h-4z" opacity=".45" />
  </Svg>
)

export const Layers = (p) => (
  <Svg {...p}>
    <path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" />
    <path d="m3 12 9 4.5L21 12" opacity=".7" />
    <path d="m3 16.5 9 4.5 9-4.5" opacity=".4" />
  </Svg>
)

export const Globe = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
  </Svg>
)

export const Shield = (p) => (
  <Svg {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.5 7.5-5 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Svg>
)

export const Bolt = (p) => (
  <Svg {...p}>
    <path d="M13.5 2 5 13.5h6L10.5 22 19 10.5h-6L13.5 2Z" />
  </Svg>
)

export const TimelineIcon = (p) => (
  <Svg {...p}>
    <path d="M3 6h9M8 12h13M3 18h6" />
    <rect x="3" y="4.5" width="3" height="3" rx=".5" />
    <rect x="6.5" y="10.5" width="3" height="3" rx=".5" />
    <rect x="3" y="16.5" width="3" height="3" rx=".5" />
    <path d="M14 2.5v19" strokeWidth="1.25" opacity=".5" />
  </Svg>
)

export const Grid = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1" />
  </Svg>
)

export const Sliders = (p) => (
  <Svg {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2.1" />
    <circle cx="9" cy="17" r="2.1" />
  </Svg>
)

export const Download = (p) => (
  <Svg {...p}>
    <path d="M12 3v11" />
    <path d="m7.5 10 4.5 4.5 4.5-4.5" />
    <path d="M4 19.5h16" />
  </Svg>
)

export const Check = (p) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
)

export const Play = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M7 4.5v15l13-7.5-13-7.5Z" />
  </Svg>
)

/* --- Brand glyphs (filled, no stroke) --- */

export const Windows = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M3 5.4 10.2 4.5v7.1H3V5.4Zm0 13.2 7.2.9v-7.1H3v6.2Zm8.7 1.2L21 21V11.6h-9.3v8.2Zm0-15.6v8.1H21V3l-9.3 1Z" />
  </svg>
)

export const Android = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.05 8.03h-.02a4.1 4.1 0 0 0-.79-1.83l1.62-1.62a.2.2 0 0 0 0-.29.2.2 0 0 0-.28 0l-1.63 1.63a4.98 4.98 0 0 0-3.7-1.66h-.01a4.98 4.98 0 0 0-3.7 1.66L7.92 5.3a.2.2 0 0 0-.29 0 .2.2 0 0 0 0 .28l1.62 1.63a4.1 4.1 0 0 0-.79 1.83H8.44C6.63 8.03 5.2 9.45 5.2 11.27v6.32c0 .18.15.33.33.33h.34v4.19c0 .18.15.33.33.33h2.13c.18 0 .33-.15.33-.33v-4.19h6.68v4.19c0 .18.15.33.33.33h2.13c.18 0 .33-.15.33-.33v-4.19h.34c.18 0 .33-.15.33-.33v-6.32c0-1.82-1.43-3.24-3.25-3.24ZM8.1 10.7a.9.9 0 1 1 .9-.9.9.9 0 0 1-.9.9Zm7.8 0a.9.9 0 1 1 .9-.9.9.9 0 0 1-.9.9Z" />
  </svg>
)

export const ICONS = {
  chip: Chip,
  magnet: Magnet,
  layers: Layers,
  globe: Globe,
  shield: Shield,
  bolt: Bolt,
  timeline: TimelineIcon,
  grid: Grid,
  sliders: Sliders,
  download: Download,
  check: Check,
}