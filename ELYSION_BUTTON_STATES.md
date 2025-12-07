# Elysion - Button States Design System

## Button Component States

Tous les boutons du système Elysion doivent implémenter 4 états distincts pour une expérience utilisateur optimale.

---

## Primary Button (Bouton Principal)

### Default State
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
**Visual**: Fond bleu primaire, texte blanc, ombre légère

### Hover State
```css
.btn-primary:hover {
  background-color: var(--elysion-primary-600);  /* #0c4ca7 */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 65, 142, 0.3);
}
```
**Visual**: Fond bleu plus foncé, légère élévation, ombre accentuée

### Pressed/Active State
```css
.btn-primary:active {
  background-color: var(--elysion-primary-700);  /* #083777 */
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(10, 65, 142, 0.3);
}
```
**Visual**: Fond bleu encore plus foncé, retour à la position normale, ombre réduite

### Disabled State
```css
.btn-primary:disabled {
  background-color: var(--elysion-gray-300);  /* #cbd5e1 */
  color: var(--elysion-gray-500);  /* #64748b */
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}
```
**Visual**: Fond gris clair, texte gris, pas d'ombre, curseur interdit

---

## Accent Button (CTA Orange)

### Default State
```css
.btn-accent {
  background-color: var(--elysion-accent-500);  /* #fbb03b */
  color: var(--elysion-primary-900);  /* #011532 */
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
**Visual**: Fond orange vif, texte bleu foncé, ombre orange légère

### Hover State
```css
.btn-accent:hover {
  background-color: var(--elysion-accent-600);  /* #fa9c09 */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 176, 59, 0.4);
}
```
**Visual**: Fond orange plus intense, légère élévation, ombre accentuée

### Pressed/Active State
```css
.btn-accent:active {
  background-color: var(--elysion-accent-700);  /* #d68404 */
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(251, 176, 59, 0.3);
}
```
**Visual**: Fond orange foncé, retour à la position normale, ombre réduite

### Disabled State
```css
.btn-accent:disabled {
  background-color: var(--elysion-gray-300);  /* #cbd5e1 */
  color: var(--elysion-gray-500);  /* #64748b */
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}
```
**Visual**: Fond gris clair, texte gris, pas d'ombre, curseur interdit

---

## Outline Button (Bouton Contour)

### Default State
```css
.btn-outline {
  background-color: transparent;
  color: var(--elysion-primary-500);  /* #0a418e */
  border: 2px solid var(--elysion-primary-500);
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
```
**Visual**: Fond transparent, texte et bordure bleu primaire

### Hover State
```css
.btn-outline:hover {
  background-color: var(--elysion-primary-50);  /* #f5f7fa */
  color: var(--elysion-primary-600);  /* #0c4ca7 */
  border-color: var(--elysion-primary-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(10, 65, 142, 0.15);
}
```
**Visual**: Fond bleu très clair, texte et bordure bleu plus foncé, légère élévation

### Pressed/Active State
```css
.btn-outline:active {
  background-color: var(--elysion-primary-100);  /* #eaeff5 */
  color: var(--elysion-primary-700);  /* #083777 */
  border-color: var(--elysion-primary-700);
  transform: translateY(0);
  box-shadow: none;
}
```
**Visual**: Fond bleu clair, texte et bordure bleu foncé, retour position normale

### Disabled State
```css
.btn-outline:disabled {
  background-color: transparent;
  color: var(--elysion-gray-400);  /* #94a3b8 */
  border-color: var(--elysion-gray-300);  /* #cbd5e1 */
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}
```
**Visual**: Fond transparent, texte et bordure gris, curseur interdit

---

## Ghost Button (Bouton Fantôme)

### Default State
```css
.btn-ghost {
  background-color: transparent;
  color: var(--elysion-primary-500);  /* #0a418e */
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
```
**Visual**: Complètement transparent, texte bleu primaire

### Hover State
```css
.btn-ghost:hover {
  background-color: var(--elysion-primary-50);  /* #f5f7fa */
  color: var(--elysion-primary-600);  /* #0c4ca7 */
}
```
**Visual**: Fond bleu très clair apparaît, texte bleu plus foncé

### Pressed/Active State
```css
.btn-ghost:active {
  background-color: var(--elysion-primary-100);  /* #eaeff5 */
  color: var(--elysion-primary-700);  /* #083777 */
}
```
**Visual**: Fond bleu clair, texte bleu foncé

### Disabled State
```css
.btn-ghost:disabled {
  background-color: transparent;
  color: var(--elysion-gray-400);  /* #94a3b8 */
  cursor: not-allowed;
  opacity: 0.5;
}
```
**Visual**: Transparent, texte gris clair, curseur interdit

---

## Secondary Button (Bouton Secondaire)

### Default State
```css
.btn-secondary {
  background-color: var(--elysion-secondary-300);  /* #A8C3E7 */
  color: var(--elysion-primary-800);  /* #022250 */
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(168, 195, 231, 0.25);
}
```
**Visual**: Fond bleu clair secondaire, texte bleu foncé, ombre légère

### Hover State
```css
.btn-secondary:hover {
  background-color: var(--elysion-secondary-400);  /* #60a5fa */
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(168, 195, 231, 0.35);
}
```
**Visual**: Fond bleu plus vif, texte blanc, légère élévation

### Pressed/Active State
```css
.btn-secondary:active {
  background-color: var(--elysion-secondary-500);  /* #3b82f6 */
  color: #FFFFFF;
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(168, 195, 231, 0.3);
}
```
**Visual**: Fond bleu intense, texte blanc, retour position normale

### Disabled State
```css
.btn-secondary:disabled {
  background-color: var(--elysion-gray-300);  /* #cbd5e1 */
  color: var(--elysion-gray-500);  /* #64748b */
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}
```
**Visual**: Fond gris clair, texte gris, pas d'ombre, curseur interdit

---

## Danger/Destructive Button (Bouton Danger)

### Default State
```css
.btn-danger {
  background-color: var(--elysion-error-500);  /* #ef4444 */
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.25);
}
```
**Visual**: Fond rouge, texte blanc, ombre rouge légère

### Hover State
```css
.btn-danger:hover {
  background-color: var(--elysion-error-600);  /* #dc2626 */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}
```
**Visual**: Fond rouge plus foncé, légère élévation, ombre accentuée

### Pressed/Active State
```css
.btn-danger:active {
  background-color: var(--elysion-error-700);  /* #b91c1c */
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.3);
}
```
**Visual**: Fond rouge très foncé, retour position normale, ombre réduite

### Disabled State
```css
.btn-danger:disabled {
  background-color: var(--elysion-gray-300);  /* #cbd5e1 */
  color: var(--elysion-gray-500);  /* #64748b */
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  transform: none;
}
```
**Visual**: Fond gris clair, texte gris, pas d'ombre, curseur interdit

---

## Button Sizes

### Small
```css
.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
}
```

### Medium (Default)
```css
.btn-md {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
}
```

### Large
```css
.btn-lg {
  padding: 16px 32px;
  font-size: 18px;
  border-radius: 10px;
}
```

---

## Usage Guidelines

### When to Use Each Button Type

**Primary Button**
- Actions principales (connexion, inscription, enregistrer)
- Un seul par section/page idéalement

**Accent Button (Orange)**
- Appels à l'action critiques (CTA)
- Conversions importantes (créer un compte, commencer simulation)
- Maximum 1-2 par page

**Outline Button**
- Actions secondaires
- Alternatives à l'action principale
- Navigation entre étapes

**Ghost Button**
- Actions tertiaires
- Navigation légère
- Liens stylisés

**Secondary Button**
- Actions alternatives importantes
- Étapes intermédiaires

**Danger Button**
- Suppressions
- Actions irréversibles
- Confirmations critiques

### Accessibility Requirements

- **Contrast Ratio**: Minimum 4.5:1 pour le texte
- **Focus State**: Ajouter un outline visible pour navigation clavier
- **Touch Target**: Minimum 44x44px pour mobile
- **Loading State**: Spinner + texte "Chargement..." si action longue

### Example Focus State
```css
.btn:focus-visible {
  outline: 3px solid var(--elysion-accent-400);
  outline-offset: 2px;
}
```

---

## Implementation Examples

### React/JSX
```jsx
// Primary Button
<button className="btn-primary" onClick={handleSubmit}>
  Enregistrer
</button>

// Accent Button (CTA)
<button className="btn-accent" onClick={handleCreate}>
  Créer mon compte
</button>

// Disabled Button
<button className="btn-primary" disabled>
  Traitement en cours...
</button>

// With Loading State
<button className="btn-primary" disabled={loading}>
  {loading ? (
    <>
      <span className="spinner"></span>
      Chargement...
    </>
  ) : (
    'Envoyer'
  )}
</button>
```

### HTML
```html
<!-- Primary Button -->
<button class="btn-primary">Connexion</button>

<!-- Accent Button -->
<button class="btn-accent">Commencer</button>

<!-- Outline Button -->
<button class="btn-outline">Annuler</button>

<!-- Disabled Button -->
<button class="btn-primary" disabled>Indisponible</button>
```

---

**Version**: 1.0  
**Dernière mise à jour**: Novembre 2024  
**Couleurs**: Système Elysion (50-950 scale)
