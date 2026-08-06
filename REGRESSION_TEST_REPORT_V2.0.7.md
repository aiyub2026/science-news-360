# Regression Test Report V2.0.7

## Static Checks
- TypeScript/TSX syntax transpilation: PASS, 0 diagnostics.
- Existing storage keys retained: PASS.
- Existing article routing files retained: PASS.
- Existing category-card CSS retained: PASS.
- Author Media Manager, profile, templates, YouTube and My Content routes retained: PASS.

## Required Mac Runtime Tests
- Author draft remains after upgrade.
- Submitted article appears in Admin Recent Submissions.
- Administrator opens Full Editorial Workspace without Access Denied.
- Full body edit and save creates a new version.
- Slug generator updates canonical URL.
- Status transitions update dashboard counters.
- CSV export downloads real rows.
- Publish status remains available after restart.
