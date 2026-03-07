# Elysion - Complete Design System Documentation

**Version**: 2.0 Final  
**Date**: Décembre 2024  
**Platform**: Smart Retirement Planning Web Application  
**Tech Stack**: React + FastAPI + MongoDB  

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Button Components](#4-button-components)
5. [Form Components & Cards](#5-form-components--cards)
   - 5.1 [Cards](#51-cards)
   - 5.2 [Text Input Fields](#52-text-input-fields)
   - 5.3 [Textarea](#53-textarea)
   - 5.4 [Select / Dropdown](#54-select--dropdown)
   - 5.5 [Date Input](#55-date-input)
   - 5.6 [Checkbox](#56-checkbox)
   - 5.7 [Radio Button](#57-radio-button)
   - 5.8 [Form Labels & Helper Text](#58-form-labels--helper-text)
   - 5.9 [Form Field Container](#59-form-field-container)
   - 5.10 [Switch / Toggle](#510-switch--toggle)
   - 5.11 [File Upload](#511-file-upload)
6. [Layout & Spacing](#6-layout--spacing)
7. [Navigation Components](#7-navigation-components)
8. [Modals & Overlays](#8-modals--overlays)
9. [Alerts & Notifications](#9-alerts--notifications)
10. [Tables & Lists](#10-tables--lists)
11. [Iconography](#11-iconography)
12. [Animation & Interactions](#12-animation--interactions)
13. [Shadows & Elevation](#13-shadows--elevation)
14. [Border Radius](#14-border-radius)
15. [Accessibility Standards](#15-accessibility-standards)
16. [Implementation Guide](#16-implementation-guide)

---

# 1. Brand Identity

## Core Values
- **Trust**: Financial security and reliability
- **Clarity**: Simple, understandable retirement planning
- **Guidance**: Expert advice and personalized recommendations
- **Serenity**: Peace of mind about the future

## Visual Principles
- **Minimalist**: Clean, uncluttered interfaces
- **Professional**: Bank-level trust and credibility
- **Accessible**: Inclusive design for all users
- **Human**: Warm, approachable tone despite professionalism

## Logo Usage
```
Primary Logo: "Elysion" in Montserrat Bold
Color: elysion-primary-500 (#0A418E)
Minimum Size: 120px width
Clear Space: 2x logo height on all sides
```

---

# 2. Color System

## 2.1 Primary Palette

### Primary Blue - Trust & Stability
**Main Brand Color: #0A418E (500 level)**

| Variant | Hex | Usage |
|---------|-----|-------|
| 50 | `#deebfd` | Very light backgrounds, cards |
| 100 | `#bcd6fa` | Light highlights, hover states |
| 200 | `#7aadf6` | Subtle accents, borders |
| 300 | `#3784f1` | Disabled states, placeholders |
| 400 | `#0f60d2` | Interactive elements |
| **500** | **`#0a418e`** | **🎯 MAIN BRAND COLOR** |
| 600 | `#083472` | Button hover states |
| 700 | `#062756` | Button active states |
| 800 | `#041a39` | Dark text, headers |
| 900 | `#020d1d` | Darker elements |
| 950 | `#01070e` | Darkest elements |

```css
--elysion-primary-50: #deebfd;
--elysion-primary-100: #bcd6fa;
--elysion-primary-200: #7aadf6;
--elysion-primary-300: #3784f1;
--elysion-primary-400: #0f60d2;
--elysion-primary-500: #0a418e;
--elysion-primary-600: #083472;
--elysion-primary-700: #062756;
--elysion-primary-800: #041a39;
--elysion-primary-900: #020d1d;
--elysion-primary-950: #01070e;
```

### Secondary Light Blue - Calm & Accessibility
**Supporting Color: #A8C3E7 (500 level)**

| Variant | Hex | Usage |
|---------|-----|-------|
| 50 | `#f7f9fd` | Very light backgrounds |
| 100 | `#f0f4fa` | Light backgrounds |
| 200 | `#dce6f5` | Subtle accents |
| 300 | `#cddbf1` | Light borders |
| 400 | `#b9ceeb` | Interactive elements |
| **500** | **`#a8c3e7`** | **🎯 MAIN SECONDARY** |
| 600 | `#689ace` | Hover states |
| 700 | `#4d729b` | Active states |
| 800 | `#314b67` | Dark elements |
| 900 | `#19293a` | Darker elements |
| 950 | `#0d1824` | Darkest elements |

```css
--elysion-secondary-50: #f7f9fd;
--elysion-secondary-100: #f0f4fa;
--elysion-secondary-200: #dce6f5;
--elysion-secondary-300: #cddbf1;
--elysion-secondary-400: #b9ceeb;
--elysion-secondary-500: #a8c3e7;
--elysion-secondary-600: #689ace;
--elysion-secondary-700: #4d729b;
--elysion-secondary-800: #314b67;
--elysion-secondary-900: #19293a;
--elysion-secondary-950: #0d1824;
```

### Accent Orange - CTAs & Highlights
**Action Color: #FBB03B (500 level)**

| Variant | Hex | Usage |
|---------|-----|-------|
| 50 | `#faf8f4` | Light warning backgrounds |
| 100 | `#f6f1ea` | Subtle highlights |
| 200 | `#f1e2cb` | Light accents |
| 300 | `#f1cc93` | Warning states |
| 400 | `#fbb241` | Interactive orange |
| **500** | **`#fbb03b`** | **🎯 MAIN ACCENT/CTA** |
| 600 | `#fa9c09` | CTA hover states |
| 700 | `#d68404` | CTA active states |
| 800 | `#b16c00` | Dark orange text |
| 900 | `#935900` | Darker orange |
| 950 | `#744700` | Darkest orange |

```css
--elysion-accent-50: #faf8f4;
--elysion-accent-100: #f6f1ea;
--elysion-accent-200: #f1e2cb;
--elysion-accent-300: #f1cc93;
--elysion-accent-400: #fbb241;
--elysion-accent-500: #fbb03b;
--elysion-accent-600: #fa9c09;
--elysion-accent-700: #d68404;
--elysion-accent-800: #b16c00;
--elysion-accent-900: #935900;
--elysion-accent-950: #744700;
```

### Background Light - Clean Foundation
**Base Color: #F6F9FD (50 level)**

```css
--elysion-bg-50: #F6F9FD;  /* Main background */
--elysion-bg-100: #f1f5f9;
--elysion-bg-200: #e2e8f0;
--elysion-bg-300: #cbd5e1;
--elysion-bg-400: #94a3b8;
--elysion-bg-500: #64748b;
--elysion-bg-600: #475569;
--elysion-bg-700: #334155;
--elysion-bg-800: #1e293b;
--elysion-bg-900: #0f172a;
--elysion-bg-950: #020617;
```

## 2.2 Semantic Colors

### Success States
```css
--elysion-success-50: #f0fdf4;
--elysion-success-500: #22c55e;
--elysion-success-600: #16a34a;
--elysion-success-700: #15803d;
```

### Warning States
```css
--elysion-warning-50: #fff7ed;
--elysion-warning-500: #f97316;
--elysion-warning-600: #ea580c;
--elysion-warning-700: #c2410c;
```

### Error States
```css
--elysion-error-50: #fef2f2;
--elysion-error-500: #ef4444;
--elysion-error-600: #dc2626;
--elysion-error-700: #b91c1c;
```

### Neutral Grays
```css
--elysion-gray-50: #f8fafc;
--elysion-gray-100: #f1f5f9;
--elysion-gray-200: #e2e8f0;
--elysion-gray-300: #cbd5e1;
--elysion-gray-400: #94a3b8;
--elysion-gray-500: #64748b;
--elysion-gray-600: #475569;
--elysion-gray-700: #334155;
--elysion-gray-800: #1e293b;
--elysion-gray-900: #0f172a;
--elysion-gray-950: #020617;
```

## 2.3 Classes CSS Disponibles

### Couleurs de fond (Background)

| Classe | Couleur | Usage |
|--------|---------|-------|
| `bg-elysion-primary` | #0A418E | Fond principal bleu |
| `bg-elysion-primary-50` | #deebfd | Fond très clair |
| `bg-elysion-primary-100` | #bcd6fa | Fond clair |
| `bg-elysion-primary-200` | #7aadf6 | Fond moyen clair |
| `bg-elysion-primary-300` | #3784f1 | Fond moyen |
| `bg-elysion-primary-400` | #0f60d2 | Fond moyen foncé |
| `bg-elysion-primary-500` | #0a418e | Fond principal |
| `bg-elysion-primary-600` | #083472 | Fond foncé |
| `bg-elysion-primary-700` | #062756 | Fond très foncé |
| `bg-elysion-primary-800` | #041a39 | Fond sombre |
| `bg-elysion-primary-900` | #020d1d | Fond très sombre |
| `bg-elysion-accent` | #FBB03B | Fond orange accent |
| `bg-elysion-accent-50` | #faf8f4 | Fond orange très clair |
| `bg-elysion-accent-100` | #f6f1ea | Fond orange clair |
| `bg-elysion-accent-500` | #fbb03b | Fond orange principal |
| `bg-elysion-accent-600` | #fa9c09 | Fond orange foncé |
| `bg-elysion-secondary` | #A8C3E7 | Fond bleu secondaire |
| `bg-elysion-secondary-50` | #f7f9fd | Fond secondaire très clair |
| `bg-elysion-secondary-100` | #f0f4fa | Fond secondaire clair |
| `bg-elysion-secondary-500` | #a8c3e7 | Fond secondaire principal |
| `bg-elysion-bg` | #F6F9FD | Fond page |
| `bg-elysion-gray-50` | #f8fafc | Fond gris très clair |
| `bg-elysion-gray-100` | #f1f5f9 | Fond gris clair |
| `bg-elysion-gray-200` | #e2e8f0 | Fond gris moyen |
| `bg-elysion-success-50` | #f0fdf4 | Fond succès clair |
| `bg-elysion-warning-50` | #fff7ed | Fond warning clair |
| `bg-elysion-error-50` | #fef2f2 | Fond erreur clair |

### Couleurs de texte (Text)

| Classe | Couleur | Usage |
|--------|---------|-------|
| `text-elysion-primary` | #0A418E | Texte principal bleu |
| `text-elysion-primary-50` | #deebfd | Texte bleu très clair |
| `text-elysion-primary-100` | #bcd6fa | Texte bleu clair |
| `text-elysion-primary-400` | #0f60d2 | Texte bleu moyen |
| `text-elysion-primary-500` | #0a418e | Texte bleu principal |
| `text-elysion-primary-600` | #083472 | Texte bleu foncé |
| `text-elysion-primary-700` | #062756 | Texte bleu très foncé |
| `text-elysion-primary-800` | #041a39 | Texte bleu sombre |
| `text-elysion-primary-900` | #020d1d | Texte bleu très sombre |
| `text-elysion-accent` | #FBB03B | Texte orange |
| `text-elysion-accent-500` | #fbb03b | Texte orange principal |
| `text-elysion-accent-600` | #fa9c09 | Texte orange foncé |
| `text-elysion-accent-700` | #d68404 | Texte orange très foncé |
| `text-elysion-secondary` | #A8C3E7 | Texte bleu secondaire |
| `text-elysion-secondary-500` | #a8c3e7 | Texte secondaire principal |
| `text-elysion-secondary-600` | #689ace | Texte secondaire foncé |
| `text-elysion-gray-400` | #94a3b8 | Texte gris clair |
| `text-elysion-gray-500` | #64748b | Texte gris moyen |
| `text-elysion-gray-600` | #475569 | Texte gris foncé |
| `text-elysion-gray-700` | #334155 | Texte gris très foncé |
| `text-elysion-gray-800` | #1e293b | Texte gris sombre |
| `text-elysion-gray-900` | #0f172a | Texte très foncé |
| `text-elysion-text-dark` | #1a1a1a | Texte sombre legacy |
| `text-elysion-text-light` | #666666 | Texte clair legacy |
| `text-elysion-success-500` | #22c55e | Texte succès |
| `text-elysion-success-600` | #16a34a | Texte succès foncé |
| `text-elysion-warning-500` | #f97316 | Texte warning |
| `text-elysion-warning-600` | #ea580c | Texte warning foncé |
| `text-elysion-error-500` | #ef4444 | Texte erreur |
| `text-elysion-error-600` | #dc2626 | Texte erreur foncé |

### Couleurs de bordure (Border)

| Classe | Couleur |
|--------|---------|
| `border-elysion-primary` | #0A418E |
| `border-elysion-primary-200` | #7aadf6 |
| `border-elysion-primary-300` | #3784f1 |
| `border-elysion-accent` | #FBB03B |
| `border-elysion-gray-200` | #e2e8f0 |
| `border-elysion-gray-300` | #cbd5e1 |

### Exemples d'utilisation

```jsx
// Fond bleu primaire avec texte blanc
<div className="bg-elysion-primary text-white">
  Fond bleu
</div>

// Fond clair avec texte foncé
<div className="bg-elysion-primary-50 text-elysion-primary-900">
  Fond très clair
</div>

// Fond orange accent
<div className="bg-elysion-accent text-elysion-primary-900">
  Bouton CTA
</div>

// Fond gris avec bordure
<div className="bg-elysion-gray-100 border border-elysion-gray-300">
  Card simple
</div>

// Texte coloré
<p className="text-elysion-primary">Texte bleu primaire</p>
<p className="text-elysion-accent">Texte orange</p>
<p className="text-elysion-gray-500">Texte gris</p>
<p className="text-elysion-success-600">Texte succès</p>
<p className="text-elysion-error-600">Texte erreur</p>
```

## 2.4 Comment modifier une couleur ?

### Option 1 : Utiliser les classes existantes
```jsx
// Avant
<div className="bg-white">

// Après - avec fond bleu clair
<div className="bg-elysion-primary-100">
```

### Option 2 : Utiliser les variables CSS dans un style inline
```jsx
<div style={{ backgroundColor: 'var(--elysion-primary-200)' }}>
  Fond personnalisé
</div>

<p style={{ color: 'var(--elysion-accent-600)' }}>
  Texte personnalisé
</p>
```

### Option 3 : Utiliser Tailwind avec les couleurs standard
```jsx
// Tailwind standard colors are also available
<div className="bg-blue-500 text-white">
<div className="bg-orange-400 text-gray-900">
<div className="bg-gray-100 text-gray-700">
```

### Option 4 : Modifier les variables CSS dans App.css
Pour changer une couleur globalement, modifier la variable dans `:root` :
```css
:root {
  --elysion-primary: #NEW_HEX_COLOR;
}
```

## 2.5 Color Usage Guidelines

### Primary Use Cases
- **Primary 500**: Main brand color, primary buttons, headers
- **Primary 600**: Hover states for primary elements
- **Primary 400**: Active states, interactive elements
- **Primary 200**: Light backgrounds, subtle highlights
- **Primary 100**: Very light backgrounds
- **Primary 50**: Lightest backgrounds, cards

### Accent Use Cases
- **Accent 500**: Main CTA color, important actions
- **Accent 600**: CTA hover states
- **Accent 400**: Secondary CTAs
- **Accent 100**: Light accent backgrounds

### Accessibility - Contrast Ratios
All color combinations meet WCAG 2.1 AA standards (4.5:1 minimum)

**Recommended Combinations:**
```css
/* High contrast combinations */
Primary 900 on Primary 50    /* Excellent contrast */
Primary 800 on Primary 100   /* Excellent contrast */
Primary 700 on Primary 200   /* Very good contrast */
White on Primary 500         /* Main button text */

/* Accent combinations */
Primary 900 on Accent 500    /* CTA text */
White on Accent 600          /* Dark CTA variant */

/* Gray combinations */
Gray 900 on Gray 50          /* Body text on light bg */
Gray 800 on Gray 100         /* Headings on light bg */
```

---

# 3. Typography

## 3.1 Font Stack

**Heading Font**: Montserrat (Google Fonts)  
**Body Font**: Onest (Google Fonts)  
**Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

```html
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Onest:wght@100..900&display=swap');
```

### Usage
- **Montserrat** : Titres (h1-h6), logo, éléments de navigation principaux
- **Onest** : Corps de texte, paragraphes, labels, boutons, inputs

## 3.2 Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions, paragraphs |
| Medium | 500 | Labels, navigation, captions |
| SemiBold | 600 | Buttons, form labels, emphasis |
| Bold | 700 | Headings, titles, section headers |
| ExtraBold | 800 | Hero titles only |

## 3.3 Type Scale

### Display Text
```css
.text-6xl {
  font-size: 3.75rem;      /* 60px */
  line-height: 1;
  font-weight: 700;
  /* Usage: Hero titles only */
}

.text-5xl {
  font-size: 3rem;         /* 48px */
  line-height: 1.1;
  font-weight: 700;
  /* Usage: Page titles, main headings */
}
```

### Headings
```css
.text-4xl {
  font-size: 2.25rem;      /* 36px */
  line-height: 1.2;
  font-weight: 700;
  /* Usage: Section headings */
}

.text-3xl {
  font-size: 1.875rem;     /* 30px */
  line-height: 1.3;
  font-weight: 700;
  /* Usage: Card titles */
}

.text-2xl {
  font-size: 1.5rem;       /* 24px */
  line-height: 1.4;
  font-weight: 600;
  /* Usage: Subsection headings */
}

.text-xl {
  font-size: 1.25rem;      /* 20px */
  line-height: 1.5;
  font-weight: 600;
  /* Usage: Large body text, leads */
}
```

### Body Text
```css
.text-lg {
  font-size: 1.125rem;     /* 18px */
  line-height: 1.6;
  font-weight: 400;
  /* Usage: Large body text */
}

.text-base {
  font-size: 1rem;         /* 16px */
  line-height: 1.6;
  font-weight: 400;
  /* Usage: Default body text */
}

.text-sm {
  font-size: 0.875rem;     /* 14px */
  line-height: 1.5;
  font-weight: 400;
  /* Usage: Small text, captions */
}

.text-xs {
  font-size: 0.75rem;      /* 12px */
  line-height: 1.4;
  font-weight: 400;
  /* Usage: Tiny text, legal */
}
```

---

# 4. Button Components

## 4.1 Button Types & States

Tous les boutons implémentent **4 états** : Default, Hover, Pressed (Active), Disabled

### PRIMARY BUTTON - Main Actions

#### Default State
```css
.btn-primary {
  background-color: var(--elysion-primary-500);  /* #0a418e */
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(10, 65, 142, 0.2);
}
```

#### Hover State
```css
.btn-primary:hover {
  background-color: var(--elysion-primary-600);  /* #0c4ca7 */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 65, 142, 0.3);
}
```

#### Pressed State
```css
.btn-primary:active {
  background-color: var(--elysion-primary-700);  /* #083777 */
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(10, 65, 142, 0.3);
}
```

#### Disabled State
```css
.btn-primary:disabled {
  background-color: var(--elysion-gray-300);
  color: var(--elysion-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}
```

### ACCENT BUTTON - CTAs

#### Default State
```css
.btn-accent {
  background-color: var(--elysion-accent-500);  /* #fbb03b */
  color: var(--elysion-primary-900);
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(251, 176, 59, 0.25);
}
```

#### Hover State
```css
.btn-accent:hover {
  background-color: var(--elysion-accent-600);  /* #fa9c09 */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 176, 59, 0.4);
}
```

#### Pressed State
```css
.btn-accent:active {
  background-color: var(--elysion-accent-700);  /* #d68404 */
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(251, 176, 59, 0.3);
}
```

#### Disabled State
```css
.btn-accent:disabled {
  background-color: var(--elysion-gray-300);
  color: var(--elysion-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}
```

### OUTLINE BUTTON - Secondary Actions

#### Default State
```css
.btn-outline {
  background-color: transparent;
  color: var(--elysion-primary-500);
  border: 2px solid var(--elysion-primary-500);
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

#### Hover State
```css
.btn-outline:hover {
  background-color: var(--elysion-primary-50);
  color: var(--elysion-primary-600);
  border-color: var(--elysion-primary-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(10, 65, 142, 0.15);
}
```

#### Pressed State
```css
.btn-outline:active {
  background-color: var(--elysion-primary-100);
  color: var(--elysion-primary-700);
  border-color: var(--elysion-primary-700);
  transform: translateY(0);
  box-shadow: none;
}
```

#### Disabled State
```css
.btn-outline:disabled {
  background-color: transparent;
  color: var(--elysion-gray-400);
  border-color: var(--elysion-gray-300);
  cursor: not-allowed;
  opacity: 0.6;
}
```

### GHOST BUTTON - Tertiary Actions

#### Default State
```css
.btn-ghost {
  background-color: transparent;
  color: var(--elysion-primary-500);
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

#### Hover State
```css
.btn-ghost:hover {
  background-color: var(--elysion-primary-50);
  color: var(--elysion-primary-600);
}
```

#### Pressed State
```css
.btn-ghost:active {
  background-color: var(--elysion-primary-100);
  color: var(--elysion-primary-700);
}
```

#### Disabled State
```css
.btn-ghost:disabled {
  background-color: transparent;
  color: var(--elysion-gray-400);
  cursor: not-allowed;
  opacity: 0.5;
}
```

### DANGER BUTTON - Destructive Actions

#### States
```css
/* Default */
.btn-danger {
  background-color: var(--elysion-error-500);
  color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.25);
}

/* Hover */
.btn-danger:hover {
  background-color: var(--elysion-error-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}

/* Pressed */
.btn-danger:active {
  background-color: var(--elysion-error-700);
  transform: translateY(0);
}

/* Disabled */
.btn-danger:disabled {
  background-color: var(--elysion-gray-300);
  color: var(--elysion-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
}
```

## 4.2 Button Sizes

```css
/* Small */
.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
}

/* Medium (Default) */
.btn-md {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
}

/* Large */
.btn-lg {
  padding: 16px 32px;
  font-size: 18px;
  border-radius: 10px;
}
```

## 4.3 Button Usage Guidelines

| Button Type | Usage |
|-------------|-------|
| **Primary** | Main actions (login, save, submit) - One per section |
| **Accent** | Critical CTAs (create account, start simulation) - Max 1-2 per page |
| **Outline** | Secondary actions, alternatives to primary |
| **Ghost** | Tertiary actions, light navigation, styled links |
| **Secondary** | Alternative important actions, intermediate steps |
| **Danger** | Deletions, irreversible actions, critical confirmations |

## 4.4 Accessibility

```css
/* Focus State (Keyboard Navigation) */
.btn-primary:focus-visible,
.btn-accent:focus-visible,
.btn-outline:focus-visible {
  outline: 3px solid var(--elysion-accent-400);
  outline-offset: 2px;
}

/* Loading State */
.btn-loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

**Requirements:**
- Minimum contrast ratio: 4.5:1
- Touch target size: 44x44px minimum
- Visible focus indicator for keyboard navigation

---

# 5. Form Components & Cards

## 5.1 Cards

Les cartes sont des conteneurs visuels pour regrouper du contenu.

### Default Card

#### Default State
```css
.card-elysion {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid var(--elysion-gray-200);
}
```

#### Hover State
```css
.card-elysion:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
  border-color: var(--elysion-primary-200);
}
```

#### Active/Pressed State
```css
.card-elysion:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

#### Disabled State
```css
.card-elysion.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--elysion-gray-50);
  pointer-events: none;
}
```

### Card Variants

#### Elevated Card
```css
.card-elevated {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  border: none;
}

.card-elevated:hover {
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
}
```

#### Outlined Card
```css
.card-outlined {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid var(--elysion-gray-300);
  box-shadow: none;
}

.card-outlined:hover {
  border-color: var(--elysion-primary-500);
  box-shadow: 0 0 0 1px var(--elysion-primary-500);
}
```

#### Interactive Card (Clickable)
```css
.card-interactive {
  cursor: pointer;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid var(--elysion-gray-200);
  transition: all 0.2s ease;
}

.card-interactive:hover {
  border-color: var(--elysion-primary-500);
  background-color: var(--elysion-primary-50);
  transform: translateY(-2px);
}

.card-interactive:active {
  transform: scale(0.98);
}

.card-interactive.selected {
  border-color: var(--elysion-primary-500);
  background-color: var(--elysion-primary-50);
  box-shadow: 0 0 0 2px var(--elysion-primary-500);
}
```

### Card Sizes

```css
.card-sm {
  padding: 16px;
  border-radius: 12px;
}

.card-md {
  padding: 24px;
  border-radius: 16px;
}

.card-lg {
  padding: 32px;
  border-radius: 20px;
}
```

### Card with Header

```html
<div class="card-elysion">
  <div class="card-header">
    <h3 class="card-title">Titre de la carte</h3>
    <p class="card-subtitle">Sous-titre optionnel</p>
  </div>
  <div class="card-body">
    Contenu principal
  </div>
  <div class="card-footer">
    Actions ou informations supplémentaires
  </div>
</div>
```

```css
.card-header {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--elysion-gray-200);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--elysion-gray-900);
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 14px;
  color: var(--elysion-gray-600);
}

.card-body {
  margin-bottom: 16px;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--elysion-gray-200);
}
```

---

## 5.2 Text Input Fields

### Default Text Input

#### Default State
```css
.input-text {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--elysion-gray-300);
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  color: var(--elysion-gray-900);
  background-color: #FFFFFF;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.input-text::placeholder {
  color: var(--elysion-gray-400);
  font-weight: 400;
}
```

#### Hover State
```css
.input-text:hover:not(:disabled) {
  border-color: var(--elysion-gray-400);
}
```

#### Focus State
```css
.input-text:focus {
  outline: none;
  border-color: var(--elysion-primary-500);
  box-shadow: 0 0 0 3px rgba(10, 65, 142, 0.1);
}
```

#### Disabled State
```css
.input-text:disabled {
  background-color: var(--elysion-gray-100);
  border-color: var(--elysion-gray-200);
  color: var(--elysion-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
}
```

#### Error State
```css
.input-text.error {
  border-color: var(--elysion-error-500);
  background-color: var(--elysion-error-50);
}

.input-text.error:focus {
  border-color: var(--elysion-error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

#### Success State
```css
.input-text.success {
  border-color: var(--elysion-success-500);
  background-color: var(--elysion-success-50);
}

.input-text.success:focus {
  border-color: var(--elysion-success-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}
```

### Input Sizes

```css
.input-sm {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
}

.input-md {
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 8px;
}

.input-lg {
  padding: 16px 20px;
  font-size: 18px;
  border-radius: 10px;
}
```

### Input with Icon

```css
.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding-left: 44px;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--elysion-gray-400);
  pointer-events: none;
}

.input-with-icon input:focus ~ .input-icon {
  color: var(--elysion-primary-500);
}
```

---

## 5.3 Textarea

### Default Textarea

#### Default State
```css
.textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border: 2px solid var(--elysion-gray-300);
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  color: var(--elysion-gray-900);
  background-color: #FFFFFF;
  transition: all 0.2s ease;
  line-height: 1.6;
  resize: vertical;
}

.textarea::placeholder {
  color: var(--elysion-gray-400);
}
```

#### Hover State
```css
.textarea:hover:not(:disabled) {
  border-color: var(--elysion-gray-400);
}
```

#### Focus State
```css
.textarea:focus {
  outline: none;
  border-color: var(--elysion-primary-500);
  box-shadow: 0 0 0 3px rgba(10, 65, 142, 0.1);
}
```

#### Disabled State
```css
.textarea:disabled {
  background-color: var(--elysion-gray-100);
  border-color: var(--elysion-gray-200);
  color: var(--elysion-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
  resize: none;
}
```

#### Error State
```css
.textarea.error {
  border-color: var(--elysion-error-500);
  background-color: var(--elysion-error-50);
}

.textarea.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

---

## 5.4 Select / Dropdown

### Default Select

#### Default State
```css
.select {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 2px solid var(--elysion-gray-300);
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  color: var(--elysion-gray-900);
  background-color: #FFFFFF;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 12px;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
```

#### Hover State
```css
.select:hover:not(:disabled) {
  border-color: var(--elysion-gray-400);
}
```

#### Focus State
```css
.select:focus {
  outline: none;
  border-color: var(--elysion-primary-500);
  box-shadow: 0 0 0 3px rgba(10, 65, 142, 0.1);
}
```

#### Disabled State
```css
.select:disabled {
  background-color: var(--elysion-gray-100);
  border-color: var(--elysion-gray-200);
  color: var(--elysion-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
}
```

#### Error State
```css
.select.error {
  border-color: var(--elysion-error-500);
  background-color: var(--elysion-error-50);
}
```

### Custom Dropdown (Advanced)

```css
.dropdown {
  position: relative;
  width: 100%;
}

.dropdown-trigger {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 2px solid var(--elysion-gray-300);
  border-radius: 8px;
  font-size: 16px;
  background-color: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-trigger:hover {
  border-color: var(--elysion-gray-400);
}

.dropdown-trigger.open {
  border-color: var(--elysion-primary-500);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border: 2px solid var(--elysion-primary-500);
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
}

.dropdown-menu.open {
  display: block;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 16px;
  color: var(--elysion-gray-900);
}

.dropdown-item:hover {
  background-color: var(--elysion-primary-50);
}

.dropdown-item.selected {
  background-color: var(--elysion-primary-100);
  color: var(--elysion-primary-700);
  font-weight: 600;
}

.dropdown-item:active {
  background-color: var(--elysion-primary-200);
}
```

---

## 5.5 Date Input

### Default Date Input

#### Default State
```css
.input-date {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--elysion-gray-300);
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  color: var(--elysion-gray-900);
  background-color: #FFFFFF;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* Custom calendar icon */
.input-date::-webkit-calendar-picker-indicator {
  cursor: pointer;
  color: var(--elysion-primary-500);
  opacity: 0.7;
}

.input-date::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
```

#### Hover State
```css
.input-date:hover:not(:disabled) {
  border-color: var(--elysion-gray-400);
}
```

#### Focus State
```css
.input-date:focus {
  outline: none;
  border-color: var(--elysion-primary-500);
  box-shadow: 0 0 0 3px rgba(10, 65, 142, 0.1);
}
```

#### Disabled State
```css
.input-date:disabled {
  background-color: var(--elysion-gray-100);
  border-color: var(--elysion-gray-200);
  color: var(--elysion-gray-500);
  cursor: not-allowed;
  opacity: 0.6;
}
```

#### Error State
```css
.input-date.error {
  border-color: var(--elysion-error-500);
  background-color: var(--elysion-error-50);
}
```

---

## 5.6 Checkbox

### Default Checkbox

#### Structure
```html
<label class="checkbox-wrapper">
  <input type="checkbox" class="checkbox-input">
  <span class="checkbox-custom"></span>
  <span class="checkbox-label">Label du checkbox</span>
</label>
```

#### Default State
```css
.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 12px;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: relative;
  height: 20px;
  width: 20px;
  border: 2px solid var(--elysion-gray-400);
  border-radius: 4px;
  background-color: #FFFFFF;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-label {
  font-size: 16px;
  color: var(--elysion-gray-900);
  font-weight: 400;
}
```

#### Hover State
```css
.checkbox-wrapper:hover .checkbox-custom {
  border-color: var(--elysion-primary-500);
}
```

#### Checked State
```css
.checkbox-input:checked ~ .checkbox-custom {
  background-color: var(--elysion-primary-500);
  border-color: var(--elysion-primary-500);
}

.checkbox-input:checked ~ .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
```

#### Focus State
```css
.checkbox-input:focus ~ .checkbox-custom {
  outline: 3px solid rgba(10, 65, 142, 0.2);
  outline-offset: 2px;
}
```

#### Disabled State
```css
.checkbox-input:disabled ~ .checkbox-custom {
  background-color: var(--elysion-gray-100);
  border-color: var(--elysion-gray-300);
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-input:disabled ~ .checkbox-label {
  color: var(--elysion-gray-500);
  cursor: not-allowed;
}

.checkbox-wrapper.disabled {
  cursor: not-allowed;
}
```

#### Error State
```css
.checkbox-custom.error {
  border-color: var(--elysion-error-500);
}
```

### Checkbox Sizes

```css
/* Small */
.checkbox-sm .checkbox-custom {
  height: 16px;
  width: 16px;
}

.checkbox-sm .checkbox-label {
  font-size: 14px;
}

/* Large */
.checkbox-lg .checkbox-custom {
  height: 24px;
  width: 24px;
}

.checkbox-lg .checkbox-label {
  font-size: 18px;
}
```

---

## 5.7 Radio Button

### Default Radio Button

#### Structure
```html
<label class="radio-wrapper">
  <input type="radio" name="group" class="radio-input">
  <span class="radio-custom"></span>
  <span class="radio-label">Label du radio</span>
</label>
```

#### Default State
```css
.radio-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 12px;
}

.radio-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.radio-custom {
  position: relative;
  height: 20px;
  width: 20px;
  border: 2px solid var(--elysion-gray-400);
  border-radius: 50%;
  background-color: #FFFFFF;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.radio-label {
  font-size: 16px;
  color: var(--elysion-gray-900);
  font-weight: 400;
}
```

#### Hover State
```css
.radio-wrapper:hover .radio-custom {
  border-color: var(--elysion-primary-500);
}
```

#### Checked State
```css
.radio-input:checked ~ .radio-custom {
  border-color: var(--elysion-primary-500);
  background-color: #FFFFFF;
}

.radio-input:checked ~ .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--elysion-primary-500);
}
```

#### Focus State
```css
.radio-input:focus ~ .radio-custom {
  outline: 3px solid rgba(10, 65, 142, 0.2);
  outline-offset: 2px;
}
```

#### Disabled State
```css
.radio-input:disabled ~ .radio-custom {
  background-color: var(--elysion-gray-100);
  border-color: var(--elysion-gray-300);
  cursor: not-allowed;
  opacity: 0.6;
}

.radio-input:disabled ~ .radio-label {
  color: var(--elysion-gray-500);
  cursor: not-allowed;
}

.radio-wrapper.disabled {
  cursor: not-allowed;
}
```

#### Error State
```css
.radio-custom.error {
  border-color: var(--elysion-error-500);
}
```

### Radio Button Sizes

```css
/* Small */
.radio-sm .radio-custom {
  height: 16px;
  width: 16px;
}

.radio-sm .radio-custom::after {
  width: 8px;
  height: 8px;
}

.radio-sm .radio-label {
  font-size: 14px;
}

/* Large */
.radio-lg .radio-custom {
  height: 24px;
  width: 24px;
}

.radio-lg .radio-custom::after {
  width: 12px;
  height: 12px;
}

.radio-lg .radio-label {
  font-size: 18px;
}
```

---

## 5.8 Form Labels & Helper Text

### Labels
```css
.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--elysion-gray-700);
  margin-bottom: 8px;
  font-family: 'Montserrat', sans-serif;
}

.label.required::after {
  content: ' *';
  color: var(--elysion-error-500);
}
```

### Helper Text
```css
.helper-text {
  display: block;
  font-size: 14px;
  color: var(--elysion-gray-600);
  margin-top: 6px;
  line-height: 1.4;
}
```

### Error Message
```css
.error-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--elysion-error-600);
  margin-top: 6px;
  font-weight: 500;
}

.error-text::before {
  content: '⚠';
  font-size: 16px;
}
```

### Success Message
```css
.success-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--elysion-success-600);
  margin-top: 6px;
  font-weight: 500;
}

.success-text::before {
  content: '✓';
  font-size: 16px;
}
```

---

## 5.9 Form Field Container

```css
.form-field {
  margin-bottom: 24px;
}

.form-field-inline {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.form-field-inline > * {
  flex: 1;
}
```

### Complete Form Example

```html
<div class="form-field">
  <label for="email" class="label required">Adresse email</label>
  <input 
    type="email" 
    id="email" 
    class="input-text" 
    placeholder="votre@email.com"
  >
  <span class="helper-text">Nous ne partagerons jamais votre email</span>
</div>

<div class="form-field">
  <label for="message" class="label">Message</label>
  <textarea 
    id="message" 
    class="textarea" 
    placeholder="Votre message..."
  ></textarea>
</div>

<div class="form-field">
  <label class="checkbox-wrapper">
    <input type="checkbox" class="checkbox-input">
    <span class="checkbox-custom"></span>
    <span class="checkbox-label">J'accepte les conditions</span>
  </label>
</div>
```


---

## 5.10 Switch / Toggle

Un composant switch pour des actions on/off binaires.

### Default Switch

#### Structure
```html
<label class="switch-wrapper">
  <span class="switch-label">Mode sombre</span>
  <input type="checkbox" class="switch-input">
  <span class="switch-slider"></span>
</label>
```

#### Default State (Off)
```css
.switch-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  background-color: var(--elysion-gray-300);
  border-radius: 24px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.switch-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-label {
  font-size: 16px;
  color: var(--elysion-gray-900);
  font-weight: 400;
}
```

#### Hover State
```css
.switch-wrapper:hover .switch-slider {
  background-color: var(--elysion-gray-400);
}
```

#### Checked State (On)
```css
.switch-input:checked ~ .switch-slider {
  background-color: var(--elysion-primary-500);
}

.switch-input:checked ~ .switch-slider::before {
  transform: translateX(24px);
}
```

#### Focus State
```css
.switch-input:focus ~ .switch-slider {
  outline: 3px solid rgba(10, 65, 142, 0.2);
  outline-offset: 2px;
}
```

#### Disabled State
```css
.switch-input:disabled ~ .switch-slider {
  background-color: var(--elysion-gray-200);
  cursor: not-allowed;
  opacity: 0.5;
}

.switch-input:disabled ~ .switch-slider::before {
  background-color: var(--elysion-gray-400);
}

.switch-input:disabled ~ .switch-label {
  color: var(--elysion-gray-500);
  cursor: not-allowed;
}

.switch-wrapper.disabled {
  cursor: not-allowed;
}
```

### Switch Sizes

```css
/* Small Switch */
.switch-sm .switch-slider {
  width: 36px;
  height: 20px;
  border-radius: 20px;
}

.switch-sm .switch-slider::before {
  height: 14px;
  width: 14px;
  left: 3px;
  top: 3px;
}

.switch-sm .switch-input:checked ~ .switch-slider::before {
  transform: translateX(16px);
}

/* Large Switch */
.switch-lg .switch-slider {
  width: 56px;
  height: 28px;
  border-radius: 28px;
}

.switch-lg .switch-slider::before {
  height: 22px;
  width: 22px;
  left: 3px;
  top: 3px;
}

.switch-lg .switch-input:checked ~ .switch-slider::before {
  transform: translateX(28px);
}
```

### Switch with Icons

```css
.switch-slider-with-icons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
}

.switch-slider-with-icons::after,
.switch-slider-with-icons::before {
  font-size: 12px;
  z-index: 1;
}

/* Icons for on/off states */
.switch-input:not(:checked) ~ .switch-slider-with-icons::before {
  content: '✕';
  color: var(--elysion-gray-600);
}

.switch-input:checked ~ .switch-slider-with-icons::after {
  content: '✓';
  color: white;
}
```

---

## 5.11 File Upload

Composant pour l'upload de fichiers avec drag & drop.

### Default File Upload

#### Structure
```html
<div class="file-upload-wrapper">
  <input type="file" id="file-upload" class="file-input">
  <label for="file-upload" class="file-upload-area">
    <div class="file-upload-icon">📤</div>
    <div class="file-upload-text">
      <span class="file-upload-title">Glissez-déposez votre fichier ici</span>
      <span class="file-upload-subtitle">ou cliquez pour sélectionner</span>
    </div>
  </label>
</div>
```

#### Default State
```css
.file-upload-wrapper {
  width: 100%;
}

.file-input {
  display: none;
}

.file-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  border: 2px dashed var(--elysion-gray-300);
  border-radius: 12px;
  background-color: var(--elysion-bg-50);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.file-upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.file-upload-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-upload-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--elysion-gray-900);
}

.file-upload-subtitle {
  font-size: 14px;
  color: var(--elysion-gray-600);
}
```

#### Hover State
```css
.file-upload-area:hover {
  border-color: var(--elysion-primary-500);
  background-color: var(--elysion-primary-50);
}

.file-upload-area:hover .file-upload-icon {
  opacity: 1;
  transform: translateY(-4px);
}
```

#### Drag Over State
```css
.file-upload-area.drag-over {
  border-color: var(--elysion-primary-500);
  background-color: var(--elysion-primary-100);
  border-style: solid;
}

.file-upload-area.drag-over .file-upload-icon {
  transform: scale(1.1);
}
```

#### Disabled State
```css
.file-upload-area.disabled {
  background-color: var(--elysion-gray-100);
  border-color: var(--elysion-gray-200);
  cursor: not-allowed;
  opacity: 0.6;
}

.file-upload-area.disabled .file-upload-title,
.file-upload-area.disabled .file-upload-subtitle {
  color: var(--elysion-gray-500);
}
```

#### Error State
```css
.file-upload-area.error {
  border-color: var(--elysion-error-500);
  background-color: var(--elysion-error-50);
}
```

### File Upload with Selected File

```css
.file-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--elysion-primary-50);
  border: 2px solid var(--elysion-primary-200);
  border-radius: 8px;
  margin-top: 16px;
}

.file-selected-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-selected-icon {
  font-size: 24px;
}

.file-selected-details {
  flex: 1;
  min-width: 0;
}

.file-selected-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--elysion-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-selected-size {
  font-size: 14px;
  color: var(--elysion-gray-600);
}

.file-selected-remove {
  padding: 8px;
  color: var(--elysion-error-500);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.file-selected-remove:hover {
  background-color: var(--elysion-error-100);
}
```

### File Upload Progress

```css
.file-upload-progress {
  margin-top: 16px;
}

.file-upload-progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--elysion-gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.file-upload-progress-fill {
  height: 100%;
  background-color: var(--elysion-primary-500);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.file-upload-progress-text {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: var(--elysion-gray-600);
}
```

### Multiple Files Upload

```css
.file-upload-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.file-upload-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid var(--elysion-gray-200);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.file-upload-item:hover {
  border-color: var(--elysion-primary-300);
  background-color: var(--elysion-primary-50);
}

.file-upload-item-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-upload-item-icon {
  font-size: 20px;
}

.file-upload-item-details {
  flex: 1;
  min-width: 0;
}

.file-upload-item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--elysion-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-upload-item-meta {
  font-size: 12px;
  color: var(--elysion-gray-600);
  margin-top: 2px;
}

.file-upload-item-actions {
  display: flex;
  gap: 8px;
}

.file-upload-item-action {
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.file-upload-item-action:hover {
  background-color: var(--elysion-gray-100);
}
```


---

# 7. Navigation Components

## 7.1 Top Navigation Bar

### Default Navbar

```css
.navbar {
  width: 100%;
  background-color: #FFFFFF;
  border-bottom: 1px solid var(--elysion-gray-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.navbar-brand {
  font-size: 24px;
  font-weight: 700;
  color: var(--elysion-primary-500);
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar-brand:hover {
  color: var(--elysion-accent-500);
}

.navbar-menu {
  display: flex;
  gap: 32px;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar-item {
  position: relative;
}

.navbar-link {
  font-size: 16px;
  font-weight: 500;
  color: var(--elysion-gray-700);
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 8px 0;
  display: inline-block;
}

.navbar-link:hover {
  color: var(--elysion-primary-500);
}

.navbar-link.active {
  color: var(--elysion-primary-500);
  position: relative;
}

.navbar-link.active::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--elysion-primary-500);
}

.navbar-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}
```

## 7.2 Breadcrumbs

```css
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-link {
  color: var(--elysion-gray-600);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--elysion-primary-500);
}

.breadcrumb-separator {
  color: var(--elysion-gray-400);
  user-select: none;
}

.breadcrumb-current {
  color: var(--elysion-gray-900);
  font-weight: 600;
}
```

## 7.3 Tabs

### Default Tabs

```css
.tabs {
  border-bottom: 2px solid var(--elysion-gray-200);
  display: flex;
  gap: 4px;
}

.tab {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: var(--elysion-gray-600);
  background-color: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  bottom: -2px;
}

.tab:hover {
  color: var(--elysion-primary-500);
  background-color: var(--elysion-primary-50);
}

.tab.active {
  color: var(--elysion-primary-500);
  border-bottom-color: var(--elysion-primary-500);
  font-weight: 600;
}

.tab:disabled {
  color: var(--elysion-gray-400);
  cursor: not-allowed;
  opacity: 0.5;
}

.tab-content {
  padding: 24px 0;
}
```

### Pill Tabs

```css
.tabs-pill {
  display: flex;
  gap: 8px;
  padding: 4px;
  background-color: var(--elysion-gray-100);
  border-radius: 10px;
  width: fit-content;
}

.tab-pill {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--elysion-gray-700);
  background-color: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-pill:hover {
  background-color: var(--elysion-gray-200);
}

.tab-pill.active {
  background-color: #FFFFFF;
  color: var(--elysion-primary-500);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## 7.4 Pagination

```css
.pagination {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
}

.pagination-button {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--elysion-gray-300);
  background-color: #FFFFFF;
  color: var(--elysion-gray-700);
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  border-color: var(--elysion-primary-500);
  color: var(--elysion-primary-500);
  background-color: var(--elysion-primary-50);
}

.pagination-button.active {
  background-color: var(--elysion-primary-500);
  color: #FFFFFF;
  border-color: var(--elysion-primary-500);
  font-weight: 600;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: var(--elysion-gray-400);
}

.pagination-ellipsis {
  color: var(--elysion-gray-500);
  padding: 0 8px;
}
```

---

# 8. Modals & Overlays

## 8.1 Modal

### Modal Structure

```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Titre du modal</h2>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      Contenu du modal
    </div>
    <div class="modal-footer">
      <button class="btn-outline">Annuler</button>
      <button class="btn-primary">Confirmer</button>
    </div>
  </div>
</div>
```

### Modal Styles

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

.modal {
  background-color: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--elysion-gray-200);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--elysion-gray-900);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: var(--elysion-gray-600);
  font-size: 24px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: var(--elysion-gray-100);
  color: var(--elysion-gray-900);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid var(--elysion-gray-200);
}
```

### Modal Sizes

```css
.modal-sm {
  max-width: 400px;
}

.modal-md {
  max-width: 600px;
}

.modal-lg {
  max-width: 800px;
}

.modal-xl {
  max-width: 1200px;
}

.modal-full {
  max-width: calc(100% - 32px);
  height: calc(100% - 32px);
}
```

## 8.2 Drawer / Sidebar

```css
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  animation: fadeIn 0.2s ease;
}

.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: #FFFFFF;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.drawer.open {
  transform: translateX(0);
}

.drawer-right {
  right: 0;
  animation: slideInRight 0.3s ease;
}

.drawer-left {
  left: 0;
  transform: translateX(-100%);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  animation: slideInLeft 0.3s ease;
}

.drawer-left.open {
  transform: translateX(0);
}

.drawer-header {
  padding: 24px;
  border-bottom: 1px solid var(--elysion-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--elysion-gray-900);
}

.drawer-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: var(--elysion-gray-600);
  font-size: 20px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.drawer-close:hover {
  background-color: var(--elysion-gray-100);
}

.drawer-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.drawer-footer {
  padding: 24px;
  border-top: 1px solid var(--elysion-gray-200);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
```

## 8.3 Tooltip

```css
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: 8px 12px;
  background-color: var(--elysion-gray-900);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10000;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--elysion-gray-900);
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
}

/* Tooltip positions */
.tooltip-top {
  bottom: 100%;
  margin-bottom: 8px;
}

.tooltip-bottom {
  top: 100%;
  bottom: auto;
  margin-top: 8px;
  transform: translateX(-50%) translateY(0);
}

.tooltip-bottom::after {
  top: auto;
  bottom: 100%;
  border-top-color: transparent;
  border-bottom-color: var(--elysion-gray-900);
}

.tooltip-left {
  left: auto;
  right: 100%;
  top: 50%;
  bottom: auto;
  margin-right: 8px;
  transform: translateY(-50%);
}

.tooltip-right {
  left: 100%;
  top: 50%;
  bottom: auto;
  margin-left: 8px;
  transform: translateY(-50%);
}
```

---

# 9. Alerts & Notifications

## 9.1 Alert Messages

### Alert Structure

```html
<div class="alert alert-info">
  <div class="alert-icon">ℹ️</div>
  <div class="alert-content">
    <div class="alert-title">Information</div>
    <div class="alert-message">Ceci est un message d'information.</div>
  </div>
  <button class="alert-close">✕</button>
</div>
```

### Alert Base Styles

```css
.alert {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid;
  margin-bottom: 16px;
  animation: slideDown 0.3s ease;
}

.alert-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.alert-message {
  font-size: 14px;
  line-height: 1.5;
}

.alert-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}
```

### Alert Variants

```css
/* Success Alert */
.alert-success {
  background-color: var(--elysion-success-50);
  border-color: var(--elysion-success-200);
  color: var(--elysion-success-800);
}

.alert-success .alert-close:hover {
  background-color: var(--elysion-success-100);
}

/* Error Alert */
.alert-error {
  background-color: var(--elysion-error-50);
  border-color: var(--elysion-error-200);
  color: var(--elysion-error-800);
}

.alert-error .alert-close:hover {
  background-color: var(--elysion-error-100);
}

/* Warning Alert */
.alert-warning {
  background-color: var(--elysion-warning-50);
  border-color: var(--elysion-warning-200);
  color: var(--elysion-warning-800);
}

.alert-warning .alert-close:hover {
  background-color: var(--elysion-warning-100);
}

/* Info Alert */
.alert-info {
  background-color: var(--elysion-primary-50);
  border-color: var(--elysion-primary-200);
  color: var(--elysion-primary-800);
}

.alert-info .alert-close:hover {
  background-color: var(--elysion-primary-100);
}
```

## 9.2 Toast Notifications

```css
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  min-width: 300px;
  animation: slideInRight 0.3s ease;
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--elysion-gray-900);
}

.toast-message {
  font-size: 14px;
  color: var(--elysion-gray-700);
  line-height: 1.4;
}

.toast-close {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: var(--elysion-gray-600);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background-color: var(--elysion-gray-100);
}

/* Toast Variants */
.toast-success {
  border-left-color: var(--elysion-success-500);
}

.toast-error {
  border-left-color: var(--elysion-error-500);
}

.toast-warning {
  border-left-color: var(--elysion-warning-500);
}

.toast-info {
  border-left-color: var(--elysion-primary-500);
}
```

## 9.3 Badge / Pill

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  line-height: 1;
}

/* Badge Variants */
.badge-primary {
  background-color: var(--elysion-primary-100);
  color: var(--elysion-primary-700);
}

.badge-success {
  background-color: var(--elysion-success-100);
  color: var(--elysion-success-700);
}

.badge-error {
  background-color: var(--elysion-error-100);
  color: var(--elysion-error-700);
}

.badge-warning {
  background-color: var(--elysion-warning-100);
  color: var(--elysion-warning-700);
}

.badge-gray {
  background-color: var(--elysion-gray-200);
  color: var(--elysion-gray-700);
}

/* Badge with dot */
.badge-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.badge-dot::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}
```

---

# 10. Tables & Lists

## 10.1 Table

```css
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--elysion-gray-200);
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #FFFFFF;
}

.table thead {
  background-color: var(--elysion-gray-50);
  border-bottom: 2px solid var(--elysion-gray-200);
}

.table th {
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--elysion-gray-700);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  padding: 16px;
  font-size: 14px;
  color: var(--elysion-gray-900);
  border-bottom: 1px solid var(--elysion-gray-200);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: var(--elysion-gray-50);
}

/* Striped table */
.table-striped tbody tr:nth-child(even) {
  background-color: var(--elysion-gray-50);
}

.table-striped tbody tr:hover {
  background-color: var(--elysion-primary-50);
}
```

## 10.2 Lists

```css
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--elysion-gray-200);
  transition: background-color 0.2s ease;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: var(--elysion-gray-50);
}

.list-item-icon {
  font-size: 20px;
  color: var(--elysion-gray-600);
  flex-shrink: 0;
}

.list-item-content {
  flex: 1;
}

.list-item-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--elysion-gray-900);
  margin-bottom: 4px;
}

.list-item-subtitle {
  font-size: 14px;
  color: var(--elysion-gray-600);
}

.list-item-action {
  flex-shrink: 0;
}
```

---

# 11. Iconography

## 11.1 Icon Library - Lucide React

Elysion utilise **Lucide React** comme bibliothèque d'icônes principale. Toutes les icônes sont centralisées dans `/src/components/ui/icons.js`.

### Installation
```bash
yarn add lucide-react
```

### Import centralisé
```jsx
import { Icons, getUserTypeIcon, getDocumentCategoryIcon } from './ui/icons';
```

## 11.2 Tailles d'icônes standardisées

| Taille | Valeur | Usage |
|--------|--------|-------|
| `xs` | 14px | Indicateurs, badges |
| `sm` | 16px | Texte inline, boutons compacts |
| `md` | 20px | **Par défaut** - Navigation, formulaires |
| `lg` | 24px | Cartes, headers |
| `xl` | 32px | Sections principales |
| `2xl` | 40px | États vides, héros |
| `3xl` | 48px | Landing page, onboarding |

```jsx
<Icons.Dashboard size={20} />  // Par défaut
<Icons.Target size={24} className="text-elysion-primary" />
```

## 11.3 Icônes de navigation

| Usage | Icône Lucide | Composant |
|-------|--------------|-----------|
| Tableau de bord | `Home` | `<Icons.Dashboard />` |
| Simulateur | `Sparkles` | `<Icons.Simulator />` |
| Documents | `FileText` | `<Icons.Documents />` |
| Investissements | `TrendingUp` | `<Icons.Investment />` |
| Profil/Paramètres | `Settings` | `<Icons.Profile />` |
| Déconnexion | `LogOut` | `<Icons.Logout />` |
| Menu hamburger | `Menu` | `<Icons.Menu />` |
| Fermer | `X` | `<Icons.Close />` |

## 11.4 Icônes par type d'utilisateur

| Type | Icône Lucide | Usage |
|------|--------------|-------|
| Salarié | `Briefcase` | `<Icons.Employee />` |
| Freelance | `Rocket` | `<Icons.Freelancer />` |
| Chef d'entreprise | `Building2` | `<Icons.BusinessOwner />` |
| Utilisateur générique | `User` | `<Icons.User />` |

```jsx
// Helper function
import { getUserTypeIcon } from './ui/icons';
{getUserTypeIcon(user?.user_type, { size: 20, className: "text-elysion-primary" })}
```

## 11.5 Icônes de profil de risque

| Profil | Icône Lucide | Usage |
|--------|--------------|-------|
| Prudent | `Shield` | `<Icons.Prudent />` |
| Équilibré | `Scale` | `<Icons.Balanced />` |
| Dynamique | `Rocket` | `<Icons.Dynamic />` |

```jsx
import { getRiskProfileIcon } from './ui/icons';
{getRiskProfileIcon('prudent', { size: 20 })}
```

## 11.6 Icônes de documents

| Catégorie | Icône Lucide | Usage |
|-----------|--------------|-------|
| Bulletin de salaire | `Receipt` | Documents paie |
| Relevé de carrière | `FileBarChart` | Historique carrière |
| Déclaration fiscale | `BarChart3` | Impôts |
| Contrat retraite | `Landmark` | Banque/Assurance |
| Autre | `FileText` | Par défaut |

```jsx
import { getDocumentCategoryIcon } from './ui/icons';
{getDocumentCategoryIcon('salary_slip', { size: 20 })}
```

## 11.7 Icônes d'actions

| Action | Icône Lucide | Composant |
|--------|--------------|-----------|
| Ajouter | `Plus` | `<Icons.Add />` |
| Modifier | `Edit` | `<Icons.Edit />` |
| Supprimer | `Trash2` | `<Icons.Delete />` |
| Voir | `Eye` | `<Icons.View />` |
| Télécharger | `Download` | `<Icons.Download />` |
| Uploader | `Upload` | `<Icons.Upload />` |
| Rechercher | `Search` | `<Icons.Search />` |
| Filtrer | `Filter` | `<Icons.Filter />` |
| Copier | `Copy` | `<Icons.Copy />` |
| Partager | `Share2` | `<Icons.Share />` |
| Rafraîchir | `RefreshCw` | `<Icons.Refresh />` |

## 11.8 Icônes de statut

| Statut | Icône Lucide | Couleur |
|--------|--------------|---------|
| Succès | `CheckCircle` | `text-green-600` |
| Erreur | `AlertCircle` | `text-red-600` |
| Avertissement | `AlertCircle` | `text-orange-500` |
| Information | `Info` | `text-blue-600` |
| Aide | `HelpCircle` | `text-gray-500` |
| Chargement | `Loader2` | Animation rotate |

## 11.9 Icônes financières

| Usage | Icône Lucide | Composant |
|-------|--------------|-----------|
| Objectif | `Target` | `<Icons.Target />` |
| Épargne | `PiggyBank` | `<Icons.Money />` |
| Portefeuille | `Wallet` | `<Icons.Wallet />` |
| Euro | `Euro` | `<Icons.Euro />` |
| Pourcentage | `Percent` | `<Icons.Percent />` |
| Carte bancaire | `CreditCard` | `<Icons.CreditCard />` |
| Banque | `Landmark` | `<Icons.Bank />` |
| Calculatrice | `Calculator` | `<Icons.Calculator />` |

## 11.10 Bonnes pratiques

### Accessibilité
```jsx
// Icône décorative (lecture d'écran ignorée)
<Icons.Target size={20} aria-hidden="true" />

// Icône avec signification (lecture d'écran)
<Icons.Target size={20} aria-label="Objectif de retraite" />

// Bouton avec icône seule
<button aria-label="Fermer le menu">
  <Icons.Close size={24} aria-hidden="true" />
</button>
```

### Couleurs
```jsx
// Hériter de la couleur du texte parent
<div className="text-elysion-primary">
  <Icons.Target size={20} />
</div>

// Couleur explicite
<Icons.Target size={20} className="text-elysion-accent" />
```

### Animations
```jsx
// Icône de chargement avec rotation
<Icons.Loading size={20} className="animate-spin" />
```

---

# 12. Animation & Interactions

## 12.1 Timing Functions

```css
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 12.2 Standard Animations

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide Down */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Slide In Left */
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Spin (Loading) */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Bounce */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

## 12.3 Transition Durations

```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```

**Usage:**
- **Fast (150ms)**: Hovers, small interactions, color changes
- **Normal (300ms)**: Default, most interactions, transforms
- **Slow (500ms)**: Large movements, page transitions, complex animations

---

# 13. Shadows & Elevation

## 13.1 Shadow Scale

```css
:root {
  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
  
  /* Inner shadow */
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}
```

## 13.2 Shadow Classes

```css
.shadow-xs { box-shadow: var(--shadow-xs); }
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }
.shadow-2xl { box-shadow: var(--shadow-2xl); }
.shadow-inner { box-shadow: var(--shadow-inner); }
.shadow-none { box-shadow: none; }
```

## 13.3 Elevation System

| Level | Usage | Shadow |
|-------|-------|--------|
| 0 | Flat elements | None |
| 1 | Cards, containers | shadow-sm |
| 2 | Raised cards | shadow-md |
| 3 | Dropdowns, popovers | shadow-lg |
| 4 | Modals, dialogs | shadow-xl |
| 5 | Full screen overlays | shadow-2xl |

---

# 14. Border Radius

## 14.1 Border Radius Scale

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 20px;
  --radius-full: 9999px;
}
```

## 14.2 Border Radius Classes

```css
.rounded-none { border-radius: var(--radius-none); }
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-2xl { border-radius: var(--radius-2xl); }
.rounded-3xl { border-radius: var(--radius-3xl); }
.rounded-full { border-radius: var(--radius-full); }
```

## 14.3 Usage Guidelines

| Element | Radius | Example |
|---------|--------|---------|
| Small buttons | sm-md | 4-6px |
| Default buttons | lg | 8px |
| Input fields | lg | 8px |
| Cards | xl-2xl | 12-16px |
| Modals | 2xl | 16px |
| Avatars | full | 9999px |
| Pills/Badges | full | 9999px |



---

# 6. Layout & Spacing

## 6.1 Spacing Scale

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
--spacing-4xl: 96px;
```

## 6.2 Container Widths

```css
.container-sm {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 16px;
}

.container-md {
  max-width: 768px;
  margin: 0 auto;
  padding: 0 16px;
}

.container-lg {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 24px;
}

.container-xl {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
}
```

## 6.3 Grid System

```css
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
```

---

# 7. Iconography

## 7.1 Icon Guidelines

- **Size**: 16px, 20px, 24px, 32px, 48px
- **Stroke Width**: 2px (consistent)
- **Style**: Outlined, rounded corners
- **Color**: Inherits from parent or uses semantic colors

## 7.2 Common Icons

- 📊 Analytics / Dashboard
- 👔 Employee / Professional
- 💻 Freelancer / Digital
- 🏢 Business Owner / Company
- 📈 Growth / Progress
- 💰 Money / Finance
- 🎯 Goal / Target
- ✅ Success / Completed
- ⚠️ Warning / Alert
- ❌ Error / Delete

---

# 8. Animation & Interactions

## 8.1 Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## 8.2 Standard Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spin (Loading) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## 8.3 Transitions

- **Fast**: 150ms - Hovers, small interactions
- **Normal**: 300ms - Default, most interactions
- **Slow**: 500ms - Large movements, page transitions

---

# 9. Accessibility Standards

## 9.1 WCAG 2.1 AA Compliance

### Tableau d'implémentation WCAG

| Critère WCAG | Niveau | Priorité Elysion | Application | Statut |
|--------------|--------|------------------|-------------|--------|
| **1.1.1** — Texte alternatif | A | Critique | Icônes Lucide avec `aria-hidden="true"` sur icônes décoratives | ✅ Implémenté |
| **1.3.1** — Information & relations | A | Critique | Tables avec `<table>`, `<th scope="col">` dans simulateurs | ✅ Implémenté |
| **1.4.3** — Contraste minimum | AA | Critique | Ratio ≥ 4.5:1 texte, ≥ 3:1 texte large (≥18pt) | ✅ Implémenté |
| **1.4.4** — Redimensionnement | AA | Haute | Interface fonctionnelle à 200% zoom | ✅ Implémenté |
| **1.4.11** — Contraste composants | AA | Haute | Bordures inputs, slider : ratio ≥ 3:1 | ✅ Implémenté |
| **2.1.1** — Clavier | A | Critique | Toutes interactions accessibles clavier | ✅ Implémenté |
| **2.4.1** — Lien d'évitement | A | Haute | Skip to content dans DashboardLayout | ✅ Implémenté |
| **2.4.3** — Ordre de focus | A | Critique | Sidebar → Top bar → Contenu principal | ✅ Implémenté |
| **2.4.7** — Focus visible | AA | Critique | `outline: 3px solid var(--elysion-accent-400); outline-offset: 2px` | ✅ Implémenté |
| **3.1.1** — Langue de la page | A | Basse | `<html lang="fr">` | ✅ Implémenté |
| **3.3.1** — Identification erreurs | A | Haute | `aria-describedby` + `aria-invalid` sur formulaires | ✅ Implémenté |
| **4.1.2** — Nom, rôle, valeur | A | Critique | Sélecteur âge : `role="radiogroup/radio"` + `aria-checked`. Sliders : `aria-valuenow/min/max/label` | ✅ Implémenté |
| **4.1.3** — Messages de statut | AA | Haute | `aria-live="polite"` sur résultats simulation | ✅ Implémenté |

### Détails d'implémentation

#### Color Contrast
- Text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- Interactive elements: Minimum 3:1

#### Keyboard Navigation
- All interactive elements accessible via Tab
- Visible focus indicators (`outline: 3px solid var(--elysion-accent-400)`)
- Logical tab order
- Skip to main content link

#### Screen Readers
- Semantic HTML (`<table>`, `<th scope>`, `<main>`, `<nav>`)
- ARIA labels on interactive elements
- `aria-hidden="true"` on decorative icons
- `aria-live="polite"` for dynamic content
- `role="radiogroup"` / `role="radio"` for custom selectors

#### Form Accessibility
- `aria-invalid` for error states
- `aria-describedby` linking fields to error messages
- `role="alert"` on error messages

#### Touch Targets
- Minimum 44x44px
- Adequate spacing between targets

---

# 10. Implementation Guide

## 10.1 CSS Setup

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

:root {
  /* Colors */
  --elysion-primary-500: #0a418e;
  --elysion-accent-500: #fbb03b;
  /* ... all other variables */
  
  /* Spacing */
  --spacing-md: 16px;
  /* ... */
  
  /* Typography */
  --font-family: 'Montserrat', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--elysion-bg-50);
  color: var(--elysion-gray-900);
  line-height: 1.6;
}
```

## 10.2 React Component Example

```jsx
import React from 'react';
import './App.css';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  children,
  ...props 
}) => {
  const className = `btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''}`;
  
  return (
    <button 
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

## 10.3 Usage Examples

```jsx
// Primary Button
<Button variant="primary" onClick={handleSubmit}>
  Enregistrer
</Button>

// Accent CTA
<Button variant="accent" size="lg">
  Créer mon compte
</Button>

// Outline Secondary
<Button variant="outline" onClick={handleCancel}>
  Annuler
</Button>

// Loading State
<Button variant="primary" loading={isLoading}>
  {isLoading ? 'Chargement...' : 'Envoyer'}
</Button>

// Disabled
<Button variant="primary" disabled>
  Indisponible
</Button>
```

---

## Quick Reference

### Color Variables
```css
--elysion-primary-500: #0a418e;
--elysion-accent-500: #fbb03b;
--elysion-secondary-300: #A8C3E7;
--elysion-bg-50: #F6F9FD;
```

### All Component Classes

#### Buttons
```css
.btn-primary     /* Main actions */
.btn-accent      /* CTAs */
.btn-outline     /* Secondary */
.btn-ghost       /* Tertiary */
.btn-secondary   /* Alternative */
.btn-danger      /* Destructive */

/* Sizes */
.btn-sm    /* Small: 8px/16px padding */
.btn-md    /* Medium: 12px/24px padding */
.btn-lg    /* Large: 16px/32px padding */
```

#### Cards
```css
.card-elysion      /* Default card with shadow */
.card-elevated     /* High elevation card */
.card-outlined     /* Bordered card */
.card-interactive  /* Clickable card */

/* Sizes */
.card-sm    /* Small: 16px padding */
.card-md    /* Medium: 24px padding */
.card-lg    /* Large: 32px padding */

/* Parts */
.card-header
.card-title
.card-subtitle
.card-body
.card-footer
```

#### Form Inputs
```css
.input-text      /* Standard text input */
.input-date      /* Date picker input */
.textarea        /* Multi-line text area */
.select          /* Dropdown select */

/* Sizes */
.input-sm    /* Small: 8px/12px padding */
.input-md    /* Medium: 12px/16px padding */
.input-lg    /* Large: 16px/20px padding */

/* States */
.error       /* Error state (red border) */
.success     /* Success state (green border) */
```

#### Checkboxes & Radio Buttons
```css
.checkbox-wrapper   /* Checkbox container */
.checkbox-input     /* Hidden native input */
.checkbox-custom    /* Custom styled checkbox */
.checkbox-label     /* Checkbox label text */

.radio-wrapper      /* Radio button container */
.radio-input        /* Hidden native input */
.radio-custom       /* Custom styled radio */
.radio-label        /* Radio label text */

/* Sizes */
.checkbox-sm    /* Small: 16px */
.checkbox-lg    /* Large: 24px */
.radio-sm       /* Small: 16px */
.radio-lg       /* Large: 24px */
```

#### Labels & Helper Text
```css
.label           /* Form label */
.label.required  /* Label with asterisk */
.helper-text     /* Helper/hint text */
.error-text      /* Error message */
.success-text    /* Success message */
```

#### Switch/Toggle
```css
.switch-wrapper  /* Switch container */
.switch-input    /* Hidden checkbox input */
.switch-slider   /* Visual slider */
.switch-label    /* Label text */

/* Sizes */
.switch-sm       /* Small: 36px width */
.switch-lg       /* Large: 56px width */
```

#### File Upload
```css
.file-upload-wrapper     /* Main wrapper */
.file-upload-area        /* Drop zone */
.file-upload-icon        /* Upload icon */
.file-selected           /* Selected file display */
.file-upload-progress    /* Progress bar */
.file-upload-list        /* Multiple files list */

/* States */
.drag-over       /* Active drag state */
```

#### Navigation
```css
.navbar              /* Top navigation bar */
.navbar-link         /* Nav link */
.navbar-link.active  /* Active nav link */
.breadcrumbs         /* Breadcrumb navigation */
.tabs                /* Tab navigation */
.tab.active          /* Active tab */
.pagination          /* Page navigation */
```

#### Modals & Overlays
```css
.modal-overlay   /* Modal backdrop */
.modal           /* Modal container */
.modal-header    /* Modal header */
.modal-body      /* Modal content */
.modal-footer    /* Modal actions */
.drawer          /* Sidebar drawer */
.tooltip         /* Tooltip popup */

/* Modal sizes */
.modal-sm, .modal-md, .modal-lg, .modal-xl, .modal-full
```

#### Alerts & Notifications
```css
.alert           /* Alert message */
.alert-success   /* Success alert */
.alert-error     /* Error alert */
.alert-warning   /* Warning alert */
.alert-info      /* Info alert */
.toast           /* Toast notification */
.badge           /* Badge/pill */
```

#### Tables & Lists
```css
.table           /* Data table */
.table-striped   /* Striped table */
.list            /* Custom list */
.list-item       /* List item */
```

#### Shadows & Elevation
```css
.shadow-xs, .shadow-sm, .shadow-md
.shadow-lg, .shadow-xl, .shadow-2xl
.shadow-inner, .shadow-none
```

#### Border Radius
```css
.rounded-none, .rounded-sm, .rounded-md, .rounded-lg
.rounded-xl, .rounded-2xl, .rounded-3xl, .rounded-full
```

#### Dropdowns
```css
.dropdown          /* Dropdown container */
.dropdown-trigger  /* Clickable trigger */
.dropdown-menu     /* Dropdown menu */
.dropdown-item     /* Menu item */

/* States */
.dropdown-item.selected    /* Selected item */
.dropdown-trigger.open     /* Open state */
```

### State Modifiers (All Components)

```css
:hover      /* Hover state - lighter/darker color, slight elevation */
:active     /* Pressed state - return to base, darker color */
:focus      /* Focus state - outline ring, border color change */
:disabled   /* Disabled state - gray, reduced opacity, no cursor */
.error      /* Error state - red border/background */
.success    /* Success state - green border/background */
```

### Common Patterns

#### Form Field with Label
```html
<div class="form-field">
  <label for="input-id" class="label required">Label</label>
  <input type="text" id="input-id" class="input-text">
  <span class="helper-text">Helper text</span>
</div>
```

#### Card with Content
```html
<div class="card-elysion">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">Content</div>
</div>
```

#### Checkbox Group
```html
<label class="checkbox-wrapper">
  <input type="checkbox" class="checkbox-input">
  <span class="checkbox-custom"></span>
  <span class="checkbox-label">Label</span>
</label>
```

---

## Component States Summary

| Component | Default | Hover | Focus | Active | Disabled | Error | Success | Drag |
|-----------|---------|-------|-------|--------|----------|-------|---------|------|
| **Buttons** | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | - |
| **Cards** | ✓ | ✓ | - | ✓ | ✓ | - | - | - |
| **Text Input** | ✓ | ✓ | ✓ | - | ✓ | ✓ | ✓ | - |
| **Textarea** | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - |
| **Select** | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - |
| **Date Input** | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - |
| **Checkbox** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| **Radio** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| **Switch** | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | - |
| **File Upload** | ✓ | ✓ | - | - | ✓ | ✓ | - | ✓ |
| **Dropdown** | ✓ | ✓ | - | ✓ | - | - | - | - |
| **Modal** | ✓ | - | - | - | - | - | - | - |
| **Drawer** | ✓ | - | - | - | - | - | - | - |
| **Alert** | ✓ | - | - | - | - | - | - | - |
| **Toast** | ✓ | - | - | - | - | - | - | - |
| **Badge** | ✓ | - | - | - | - | - | - | - |
| **Table** | ✓ | ✓ | - | - | - | - | - | - |
| **List** | ✓ | ✓ | - | - | - | - | - | - |
| **Tabs** | ✓ | ✓ | - | ✓ | ✓ | - | - | - |
| **Tooltip** | ✓ | ✓ | - | - | - | - | - | - |

---

**Document Version**: 3.0 Complete  
**Last Updated**: Décembre 2024  
**Maintained By**: Elysion Development Team  
**Status**: ✅ Production Ready - Full Design System

**What's New in v3.0:**
- ✨ Complete card component specifications with all states
- ✨ Detailed form components (text input, textarea, select, date)
- ✨ Checkbox and radio button with custom styling
- ✨ Dropdown/select with custom and native versions
- ✨ Form labels, helper text, error/success messages
- ✨ Switch/Toggle component with all states
- ✨ File upload with drag & drop, progress, and multiple files
- ✨ Navigation components (navbar, breadcrumbs, tabs, pagination)
- ✨ Modals, drawers, and tooltips
- ✨ Alerts, toasts, and badges
- ✨ Table and list components
- ✨ Complete animation library
- ✨ Shadow and elevation system
- ✨ Border radius guidelines
- ✨ Enhanced accessibility standards
- ✨ Component states summary table
- ✨ Quick reference with all component classes

**Total Components Documented**: 40+  
**Total CSS Properties**: 500+  
**Pages**: 100+

---

# 17. Mobile & Responsive Components (Janvier 2026)

## 17.1 Mobile Tab Bar

### Description
Barre de navigation fixe en bas de l'écran sur mobile, visible uniquement sur les pages protégées (connecté).

### Spécifications
```
Position: fixed bottom-0
Hauteur: 64px (h-16)
Background: white
Border: border-t border-gray-200
Z-index: 50
Visible: < 768px (md:hidden)
```

### Structure
```jsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
  <div className="flex justify-around items-center h-16">
    {tabs.map((tab) => (
      <button className="flex flex-col items-center justify-center flex-1 h-full">
        <span className="text-xl mb-1">{tab.icon}</span>
        <span className="text-xs font-medium">{tab.label}</span>
      </button>
    ))}
  </div>
</div>
```

### Onglets
| Icône | Label | Route |
|-------|-------|-------|
| 🏠 | Accueil | /dashboard |
| 🔮 | Simuler | /simulator |
| 📄 | Documents | /documents |
| 📈 | Investir | /investment-axes |
| ⚙️ | Profil | /profile |

### États
- **Actif**: `text-elysion-primary`
- **Inactif**: `text-gray-500 hover:text-elysion-primary`

### CSS Safe Area (iPhone)
```css
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
```

---

## 17.2 Menu Burger (Hamburger Menu)

### Description
Menu déroulant mobile accessible via l'icône hamburger dans la navigation.

### Icône Hamburger
```jsx
{/* Fermé */}
<svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
</svg>

{/* Ouvert */}
<svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
</svg>
```

### Menu Dropdown - Landing Page
```
┌─────────────────────────────────┐
│  🔮 Simulateur                  │
│  🔑 Se connecter                │
│  ✨ Créer un compte     (accent)│
└─────────────────────────────────┘
```

### Menu Dropdown - Pages Connectées
```
┌─────────────────────────────────┐
│  👤 Jean Dupont                 │
│     jean@email.com              │
├─────────────────────────────────┤
│  🏠 Tableau de bord             │
│  ⚙️ Mon profil                  │
│  🔮 Nouvelle simulation         │
├─────────────────────────────────┤
│  🚪 Déconnexion          (rouge)│
└─────────────────────────────────┘
```

### Spécifications CSS
```css
/* Container */
.mobile-menu {
  @apply md:hidden bg-white border-t border-gray-100 shadow-lg;
}

/* Item standard */
.mobile-menu-item {
  @apply w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors;
}

/* Item déconnexion */
.mobile-menu-item-danger {
  @apply w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors;
}

/* Item accent (CTA) */
.mobile-menu-item-accent {
  @apply w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-elysion-accent text-white hover:bg-elysion-accent/90 transition-colors;
}
```

---

## 17.3 Page Header (Responsive)

### Description
En-tête unifié pour toutes les pages protégées avec bouton retour et menu burger.

### Structure Desktop (≥ 768px)
```
┌─────────────────────────────────────────────────────────────┐
│  ← Retour    Elysion | Titre    👤 Nom Utilisateur  Déco   │
└─────────────────────────────────────────────────────────────┘
```

### Structure Mobile (< 768px)
```
┌─────────────────────────────────────────────────────────────┐
│  ←    Elysion                              Prénom    ☰     │
└─────────────────────────────────────────────────────────────┘
```

### Composant React
```jsx
import MobileTabBar, { PageHeader } from './MobileTabBar';

// Usage
<PageHeader title="Mes Documents" showBackButton={true} />
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Titre de la page |
| showBackButton | boolean | true | Afficher le bouton retour |

---

## 17.4 Indicateur d'Étapes (Step Indicator)

### Description
Indicateur de progression circulaire pour les simulateurs multi-étapes.

### Design
```
  ✓ ─── ✓ ─── 3 ─── 4 ─── 5 ─── 6 ─── 7
 bleu  bleu  orange gris  gris  gris  gris
```

### États des cercles
| État | Couleur | Contenu |
|------|---------|---------|
| Complété | `bg-elysion-primary` | Coche ✓ |
| Actuel | `bg-elysion-accent` | Numéro |
| À venir | `bg-gray-300` | Numéro |

### Spécifications Responsive
| Propriété | Mobile | Desktop |
|-----------|--------|---------|
| Cercle | 32px (w-8 h-8) | 40px (w-10 h-10) |
| Ligne | 12px (w-3) | 24px (w-6) |
| Gap | gap-0.5 | gap-1 |
| Padding | px-4 | px-2 |

### Code JSX
```jsx
<div className="flex items-center justify-center gap-0.5 sm:gap-1 py-4 px-4 sm:px-2">
  {[1, 2, 3, 4, 5, 6, 7].map((step, index) => (
    <div key={step} className="flex items-center flex-shrink-0">
      {/* Circle */}
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
        step < currentStep ? 'bg-elysion-primary' :
        step === currentStep ? 'bg-elysion-accent' : 'bg-gray-300'
      }`}>
        {step < currentStep ? (
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-white text-sm sm:text-base font-semibold">{step}</span>
        )}
      </div>
      
      {/* Connector */}
      {index < 6 && (
        <div className={`w-3 sm:w-6 h-1 mx-0.5 sm:mx-1 ${
          step < currentStep ? 'bg-elysion-primary' : 'bg-gray-300'
        }`} />
      )}
    </div>
  ))}
</div>
```

---

## 17.5 Modal Newsletter

### Description
Modal popup pour l'inscription à la newsletter, accessible depuis la landing page.

### Structure
```
┌─────────────────────────────────────────┐
│                                    ✕    │
│            ✉️ (icône)                   │
│                                         │
│         Restez informé                  │
│   Recevez nos conseils retraite...      │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ votre@email.com                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│   [        S'abonner        ]           │
│                                         │
│   🔒 Pas de spam, désinscription...     │
└─────────────────────────────────────────┘
```

### État Succès
```
┌─────────────────────────────────────────┐
│            ✓ (vert)                     │
│                                         │
│            Merci !                      │
│   Vous êtes maintenant inscrit...       │
│                                         │
│   [        Fermer        ]              │
└─────────────────────────────────────────┘
```

### Spécifications CSS
```css
/* Backdrop */
.modal-backdrop {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50;
}

/* Modal Container */
.modal-container {
  @apply relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8;
}

/* Close Button */
.modal-close {
  @apply absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors;
}

/* Icon Container */
.modal-icon {
  @apply w-16 h-16 bg-elysion-primary/10 rounded-full flex items-center justify-center mx-auto mb-4;
}

/* Success Icon */
.modal-icon-success {
  @apply w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4;
}
```

### API Endpoint
```
POST /api/newsletter/subscribe
Body: { email: "user@example.com" }
Response: 201 Created | 409 Conflict (déjà inscrit)
```

---

# 18. Typographie Complète

## 18.1 Propriétés de Base

### Règle principale
Tous les éléments textuels doivent avoir ces 3 propriétés définies :
1. `font-size`
2. `font-weight`
3. `line-height`

### Police
```css
font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
```

## 18.2 Hiérarchie Typographique

| Élément | font-size | font-weight | line-height |
|---------|-----------|-------------|-------------|
| h1 | 2.5rem (40px) | 700 | 1.2 |
| h2 | 2rem (32px) | 700 | 1.25 |
| h3 | 1.5rem (24px) | 600 | 1.3 |
| h4 | 1.25rem (20px) | 600 | 1.35 |
| h5 | 1.125rem (18px) | 600 | 1.4 |
| h6 | 1rem (16px) | 600 | 1.5 |
| p | 1rem (16px) | 400 | 1.6 |
| small | 0.875rem (14px) | 400 | 1.5 |
| label | 0.875rem (14px) | 500 | 1.5 |

## 18.3 Classes Utilitaires

### Font Weights
```css
.font-thin { font-weight: 100; }
.font-extralight { font-weight: 200; }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
.font-black { font-weight: 900; }
```

### Font Sizes avec Line-Height
```css
.text-2xs { font-size: 0.625rem; line-height: 1.4; }
.text-xs { font-size: 0.75rem; line-height: 1.4; }
.text-sm { font-size: 0.875rem; line-height: 1.5; }
.text-base { font-size: 1rem; line-height: 1.6; }
.text-lg { font-size: 1.125rem; line-height: 1.6; }
.text-xl { font-size: 1.25rem; line-height: 1.5; }
.text-2xl { font-size: 1.5rem; line-height: 1.4; }
.text-3xl { font-size: 1.875rem; line-height: 1.3; }
.text-4xl { font-size: 2.25rem; line-height: 1.25; }
.text-5xl { font-size: 3rem; line-height: 1.2; }
.text-6xl { font-size: 3.75rem; line-height: 1.1; }
```

---

# 19. Breakpoints Responsive

## 19.1 Points de Rupture

| Breakpoint | Min-width | Usage |
|------------|-----------|-------|
| (default) | 0px | Mobile first |
| sm | 640px | Petits tablets |
| md | 768px | Tablets |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large |

## 19.2 Patterns Responsive Courants

### Grilles
```css
/* 1 col mobile → 2 cols tablet → 3 cols desktop */
.grid.grid-cols-1.sm:grid-cols-2.lg:grid-cols-3

/* 1 col mobile → 3 cols desktop */
.grid.grid-cols-1.md:grid-cols-3
```

### Padding
```css
/* Responsive padding */
.px-4.sm:px-6.lg:px-8
.py-6.sm:py-8
```

### Texte
```css
/* Titre responsive */
.text-2xl.sm:text-3xl.lg:text-4xl

/* Sous-titre responsive */
.text-sm.sm:text-base
```

### Visibilité
```css
/* Mobile only */
.md:hidden

/* Desktop only */
.hidden.md:block

/* Mobile menu */
.md:hidden
```

## 19.3 Layout Responsive

### Container Principal
```css
.max-w-7xl.mx-auto.px-4.sm:px-6.lg:px-8
```

### Padding Bottom (avec Tab Bar)
```css
/* Pages avec Tab Bar mobile */
.pb-20.md:pb-0
```

---

# 20. Composants Fichiers

## 20.1 Structure des Fichiers

```
frontend/src/components/
├── MobileTabBar.jsx       # Tab Bar + PageHeader
├── LandingPage.js         # Page d'accueil + Newsletter Modal
├── Dashboard.js           # Tableau de bord responsive
├── EmployeeSimulator.js   # Simulateur salarié + Step Indicator
├── FreelanceSimulator.js  # Simulateur freelance + Step Indicator
├── Documents.js           # Gestion documents responsive
├── InvestmentAxes.js      # Axes investissement responsive
├── ProfilePage.js         # Page profil responsive
└── ui/                    # Composants shadcn/ui
```

## 20.2 Imports Standards

```jsx
// Navigation responsive
import MobileTabBar, { PageHeader } from './MobileTabBar';

// Auth context
import { useAuth } from '../App';

// Router
import { useNavigate, useLocation } from 'react-router-dom';
```

---

**Mise à jour**: Janvier 2026
**Version**: 3.0