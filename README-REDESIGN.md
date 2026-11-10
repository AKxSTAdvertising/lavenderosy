# Lavenderosy — editorial website rebuild

Branch: redesign-foundation. This is a complete responsive frontend **framework**, not yet a content-complete production migration.

## Implemented
- Home, journal with search and pagination, 7 categories, article detail routes, imported pages, 404, accessible mobile navigation and responsive styling.
- WordPress WXR XML importer preserving published article/page HTML, titles, publication dates, authors, category slugs, and existing permalink paths.
- Netlify fallback routing.
- No fabricated articles, policies, testimonials or contact details.

## To finish content migration
1. In WordPress: Tools > Export > All content > Download Export File.
2. Run `python3 scripts/import_wordpress.py export.xml` and commit the generated `content.js` plus `migration-report.json`.
3. Back up WordPress database and `wp-content/uploads`. Keep original media accessible or migrate media URLs and alt text.
4. Verify every original URL, page, SEO plugin meta description/canonical, redirects, categories, tags, comments, contact form, newsletter and legal policies.
5. Preview with Netlify using `app.html` as the app shell. The root `index.html` remains the earlier design prototype; before deployment replace it with `app.html` and test all routes.
6. Only switch the domain after content and functional parity checks. Current WordPress site is unchanged.

## Limitations
A public website is not a reliable source for **all** posts, drafts, media, metadata and private settings. Full preservation requires a verified export. The original contact form and newsletter are intentionally not functional until their provider settings are supplied. Article HTML from WordPress is trusted input; only import your own export.
