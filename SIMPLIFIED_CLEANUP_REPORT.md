# Punya Yatra simplified cleanup

This package starts the simplified design refactor.

## Done

- Removed `.git/` from the public package.
- Removed Windows shortcut `.lnk` files.
- Moved MP4 files out of `assets/images/` into `assets/videos/varanasi/`.
- Added a cleaner shared header: `includes/header.html`.
- Added a cleaner shared footer: `includes/footer.html`.
- Replaced the include loader with `assets/js/includes.js`.
- Added `assets/js/main.js` for mobile menu, active link and footer year.
- Added a simplified global stylesheet: `assets/css/style.css`.
- Added a brand logo: `assets/images/brand/logo.svg`.
- Added `assets/README.md` explaining the intended asset structure.
- Updated HTML pages to load the simplified stylesheet and include scripts.

## Next suggested phase

- Convert individual pages one by one to simpler page sections.
- Remove older duplicate files after confirming no page needs them: `pp-nav.js`, `pp-theme.js`, `theme.js`, duplicate page CSS, and old include helpers.
- Rename WhatsApp media files to short SEO-friendly names.
- Replace remaining placeholder data with final business content.
