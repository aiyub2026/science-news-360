# Science News 360 V2.0.4 — Article Routing Compatibility Fix

## Fixed
- Category cards now use the same canonical article dataset as the article detail route.
- All article titles and thumbnails on category pages point to valid detail pages.
- Added backward-compatible aliases for legacy slugs including `ai-university-research`.
- Existing bookmarked or previously generated legacy links now resolve to the corresponding canonical article.
- Category headings and supporting text now follow the active locale.

## Regression protection
- Homepage, Latest, Topic, Learning Materials, related articles, and article detail routes continue to use `getAllArticles()`.
- Canonical metadata remains attached to the canonical article slug.
