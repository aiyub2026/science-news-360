# Data Migration Report V2.0.7

## Source Keys Preserved
- `sn360-cms-content-v201`
- `sn360-cms-audit-v201`
- `sn360-media-assets-v201`
- `sn360-author-profile-v201`
- `sn360-youtube-settings-v1`

V2.0.7 does not rename or delete these keys. Existing drafts, submissions, editorial metadata and version history remain readable.

## New Persistence Layer
An IndexedDB database named `science-news-360` stores a mirrored snapshot under schema version 7. On startup it restores only missing local keys, preventing a populated current store from being overwritten.

## Deduplication
Content continues to be updated by stable `ContentRecord.id`. The submission queue reads the same records used by Author Workspace.

## Recovery
Before destructive manual import, the V2.0.6 backup workflow remains available. V2.0.7 adds automatic browser persistence mirroring but does not remove backup support.
