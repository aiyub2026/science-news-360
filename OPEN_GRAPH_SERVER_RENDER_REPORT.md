# Open Graph Server Render Report — V2.0.13

The article route now produces these values from the server publication record:

- `og:type=article`
- title and description
- canonical article URL
- Science News 360 site name
- HTTPS social image, secure URL, width, height, and alt text
- published and modified timestamps
- author, section, and tags
- Twitter `summary_large_image`
- JSON-LD Article/NewsArticle

Client-side metadata remains only as a compatibility fallback for old browser-only articles that have not yet been synchronized to the server publication store.
