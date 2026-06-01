# Punya Yatra Design Update Report

This package updates the simplified Punya Yatra site with a warmer public-facing design and cleaner navigation.

## Added

- Search box in shared navigation: `includes/header.html`
- Search results page: `search.html`
- Search index: `data/search-index.json`
- Search logic: `assets/js/search.js`
- Automatic breadcrumbs in the shared header via `assets/js/main.js`
- Social/contact links in shared footer: WhatsApp, YouTube, Email
- Human sitemap page: `sitemap.html`
- XML sitemap: `sitemap.xml`
- Robots file with sitemap reference: `robots.txt`
- More warmth in the design through updated CSS variables, softer background, warmer footer, refined buttons and cards

## Removed / cleaned

- Removed public-facing text like “Powered by master data: data/master/locations.json, data/master/occasions.json”
- Removed remaining `.git/` repository folder from the ZIP package
- Removed `.lnk` shortcut files if present

## Main files changed

- `includes/header.html`
- `includes/footer.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `assets/js/search.js`
- `search.html`
- `sitemap.html`
- `sitemap.xml`
- `robots.txt`
- `data/search-index.json`

## Notes

Some internal/admin pages still contain code references to JSON files because the pages need those paths to load content. The public-facing “powered by master data” style message has been removed from visitor pages.
