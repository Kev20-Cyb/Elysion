# Elysion Design System - Color Palette

## Brand Colors with Full Scale (50-950)

### Primary Blue (Elysion Primary)
**Base Color (500): #0A418E**

```css
--elysion-primary-50: #f5f7fa
--elysion-primary-100: #eaeff5
--elysion-primary-200: #cddbef
--elysion-primary-300: #97bbec
--elysion-primary-400: #4a90f2
--elysion-primary-500: #0a418e
--elysion-primary-600: #0c4ca7
--elysion-primary-700: #083777
--elysion-primary-800: #022250
--elysion-primary-900: #011532
--elysion-primary-950: #010b19
```

### Secondary Light Blue (Elysion Secondary)
**Base Color: #A8C3E7**

```css
--elysion-secondary-50: #f0f7ff
--elysion-secondary-100: #e0efff
--elysion-secondary-200: #bae0ff
--elysion-secondary-300: #A8C3E7
--elysion-secondary-400: #60a5fa
--elysion-secondary-500: #3b82f6
--elysion-secondary-600: #2563eb
--elysion-secondary-700: #1d4ed8
--elysion-secondary-800: #1e40af
--elysion-secondary-900: #1e3a8a
--elysion-secondary-950: #172554
```

### Accent Orange (Elysion Accent)
**Base Color (500): #FBB03B**

```css
--elysion-accent-50: #faf8f4
--elysion-accent-100: #f6f1ea
--elysion-accent-200: #f1e2cb
--elysion-accent-300: #f1cc93
--elysion-accent-400: #fbb241
--elysion-accent-500: #fbb03b
--elysion-accent-600: #fa9c09
--elysion-accent-700: #d68404
--elysion-accent-800: #b16c00
--elysion-accent-900: #935900
--elysion-accent-950: #744700
```

### Background Light (Elysion Background)
**Base Color: #F6F9FD**

```css
--elysion-bg-50: #F6F9FD
--elysion-bg-100: #f1f5f9
--elysion-bg-200: #e2e8f0
--elysion-bg-300: #cbd5e1
--elysion-bg-400: #94a3b8
--elysion-bg-500: #64748b
--elysion-bg-600: #475569
--elysion-bg-700: #334155
--elysion-bg-800: #1e293b
--elysion-bg-900: #0f172a
--elysion-bg-950: #020617
```

## Neutral Grays

```css
--elysion-gray-50: #f8fafc
--elysion-gray-100: #f1f5f9
--elysion-gray-200: #e2e8f0
--elysion-gray-300: #cbd5e1
--elysion-gray-400: #94a3b8
--elysion-gray-500: #64748b
--elysion-gray-600: #475569
--elysion-gray-700: #334155
--elysion-gray-800: #1e293b
--elysion-gray-900: #0f172a
--elysion-gray-950: #020617
```

## Semantic Colors

### Success Green
```css
--elysion-success-50: #f0fdf4
--elysion-success-100: #dcfce7
--elysion-success-200: #bbf7d0
--elysion-success-300: #86efac
--elysion-success-400: #4ade80
--elysion-success-500: #22c55e
--elysion-success-600: #16a34a
--elysion-success-700: #15803d
--elysion-success-800: #166534
--elysion-success-900: #14532d
--elysion-success-950: #052e16
```

### Warning Orange
```css
--elysion-warning-50: #fff7ed
--elysion-warning-100: #ffedd5
--elysion-warning-200: #fed7aa
--elysion-warning-300: #fdba74
--elysion-warning-400: #fb923c
--elysion-warning-500: #f97316
--elysion-warning-600: #ea580c
--elysion-warning-700: #c2410c
--elysion-warning-800: #9a3412
--elysion-warning-900: #7c2d12
--elysion-warning-950: #431407
```

### Error Red
```css
--elysion-error-50: #fef2f2
--elysion-error-100: #fee2e2
--elysion-error-200: #fecaca
--elysion-error-300: #fca5a5
--elysion-error-400: #f87171
--elysion-error-500: #ef4444
--elysion-error-600: #dc2626
--elysion-error-700: #b91c1c
--elysion-error-800: #991b1b
--elysion-error-900: #7f1d1d
--elysion-error-950: #450a0a
```

## Usage Guidelines

### Primary Use Cases
- **Primary 500**: Main brand color, primary buttons, headers
- **Primary 600**: Hover states for primary elements
- **Primary 400**: Active states, interactive elements
- **Primary 200**: Light backgrounds, subtle highlights
- **Primary 100**: Very light backgrounds
- **Primary 50**: Lightest backgrounds, cards

### Secondary Use Cases
- **Secondary 300**: Default secondary color, calm elements
- **Secondary 200**: Light accents, borders
- **Secondary 100**: Very light backgrounds

### Accent Use Cases
- **Accent 500**: Default accent color, CTAs, highlights
- **Accent 600**: Hover states for accent elements
- **Accent 400**: Lighter accent elements
- **Accent 100**: Light accent backgrounds

### Background Use Cases
- **BG 50**: Main background color
- **BG 100**: Card backgrounds
- **BG 200**: Borders, dividers

## Accessibility Guidelines

### Text Contrast Requirements
- **AA Standard**: 4.5:1 contrast ratio
- **AAA Standard**: 7:1 contrast ratio

### Recommended Combinations
```css
/* High contrast combinations */
Primary 900 on Primary 50    /* Excellent contrast */
Primary 800 on Primary 100   /* Excellent contrast */
Primary 700 on Primary 200   /* Very good contrast */
White on Primary 500         /* Main button text */

/* Accent combinations */
Accent 800 on Accent 50      /* Excellent contrast */
Accent 700 on Accent 100     /* Excellent contrast */
Primary 900 on Accent 500    /* CTA text */
White on Accent 600          /* Dark CTA variant */

/* Gray combinations */
Gray 900 on Gray 50          /* Body text on light bg */
Gray 800 on Gray 100         /* Headings on light bg */
Gray 700 on Gray 200         /* Secondary text */
```

## Implementation

### CSS Custom Properties
```css
:root {
  /* Primary Colors */
  --elysion-primary-50: #eff6ff;
  --elysion-primary-100: #dbeafe;
  --elysion-primary-200: #bfdbfe;
  --elysion-primary-300: #93c5fd;
  --elysion-primary-400: #60a5fa;
  --elysion-primary-500: #3b82f6;
  --elysion-primary-600: #2563eb;
  --elysion-primary-700: #1d4ed8;
  --elysion-primary-800: #0A418E;
  --elysion-primary-900: #1e3a8a;
  --elysion-primary-950: #172554;
  
  /* Add all other colors... */
}
```

### Tailwind CSS Configuration
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'elysion-primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#0A418E',
          900: '#1e3a8a',
          950: '#172554',
        },
        'elysion-secondary': {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae0ff',
          300: '#A8C3E7',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        'elysion-accent': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#E6A857',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        'elysion-bg': {
          50: '#F6F9FD',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      }
    }
  }
}
```

## Color Tokens for Design Tools

### Figma Tokens
```json
{
  "elysion": {
    "primary": {
      "50": { "value": "#eff6ff" },
      "100": { "value": "#dbeafe" },
      "200": { "value": "#bfdbfe" },
      "300": { "value": "#93c5fd" },
      "400": { "value": "#60a5fa" },
      "500": { "value": "#3b82f6" },
      "600": { "value": "#2563eb" },
      "700": { "value": "#1d4ed8" },
      "800": { "value": "#0A418E" },
      "900": { "value": "#1e3a8a" },
      "950": { "value": "#172554" }
    }
  }
}
```

---

**Note**: This color system provides comprehensive variations for all Elysion brand colors, enabling consistent design implementation across all digital touchpoints while maintaining accessibility standards.