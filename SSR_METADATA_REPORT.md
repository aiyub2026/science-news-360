# SSR Metadata Report — V2.0.13

## Implemented

- Article routes use Next.js `generateMetadata()`.
- Published CMS articles are read by a server-side publication adapter before HTML is returned.
- Open Graph, Twitter Card, canonical, robots, alternate locale, article timestamps, author, category, and tags are generated on the server.
- JSON-LD `Article`/`NewsArticle` is inserted in the initial server response.
- Metadata does not depend on `localStorage`, `useEffect`, or React client state after an article has been synchronized for publication.

## Publication synchronization

When an editor publishes an article, the editorial page posts the final article record to `/api/publications`. The server stores the public article snapshot and returns canonical media URLs. The public route then reads this server-side snapshot.

## Development behavior

With `npm run dev`, synchronized publications are written to `.sn360-data/publications.json`. On Netlify, the same adapter uses the site-wide `sn360-public-content` Netlify Blobs store.
