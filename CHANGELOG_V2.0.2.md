# CHANGELOG V2.0.2

## Author SEO Decoupling
- Removed SEO Score, Focus Keyword, SEO Title, Meta Description, slug controls, Google preview, keyword warnings, EEAT, Discover, schema, OpenGraph and canonical controls from the Author Wizard.
- SEO fields are no longer part of Author validation, Save Draft, step completion, or Submit for Review requirements.
- Step 6 is now `Referensi & Disclosure` and contains references, funding, conflict of interest and AI-use disclosure only.
- Preserved content, media, author, ORCID, reference and disclosure validation.

## Editorial SEO Control
- Added role-protected SEO workspaces for Reviewer, Editor and Administrator.
- Added SEO title, focus keyword, meta description, slug, canonical URL, schema type, OpenGraph, Twitter Card and internal link controls.
- Added editorial SEO score, Google preview, OpenGraph preview, EEAT checklist and Google Discover checklist.
- Added editorial audit entry whenever SEO settings are saved.

## Routes
- `/dashboard/reviewer/seo`
- `/dashboard/editor/seo`
- `/dashboard/admin/seo`
