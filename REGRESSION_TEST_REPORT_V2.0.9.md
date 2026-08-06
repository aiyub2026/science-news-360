# Regression Test Report V2.0.9

## Source checks passed

- Existing CMS storage key retained (`sn360-cms-content-v201`).
- IndexedDB legacy snapshot `cms-state-v207` is imported into schema 9 when available.
- Editing an Accepted or Published article no longer forces it back to Draft.
- My Content provides View, Edit Article, Manage Media, History, Duplicate, Export, Archive, and Delete.
- Thumbnail resolver supports thumbnail, custom video thumbnail, YouTube thumbnail, and first inline image.
- Editorial Workspace provides thumbnail upload, replacement, deletion, alt text, caption, and credit.
- Publish uses confirmation, staged status text, timeout, error feedback, and guaranteed busy-state cleanup.
- Published records emit a content-change event consumed by homepage, category, author, and public-article clients.

## Target-machine tests still required

1. Author creates and submits an article.
2. Editor reviews, approves, and publishes it.
3. Publish completes in under 15 seconds.
4. The article appears on homepage and category pages.
5. Public route opens without 404.
6. Thumbnail survives refresh and server restart.
7. Edit Article and Manage Media retain the existing workflow status.
8. Version history, SEO metadata, references, author profile, and inline media remain intact.
