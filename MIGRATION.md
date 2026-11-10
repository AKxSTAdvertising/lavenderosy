# Lavenderosy redesign — content-safe migration

This branch is a **design foundation**, not a production replacement.

## Preservation rules
- Do not overwrite or remove the current WordPress website.
- Export WordPress content (Tools → Export → All content) and back up uploads, theme files, database, SEO metadata and redirects.
- Preserve post/page body, media, alt text, titles, categories, tags, publication dates, authors, comments, permalinks, canonical metadata and existing legal text.
- Populate site-data.js from verified exports only; never invent or silently rewrite articles.
- Replace placeholder category links with verified destinations.
- Add article and page templates, routing, sitemap, redirects, search and newsletter integration before production launch.
- Compare URL inventory and article counts before/after; validate 301 redirects if any URLs must change.
- Verify accessibility, responsive design, images, structured data and performance in staging.
- Switch domain only after user approval and backup/rollback plan.

## Preview
Open index.html locally or deploy this branch to a preview environment. Newsletter intentionally disabled until provider is known.
