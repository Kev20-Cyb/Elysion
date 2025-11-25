# Elysion - Design & Development Handoff Document

## Project Overview
**Platform**: Smart Retirement Planning Platform  
**Tech Stack**: React + FastAPI + MongoDB  
**Typography**: Montserrat  
**Design System**: Minimal, Professional, Financial Services  

---

## Color System

### Brand Colors (Full 50-950 Scale)

#### Primary Blue - Trust & Stability
```css
elysion-primary-50: #eff6ff    /* Very light backgrounds */
elysion-primary-100: #dbeafe   /* Light highlights */
elysion-primary-200: #bfdbfe   /* Subtle accents */
elysion-primary-300: #93c5fd   /* Disabled states */
elysion-primary-400: #60a5fa   /* Interactive elements */
elysion-primary-500: #3b82f6   /* Standard blue */
elysion-primary-600: #2563eb   /* Hover states */
elysion-primary-700: #1d4ed8   /* Active states */
elysion-primary-800: #0A418E   /* 🎯 MAIN BRAND COLOR */
elysion-primary-900: #1e3a8a   /* Dark elements */
elysion-primary-950: #172554   /* Darkest shade */
```

#### Secondary Light Blue - Calm & Accessibility  
```css
elysion-secondary-50: #f0f7ff    /* Card backgrounds */
elysion-secondary-100: #e0efff   /* Light sections */
elysion-secondary-200: #bae0ff   /* Borders, dividers */
elysion-secondary-300: #A8C3E7   /* 🎯 MAIN SECONDARY */
elysion-secondary-400: #60a5fa   /* Icons, accents */
elysion-secondary-500: #3b82f6   /* Standard elements */
elysion-secondary-600: #2563eb   /* Hover states */
elysion-secondary-700: #1d4ed8   /* Active states */
elysion-secondary-800: #1e40af   /* Dark accents */
elysion-secondary-900: #1e3a8a   /* Text on light */
elysion-secondary-950: #172554   /* Darkest elements */
```

#### Accent Gold - CTAs & Highlights
```css
elysion-accent-50: #fffbeb     /* Light backgrounds */
elysion-accent-100: #fef3c7    /* Subtle highlights */
elysion-accent-200: #fde68a    /* Light accents */
elysion-accent-300: #fcd34d    /* Warnings, alerts */
elysion-accent-400: #fbbf24    /* Interactive gold */
elysion-accent-500: #E6A857    /* 🎯 MAIN ACCENT/CTA */
elysion-accent-600: #d97706    /* Hover states */
elysion-accent-700: #b45309    /* Active states */
elysion-accent-800: #92400e    /* Dark gold */
elysion-accent-900: #78350f    /* Darkest gold */
elysion-accent-950: #451a03    /* Text on light gold */
```

#### Background Light - Clean Foundation
```css
elysion-bg-50: #F6F9FD        /* 🎯 MAIN BACKGROUND */
elysion-bg-100: #f1f5f9       /* Card backgrounds */
elysion-bg-200: #e2e8f0       /* Borders, dividers */
elysion-bg-300: #cbd5e1       /* Subtle elements */
elysion-bg-400: #94a3b8       /* Placeholder text */
elysion-bg-500: #64748b       /* Secondary text */
elysion-bg-600: #475569       /* Primary text light */
elysion-bg-700: #334155       /* Primary text */
elysion-bg-800: #1e293b       /* Dark elements */
elysion-bg-900: #0f172a       /* Very dark */
elysion-bg-950: #020617       /* Darkest */
```

#### Neutral Grays
```css
elysion-gray-50: #f8fafc      /* Light backgrounds */
elysion-gray-100: #f1f5f9     /* Card backgrounds */
elysion-gray-200: #e2e8f0     /* Borders */
elysion-gray-300: #cbd5e1     /* Dividers */
elysion-gray-400: #94a3b8     /* Placeholder */
elysion-gray-500: #64748b     /* Secondary text */
elysion-gray-600: #475569     /* Body text */
elysion-gray-700: #334155     /* Headings */
elysion-gray-800: #1e293b     /* Dark text */
elysion-gray-900: #0f172a     /* Darkest text */
elysion-gray-950: #020617     /* Pure dark */
```

#### Semantic Colors
```css
/* Success Green */
elysion-success-50: #f0fdf4   
elysion-success-500: #22c55e  /* Success messages */
elysion-success-600: #16a34a  /* Success hover */
elysion-success-700: #15803d  /* Success active */

/* Warning Orange */
elysion-warning-50: #fff7ed   
elysion-warning-500: #f97316  /* Warning messages */
elysion-warning-600: #ea580c  /* Warning hover */
elysion-warning-700: #c2410c  /* Warning active */

/* Error Red */
elysion-error-50: #fef2f2     
elysion-error-500: #ef4444    /* Error messages */
elysion-error-600: #dc2626    /* Error hover */
elysion-error-700: #b91c1c    /* Error active */
```

---

## Typography System

### Font Family
```css
font-family: 'Montserrat', sans-serif;
```

### Font Weights
- **Montserrat Regular (400)**: Body text, descriptions
- **Montserrat Medium (500)**: Labels, captions  
- **Montserrat SemiBold (600)**: Buttons, emphasis
- **Montserrat Bold (700)**: Headings, titles

### Type Scale
```css
/* Headings */
.text-6xl { font-size: 3.75rem; }  /* Hero titles */
.text-5xl { font-size: 3rem; }     /* Page titles */
.text-4xl { font-size: 2.25rem; }  /* Section titles */
.text-3xl { font-size: 1.875rem; } /* Subsection titles */
.text-2xl { font-size: 1.5rem; }   /* Card titles */
.text-xl { font-size: 1.25rem; }   /* Large text */

/* Body Text */
.text-lg { font-size: 1.125rem; }  /* Large body */
.text-base { font-size: 1rem; }    /* Default body */
.text-sm { font-size: 0.875rem; }  /* Small text */
.text-xs { font-size: 0.75rem; }   /* Captions */
```

---

## Component Library

### Buttons
```css
/* Primary Button */
.btn-elysion-primary {
  background-color: var(--elysion-primary-800);
  color: white;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-elysion-primary:hover {
  background-color: var(--elysion-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(10, 65, 142, 0.3);
}

/* Accent Button (CTAs) */
.btn-elysion-accent {
  background-color: var(--elysion-accent-500);
  color: white;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-elysion-accent:hover {
  background-color: var(--elysion-accent-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(230, 168, 87, 0.3);
}

/* Outline Button */
.btn-outline-elysion {
  background: transparent;
  color: var(--elysion-primary-800);
  padding: 12px 32px;
  border: 2px solid var(--elysion-primary-800);
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-outline-elysion:hover {
  background-color: var(--elysion-primary-800);
  color: white;
  transform: translateY(-2px);
}
```

### Form Inputs
```css
.input-elysion {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid var(--elysion-gray-200);
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
  background-color: white;
}

.input-elysion:focus {
  outline: none;
  border-color: var(--elysion-primary-800);
  box-shadow: 0 0 0 3px var(--elysion-primary-100);
}
```

### Cards
```css
.card-elysion {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card-elysion:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
```

---

## Layout System

### Spacing Scale
```css
/* Padding/Margin Scale */
.p-1 { padding: 0.25rem; }    /* 4px */
.p-2 { padding: 0.5rem; }     /* 8px */
.p-3 { padding: 0.75rem; }    /* 12px */
.p-4 { padding: 1rem; }       /* 16px */
.p-6 { padding: 1.5rem; }     /* 24px */
.p-8 { padding: 2rem; }       /* 32px */
.p-12 { padding: 3rem; }      /* 48px */
.p-16 { padding: 4rem; }      /* 64px */
.p-20 { padding: 5rem; }      /* 80px */
.p-24 { padding: 6rem; }      /* 96px */
```

### Border Radius
```css
.rounded-sm { border-radius: 0.125rem; }  /* 2px */
.rounded { border-radius: 0.25rem; }      /* 4px */
.rounded-md { border-radius: 0.375rem; }  /* 6px */
.rounded-lg { border-radius: 0.5rem; }    /* 8px */
.rounded-xl { border-radius: 0.75rem; }   /* 12px - Main */
.rounded-2xl { border-radius: 1rem; }     /* 16px - Cards */
.rounded-3xl { border-radius: 1.5rem; }   /* 24px - Hero */
.rounded-full { border-radius: 9999px; }  /* Pills */
```

### Shadows
```css
/* Elysion Shadow System */
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
.shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
.shadow-2xl { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }

/* Custom Elysion Shadows */
.shadow-elysion { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); }
.shadow-elysion-hover { box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); }
.shadow-elysion-primary { box-shadow: 0 8px 25px rgba(10, 65, 142, 0.3); }
.shadow-elysion-accent { box-shadow: 0 8px 25px rgba(230, 168, 87, 0.3); }
```

---

## Animation System

### Transitions
```css
/* Standard Transitions */
.transition-all { transition: all 0.3s ease; }
.transition-colors { transition: color 0.3s ease, background-color 0.3s ease; }
.transition-transform { transition: transform 0.3s ease; }
.transition-opacity { transition: opacity 0.3s ease; }

/* Elysion Animations */
.fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

.slide-up {
  animation: slideUp 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Hover Effects
```css
/* Standard Hover States */
.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-shadow:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
```

---

## Accessibility Guidelines

### Color Contrast
- **AA Standard**: 4.5:1 minimum
- **AAA Standard**: 7:1 preferred

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus states clearly visible
- Tab order logical

### Screen Readers
- All images have alt text
- Form inputs have labels
- ARIA labels for complex interactions

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
/* xs: 0px - 639px (default) */
/* sm: 640px and up */
@media (min-width: 640px) { ... }

/* md: 768px and up */
@media (min-width: 768px) { ... }

/* lg: 1024px and up */
@media (min-width: 1024px) { ... }

/* xl: 1280px and up */
@media (min-width: 1280px) { ... }

/* 2xl: 1536px and up */
@media (min-width: 1536px) { ... }
```

---

## Implementation Notes

### CSS Variables Usage
All colors are available as CSS custom properties:
```css
background-color: var(--elysion-primary-800);
color: var(--elysion-accent-500);
border-color: var(--elysion-gray-200);
```

### Class Naming Convention
- Use `elysion-` prefix for custom classes
- Follow BEM methodology for complex components
- Use descriptive names (e.g., `.btn-elysion-primary`)

### Component States
- **Default**: Base appearance
- **Hover**: Subtle elevation and color change
- **Active**: Pressed/clicked state
- **Disabled**: Reduced opacity (0.5)
- **Focus**: Clear outline for keyboard navigation

---

**Design System Version**: 1.0  
**Last Updated**: November 2024  
**Maintained by**: Elysion Development Team