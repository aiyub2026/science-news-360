# Science News 360 V2.1.0 Production Final

## Production cleanup
- Removed bundled demo stories, authors, videos, statistics, accounts and sample publication records.
- Public pages now render only real published records from the production publication store.
- Removed default administrator credentials and public administrator registration.

## Authentication and roles
- Readers browse public content without registration.
- Public registration creates a pending contributor application.
- Administrators approve contributors and assign editorial roles.
- First administrator uses a one-time private bootstrap flow protected by `SN360_ADMIN_BOOTSTRAP_SECRET`.
- Passwords are hashed with scrypt and sessions use secure HttpOnly cookies.

## Editorial workflow
- Preserved Draft → Submitted → Review → Revision → Accepted → Scheduled → Published → Archived lifecycle.
- Publication endpoint is protected by server-side role checks.
- Shared CMS storage is available for authenticated editorial users.
- Version history, audit events, media metadata, SEO metadata and editorial notes remain part of content records.

## Homepage and analytics
- Added real visitor counters, active visitors, 14-day visitor chart, digital clock and calendar.
- Removed fake dashboard and homepage statistics.
- Trending content is derived from real published content when available.

## Branding
- Added final 360 + minimal orbit identity assets for header, dashboard, login, footer, favicon and social sharing.
- Production social fallback image remains 1200 × 630.

## SEO and sharing
- Production canonical base is `https://sciencenews360.my.id`.
- Preserved dynamic Open Graph, Twitter Card, JSON-LD, sitemap, robots.txt and RSS output.
- Published article routes use server-readable publication data for crawler metadata.

## Security
- Added/retained RBAC, secure session cookies, password hashing, origin protection, rate limiting, audit logging and security headers.
- Sensitive publishing and administration endpoints require authenticated roles.

## Editorial Intelligence
- Added editor-only quality checks for article depth, headings, references, DOI presence, disclosures, SEO, focus keyword and image accessibility.
- Recommendations never publish content automatically.
