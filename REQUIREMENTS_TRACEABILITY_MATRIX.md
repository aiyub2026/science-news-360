# Science News 360 V2.0 — Requirements Traceability Matrix

| Requirement | UI | Route | Data | Validation | Test | V2.0.0 status |
|---|---|---|---|---|---|---|
| Public header/footer single shell | Yes | Locale layout | Static | Import audit | Regression | Implemented |
| Latest content page | Yes | `/[locale]/latest` | Article catalogue | Route render | Route test | Implemented |
| Topic discovery | Yes | `/[locale]/topic/[slug]` | Article catalogue | Dynamic params | Route test | Implemented |
| Fixed LIVE ticker | Yes | Homepage | Static prototype | Overflow rules | Desktop/mobile | Implemented |
| Hero bookmark | Yes | Homepage | Client state | Toggle state | Interaction | Implemented prototype |
| WhatsApp share | Yes | Homepage/article | URL | Encoded URL | Link test | Implemented |
| Video CTA | Yes | `/[locale]/video` | Video prototype | Route exists | Link test | Implemented |
| Featured author links | Yes | Author routes | Author catalogue | Slug route | Link test | Implemented |
| Newsletter action | Yes | Homepage | Client prototype | Required email | Interaction | Prototype explicit |
| Article reading experience | Yes | Article route | Article catalogue | Not-found guard | Render test | Retained |
| Author CMS wizard | Yes | Dashboard author | localStorage prototype | Step validation | Workflow test | Retained; Tahap 1 |
| Author media/profile | Yes | Dashboard author | localStorage prototype | File checks | Upload test | Retained; Tahap 1 |
| Admin command center | Yes | Dashboard admin | Demo data | Role guard prototype | Role test | Retained; Tahap 2 |
| Accessible focus/reduced motion | Foundation | Global | N/A | CSS | Keyboard/motion | Implemented foundation |
| Production authentication | No | Planned | PostgreSQL/API | Server-side | Security E2E | Future |
| Production media storage | No | Planned | Object storage | Server-side | Upload E2E | Future |
| Search engine | Overlay only | Planned | Search index | Query validation | Search E2E | Future |
| Analytics | Dashboard placeholders removed from nav | Planned | Analytics store | Event validation | Metrics test | Tahap 5 |
