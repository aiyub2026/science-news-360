# Science News 360 V2.0 — Master Baseline Audit Report

**Baseline:** ScienceNews360_V1.3.9_Single_Footer_Rendering_Fix(1).zip  
**Output:** ScienceNews360 V2.0.0 UX/UI Foundation  
**Audit date:** 5 August 2026  
**Status:** Tahap 0.1 foundation implemented; production dependency installation requires final Mac validation.

## 1. Executive finding

The baseline is a functioning Next.js App Router prototype with broad public, author, editorial, and administration route coverage. It contains **32 page routes**, **22 React component files**, and **64 TypeScript/TSX source files**. Its strongest areas are the multilingual public homepage, article rendering, learning catalogue, prototype authentication, author content wizard, and role dashboards.

The main weakness was not missing breadth, but inconsistent product maturity: multiple visual generations coexisted, several controls had no meaningful action, navigation contained routes that did not exist, dashboard sidebars exposed unfinished modules, design tokens were embedded in one very large stylesheet, and accessibility behaviour was inconsistent.

## 2. Benchmark findings

The V2 foundation applies the following benchmark principles:

- **Nature / Science:** strong editorial hierarchy, visible content type and authorship, subject navigation, date and evidence metadata, clear latest-content discovery.
- **MIT Technology Review:** confident feature-led visual storytelling, restrained palette, large editorial headlines, topic discovery.
- **The Conversation:** author expertise and institutional affiliation as prominent trust signals.
- **Medium:** readable article width, simple actions, low-friction author identity.
- **Material Design 3:** predictable components, visible focus, minimum interactive sizing, semantic states, responsive navigation, and reduced-motion support.

## 3. Source-code audit

### 3.1 Architecture retained

- Next.js App Router and locale routes: retained.
- Existing article, author, category, video, learning, authentication, dashboard, and CMS modules: retained.
- Existing browser prototype storage: retained pending Tahap 1/backend work.
- Single locale-level Enterprise Header and Footer: retained as the public shell.

### 3.2 Changes implemented

1. Added a dedicated `src/app/design-tokens.css` foundation.
2. Removed the Tailwind import and Tailwind/PostCSS package dependency because the baseline uses custom CSS rather than Tailwind utilities.
3. Added production-aware `metadataBase` through `NEXT_PUBLIC_SITE_URL`.
4. Added real `/[locale]/latest` and `/[locale]/topic/[slug]` routes to close broken homepage links.
5. Reworked the LIVE ticker so the label occupies a fixed non-scrolling region.
6. Converted non-functional homepage controls into working prototype actions:
   - bookmark state;
   - video link;
   - author profile links;
   - newsletter confirmation.
7. Removed unused legacy `Footer.tsx` and `SiteHeader.tsx` components.
8. Reduced dashboard navigation to modules with implemented routes only.
9. Added keyboard focus, reduced-motion, responsive, card, header, dashboard, and form refinements.
10. Added meaningful image alternative text on redesigned homepage cards and hero content.
11. Added explicit button types to major navigation controls.
12. Added source-level syntax validation covering all TypeScript/TSX files.

## 4. Route audit

### Public routes

- Home: ID and EN
- Latest
- Article detail
- Category detail
- Topic detail
- Video
- Authors directory and author detail
- Academic Learning catalogue
- Information/policy pages
- Login, registration, verification, recovery, profile completion, contributor application

### Dashboard routes

- Reader
- Contributor
- Author overview, content creation, content list, content detail, media, profile
- Reviewer
- Editor
- Publisher
- Administrator and YouTube settings
- System administrator

### Route issues closed in V2.0.0

- Homepage  link previously had no page: fixed.
- Homepage topic links previously had no route: fixed.
- Footer duplication: remains fixed through one locale layout rendering point.
- Legacy header/footer alternatives: removed to prevent future duplicate-shell regressions.

## 5. UX/UI audit by area

| Area | Baseline finding | V2.0.0 action | Remaining stage |
|---|---|---|---|
| Design tokens | Colors and spacing mixed into one stylesheet | Dedicated token layer created | Component package in Tahap 0.2 |
| Header | Feature-rich but compressed and inconsistent controls | Focus, sizing, button semantics, visual consistency improved | Mobile usability audit |
| Mega menu | Functional and information-rich | Elevated surface and token alignment | Keyboard arrow navigation |
| LIVE ticker | Label could overlap scrolling copy | Fixed label and independent viewport | Live data backend |
| Homepage | Strong composition, some dead controls/routes | Routes and interactions repaired | Editorial image replacement |
| Article | Rich structure and trust metadata | Retained | Full content-block design audit |
| Category/topic | Dynamic category pages; missing topic page | Topic and Latest routes added | Filtering/search integration |
| Video | Visual page and YouTube prototype | Retained | Backend/API connection |
| Authors | Directory and author detail available | Homepage links connected | Unified author database |
| Login/register | Multiple generations but functional | Tokens/focus inherited | Final Tahap 1 redesign |
| Author dashboard | Wide functional coverage | Navigation reduced to real modules | Full Tahap 1 redesign |
| Admin dashboard | Command center exists | Navigation reduced to real modules | Tahap 2 operational depth |
| CMS wizard | Advanced prototype | Retained | Tahap 1 validation and templates |
| Media | Browser prototype | Retained | Backend storage in later phase |

## 6. Accessibility audit

### Implemented

- Global  treatment.
- Reduced-motion support.
- Fixed button minimum height.
- Search dialog semantics improved.
- Homepage images given meaningful alt text.
- Newsletter input given an explicit label.
- Primary icon controls use accessible labels.

### Open items

- Complete keyboard navigation inside mega menus.
- Automated WCAG contrast scan.
- Full screen-reader review of article table of contents and CMS wizard.
- Consistent form error association with `aria-describedby`.
- Replace remaining symbolic icons with a governed SVG icon set.

## 7. Technical audit

- Source syntax validation: **PASS — 64 files, 0 syntax diagnostics**.
- Duplicate public footer import: **PASS — one rendering source**.
- Legacy shell component removal: **PASS**.
- Dependency installation inside the OpenAI container: **BLOCKED by internal npm registry 404**, not by the source project.
- Final `npm install`, `npm run build`, and `npm run dev`: must be performed on the Mac validation environment before formal LOCK.

## 8. Lock recommendation

V2.0.0 is suitable as the **Tahap 0.1 UX/UI foundation release candidate**, not yet a production lock. Formal lock requires the Mac validation evidence described in `REGRESSION_TEST_CHECKLIST.md` and `VALIDATION_REPORT_V2.0.md`.
