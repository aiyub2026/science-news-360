# Production Deployment Guide

This release is intended to replace the current Science News 360 repository contents while preserving the existing Git repository and Netlify connection.

## Simple update workflow
1. Keep the existing Git repository folder on the Mac as the active project folder.
2. Extract this release into a separate temporary folder.
3. Copy the contents of this release into the existing Git repository folder and choose Replace for changed files. Keep the existing hidden `.git` folder.
4. From Terminal inside the existing Git repository folder, run each command separately:

   `npm install`

   `npm run build`

5. Only after the local build succeeds, run:

   `git add --all`

   `git commit -m "Science News 360 V2.1.0 Production Final"`

   `git push origin main`

6. Netlify will deploy automatically from GitHub.

## Required Netlify environment variables
- `NEXT_PUBLIC_SITE_URL=https://sciencenews360.my.id`
- `SN360_ADMIN_BOOTSTRAP_SECRET=<private random secret>`

## Post-deploy checks
- Homepage loads without sample content.
- Public readers can open published articles without login.
- `/admin/setup` creates only the first Administrator.
- `/admin/login` accepts the created Administrator account.
- Author registration creates a pending application.
- Administrator can approve an author.
- Editorial workflow can move content through review to publication.
- Published article appears on homepage/category/latest pages.
- `/sitemap.xml`, `/robots.txt`, and `/rss.xml` load.
- WhatsApp/Facebook/LinkedIn share metadata is checked after the site is publicly reachable over HTTPS.
