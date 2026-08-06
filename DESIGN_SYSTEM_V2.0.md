# Science News 360 Design System V2.0

## 1. Design character

**Editorial authority + academic clarity + modern digital confidence.** The interface should feel calm, evidence-led, readable, and precise. Decoration must never compete with the article, author, source, or learning objective.

## 2. Token architecture

Tokens live in `src/app/design-tokens.css`.

### Brand

- Brand 950: `#061525`
- Brand 900: `#071B33`
- Brand 800: `#0B2747`
- Primary 600: `#1463FF`
- Accent 500: `#00B8D9`
- Warning 500: `#F28C28`
- Danger 600: `#C92A35`
- Success 600: `#138A60`

### Typography

- Editorial headings: Georgia/serif fallback.
- Interface and body: Arial/system sans fallback.
- Article body target: 65–75 characters per line.
- Major headlines use restrained negative tracking.

### Spacing

4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px.

### Shape

- Small radius: 6 px
- Medium radius: 10 px
- Large radius: 16 px
- Circular/pill: 999 px

### Elevation

- Small: quiet card separation
- Medium: dropdown/card hover
- Large: modal and mega menu

## 3. Component rules

### Buttons

- Minimum height: 40 px; 44 px preferred for forms/mobile.
- Every icon-only button requires an accessible name.
- Every non-submit button must declare `type="button"`.
- Primary actions use blue; dangerous actions use red and confirmation.

### Cards

- Use one of: editorial story, profile, statistic, task, or policy card.
- Do not create page-specific one-off card styles when an existing type applies.
- Hover motion is subtle and disabled when reduced motion is requested.

### Forms

- Labels are always visible.
- Validation occurs at the relevant step and field.
- Success, warning, and error states use text plus visual status, never color alone.
- Destructive file or content changes require confirmation.

### Navigation

- Public header contains discovery and contribution actions.
- Dashboard sidebars expose only implemented routes.
- Locale switching must preserve a corresponding route where possible.
- Footer is rendered once by the locale layout.

### Editorial content

- Author identity and institutional affiliation are primary trust signals.
- Content type, publication date, updated date, reading time, and review status are consistently positioned.
- Related content links must resolve to live articles.

## 4. Responsive rules

- Desktop: 12-column editorial grid.
- Tablet: 8-column adaptive grid.
- Mobile: 4-column content-first layout.
- Mobile interactive controls should be at least 44 px where practical.
- Complex tables should have a card or controlled overflow alternative.

## 5. Accessibility rules

- Target WCAG 2.2 AA.
- Visible focus is mandatory.
- Reduced motion is supported.
- Image alt text is mandatory for informative imagery.
- Heading levels must not be selected for appearance only.
- Dialogs need semantic roles, names, focus management, and Escape handling.
