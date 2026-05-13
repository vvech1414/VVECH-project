/** @type {import('tailwindcss').Config} */
// NOTE: this config intentionally rewrites Tailwind's default `cyan-*` palette
// to the medical-blue ramp (see `colors.cyan` block below). Historical class
// names like `bg-cyan-50` therefore resolve to brand blue (#EFF6FF…#1E3A8A),
// not Tailwind's default bright cyan (#06B6D4). Component code reads as
// `text-cyan-500` for legibility, but the rendered color is blue. The Figma
// System page labels this ramp "Brand blue (Tailwind alias: cyan-*)".
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        // Token aliases for the off-default steps in `--space-*`
        // (4-pt grid up to --space-6 = 24px matches Tailwind defaults).
        // Use these when a layout must follow the documented 8/4-grid token
        // scale: e.g. `pb-8-token` for a 40px sticky-CTA gutter.
        '7-token': '32px',   // --space-7
        '8-token': '40px',   // --space-8
        '9-token': '48px',   // --space-9
        '10-token': '64px',  // --space-10
      },
      colors: {
        // ─── Semantic aliases (mirror colors_and_type.css) ──────────────
        brand: 'var(--color-primary)',
        'brand-hover': 'var(--color-primary-hover)',
        'brand-pressed': 'var(--color-primary-pressed)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        'surface-sunken': 'var(--color-surface-sunken)',
        'surface-muted': 'var(--color-surface-muted)',
        'page-bg': 'var(--color-bg)',
        ink: 'var(--color-text)',
        'ink-strong': 'var(--color-text-strong)',
        'ink-muted': 'var(--color-text-muted)',
        'ink-subtle': 'var(--color-text-subtle)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        divider: 'var(--color-divider)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-error)',
        // ─── Medical primary ramp (matches design tokens) ───────────────
        // We override `cyan` so historical class names continue to resolve
        // to the medical-blue ramp without a global rewrite.
        cyan: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E3A8A',
          accent: '#2563EB',
        },
        // Slate-based "navy" alias (cool ink, not the legacy navy).
        navy: {
          950: '#020617',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        ui: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Montserrat Alternates', 'Montserrat', 'sans-serif'],
        data: ['Inter', 'sans-serif'],
      },
      fontSize: {
        micro: ['10px', { lineHeight: '1.4' }],
        caption: ['12px', { lineHeight: '1.4' }],
        body: ['14px', { lineHeight: '1.43' }],
        'body-lg': ['16px', { lineHeight: '1.4' }],
        'h3-ui': ['18px', { lineHeight: '1' }],
        'h2-ui': ['20px', { lineHeight: '1.2' }],
        'h1-ui': ['24px', { lineHeight: '1.2' }],
      },
      borderRadius: {
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        focus: 'var(--shadow-focus)',
      },
      letterSpacing: {
        ui: 'var(--tracking-ui)',
        caps: 'var(--tracking-caps)',
        tight: 'var(--tracking-tight)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        standard: 'var(--ease-standard)',
      },
    },
  },
  plugins: [],
}
