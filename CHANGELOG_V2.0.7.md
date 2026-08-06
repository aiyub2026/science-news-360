# CHANGELOG V2.0.7

## Added
- Real Admin Dashboard sourced from Author Workspace content records.
- Real Pending Review, Published Today, Scheduled, Total Content, workflow counters, urgent tasks, and recent submissions.
- Search, status filter, CSV export, action menu, and real empty states.
- Full Editorial Workspace for content, editorial notes, fact check, SEO & Discover, version history, audit log, and publication.
- Capability-based access control so Administrator and System Administrator inherit editorial capabilities.
- Automatic slug and canonical URL generator.
- Live SEO checks, Google preview, article preview, controlled Optimize with AI framework.
- IndexedDB-backed Persistence Manager that mirrors the established V2.0.1–V2.0.6 storage keys without resetting them.
- Same-tab data change events so author submissions appear immediately in the admin queue.

## Changed
- Admin dashboard demo records and static counters removed.
- Admin workflow links now open the real submission queue.
- Content save now records actor, role, before/after status and creates a complete version snapshot.
- Existing storage keys remain unchanged to preserve draft and submitted content.

## Data Safety
- No storage key reset.
- Existing `sn360-cms-content-v201`, audit, media, author profile, and YouTube settings are retained.
- IndexedDB mirror is additive and does not overwrite a populated current store.
