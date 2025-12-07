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
6. [Layout & Spacing](#6-layout--spacing)
7. [Iconography](#7-iconography)
8. [Animation & Interactions](#8-animation--interactions)
9. [Accessibility Standards](#9-accessibility-standards)
10. [Implementation Guide](#10-implementation-guide)

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
| 50 | `#f5f7fa` | Very light backgrounds, cards |
| 100 | `#eaeff5` | Light highlights, hover states |
| 200 | `#cddbef` | Subtle accents, borders |
| 300 | `#97bbec` | Disabled states, placeholders |
| 400 | `#4a90f2` | Interactive elements |
| **500** | **`#0a418e`** | **🎯 MAIN BRAND COLOR** |
| 600 | `#0c4ca7` | Button hover states |
| 700 | `#083777` | Button active states |
| 800 | `#022250` | Dark text, headers |
| 900 | `#011532` | Darker elements |
| 950 | `#010b19` | Darkest elements |

```css
--elysion-primary-50: #f5f7fa;
--elysion-primary-100: #eaeff5;
--elysion-primary-200: #cddbef;
--elysion-primary-300: #97bbec;
--elysion-primary-400: #4a90f2;
--elysion-primary-500: #0a418e;
--elysion-primary-600: #0c4ca7;
--elysion-primary-700: #083777;
--elysion-primary-800: #022250;
--elysion-primary-900: #011532;
--elysion-primary-950: #010b19;
```

### Secondary Light Blue - Calm & Accessibility
**Supporting Color: #A8C3E7 (300 level)**

```css
--elysion-secondary-50: #f0f7ff;
--elysion-secondary-100: #e0efff;
--elysion-secondary-200: #bae0ff;
--elysion-secondary-300: #A8C3E7;  /* Main secondary */
--elysion-secondary-400: #60a5fa;
--elysion-secondary-500: #3b82f6;
--elysion-secondary-600: #2563eb;
--elysion-secondary-700: #1d4ed8;
--elysion-secondary-800: #1e40af;
--elysion-secondary-900: #1e3a8a;
--elysion-secondary-950: #172554;
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

## 2.3 Color Usage Guidelines

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

**Primary Font**: Montserrat (Google Fonts)  
**Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

```html
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
```

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

✅ **Color Contrast**
- Text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- Interactive elements: Minimum 3:1

✅ **Keyboard Navigation**
- All interactive elements accessible via Tab
- Visible focus indicators
- Logical tab order

✅ **Screen Readers**
- Semantic HTML
- ARIA labels where needed
- Alt text for images

✅ **Touch Targets**
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

### Button Classes
```css
.btn-primary     /* Main actions */
.btn-accent      /* CTAs */
.btn-outline     /* Secondary */
.btn-ghost       /* Tertiary */
.btn-danger      /* Destructive */
```

### Sizes
```css
.btn-sm    /* Small */
.btn-md    /* Medium (default) */
.btn-lg    /* Large */
```

---

**Document Version**: 2.0  
**Last Updated**: Décembre 2024  
**Maintained By**: Elysion Development Team  
**Status**: ✅ Production Ready
