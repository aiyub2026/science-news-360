# Science News 360 V2.0.6

- Added portable JSON Export Backup and Import Backup to My Content.
- Backup includes content, editorial status, version history, author profile, editorial SEO data, audit log, YouTube settings, and media metadata.
- Added restore preview with counts by content status.
- Added Merge and Replace restore modes with explicit confirmation.
- Added automatic migration from known legacy localStorage keys on the same browser origin.
- Added restore events so My Content refreshes immediately after import.

## Browser security limitation
Automatic reading across different localhost ports is not possible because browsers isolate localStorage by origin. Export from the old port and import into the new port is the supported migration path.
