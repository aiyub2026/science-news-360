# Science News 360 V2.0 — Regression Test Checklist

## A. Installation and build

- [ ] Extract ZIP into a new folder.
- [ ] `npm install` completes without dependency error.
- [ ] `npm run build` completes with zero TypeScript/build errors.
- [ ] `npm run dev` starts and displays the active local port.
- [ ] Browser console has no hydration error.

## B. Public shell

- [ ] Header appears once.
- [ ] Footer appears once on Home, Latest, Category, Topic, Video, Authors, Article, and Info pages.
- [ ] LIVE label remains fixed while ticker text moves behind its own viewport.
- [ ] Mega menus do not overflow desktop viewport.
- [ ] Mobile menu opens, closes, scrolls, and retains visible focus.
- [ ] Dark mode is legible and persists after reload.

## C. Public routes

- [ ] `/id` and `/en` render.
- [ ] `/id/latest` renders.
- [ ] Each homepage hero/card link opens a real article.
- [ ] Every topic link opens `/[locale]/topic/[slug]`.
- [ ] Category, Video, Authors, Author Detail, Learning, and Info routes render.
- [ ] Unknown article slugs show the intended not-found page.

## D. Homepage interactions

- [ ] Bookmark toggles and communicates its state.
- [ ] WhatsApp share opens a correctly encoded URL.
- [ ] Featured video opens the Video page.
- [ ] Featured author cards open valid profiles.
- [ ] Newsletter rejects empty/invalid email and shows success after valid submit.

## E. Article experience

- [ ] Article title, summary, byline, profile image/initial, affiliation, dates, DOI, and reading time display.
- [ ] Table of contents links to correct sections.
- [ ] Two related-article blocks open valid articles.
- [ ] Share, copy, bookmark, print/PDF actions work.
- [ ] Inline images render in order; maximum-three behaviour remains intact.
- [ ] Footer appears once.

## F. Authentication and role prototype

- [ ] Public reading does not require registration.
- [ ] Submit Article redirects unauthenticated users to login.
- [ ] Author registration creates the intended prototype account.
- [ ] Admin login redirects to Admin dashboard.
- [ ] Role dashboards reject disallowed prototype roles.

## G. Author workspace

- [ ] Overview, Create, My Content, Media, and Profile sidebar routes work.
- [ ] Draft can be saved.
- [ ] Submit for review changes status and redirects correctly.
- [ ] Immediate field/media validation occurs at the relevant step.
- [ ] Profile photo and institution logo upload, replace, remove, and persist.

## H. Accessibility/responsive

- [ ] All interactive controls are keyboard reachable.
- [ ] Visible focus is never clipped.
- [ ] Browser zoom at 200% remains usable.
- [ ] Reduced-motion setting stops/minimizes ticker and hover motion.
- [ ] Test widths: 360, 390, 768, 1024, 1280, 1440, and 1920 px.
