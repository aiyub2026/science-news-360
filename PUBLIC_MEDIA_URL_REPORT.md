# Public Media URL Report — V2.0.13

- Base64 thumbnail data is converted to a server-managed public media object during publication.
- Public media is served from `/api/public-media/{key}` without login or cookies.
- Responses include the correct image content type, public cache headers, and cross-origin access.
- Resolver order: article thumbnail → YouTube thumbnail → first content image → `/images/social-default-1200x630.webp`.
- The fallback image is present at 1200 × 630 pixels.
- Blob, Base64, localhost, and local computer paths are rejected as final social image URLs.
