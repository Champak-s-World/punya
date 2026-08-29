# Punya Yatra

Complete static booking website for `punyayatra.in`, designed for GitHub Pages.

## Publish

Upload all files and folders to the root of the `Champak-s-World/punya` repository. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.

## Structure

- `index.html` — connected homepage
- `tours/index.html` — complete tour catalogue
- `stories/index.html` — slideshow, music and Kashi Yatra stories
- `book/index.html` — direct booking form
- `includes/header.html` and `includes/footer.html` — shared site-wide includes
- `assets/css/` — separated visual, gallery, page and premium styles
- `assets/js/` — include loader, booking, slideshow, speech and 3D animation scripts

The shared HTML includes are loaded with `assets/js/includes.js`. Preview through a local web server or GitHub Pages; browser security prevents `fetch()` includes from working when an HTML file is opened directly from a device folder.

## Features

- Direct pilgrimage-tour booking through WhatsApp
- Six tour packages with details, inclusions, schedules and prices
- Responsive mobile and desktop presentation
- Contextual English/Hindi speech synthesis
- Cinematic, swipe-enabled Kashi story slideshow
- User-controlled Bhairavi background music
- Contextual links to Kashi Yatra blog guides and stories
- Premium indigo, coral and antique-gold visual identity
- 3D pointer-responsive tour cards and layered glass surfaces
- Scroll-triggered reveals, cinematic depth and reduced-motion support
- Search-engine metadata and accessible navigation
- No affiliate redirects

Update the WhatsApp number in `index.html` and `assets/js/booking.js` if the booking contact changes.
