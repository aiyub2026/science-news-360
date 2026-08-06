# Science News 360 V2.0.3

- Fixed browser quota failures caused by duplicating base64 media in the Media Library index.
- Media Library now stores lightweight metadata only; the active article draft keeps the optimized preview.
- Added automatic quota recovery by clearing legacy duplicated media indexes and trimming old version/audit history.
- Reduced optimized image targets to approximately 420 KB for thumbnails, 300 KB for inline images, and 180 KB for profile images.
- Added iterative WebP compression and downscaling.
- Fixed pasted Word/web content appearing entirely bold by removing imported font-weight/font-size styles.
- Added explicit normal-weight body typography while preserving intentional bold text and headings.
