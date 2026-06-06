# Punya Yatra manageable static site

This rebuild keeps the richer old-style home page visually, but removes the heavy old machinery.

## Structure

- `index.html` rich home page
- `includes/header.html` and `includes/footer.html` shared layout
- `assets/css/style.css` one stylesheet
- `assets/js/main.js` shared behavior
- `assets/js/search.js` search page behavior
- `assets/data/content.json` editable content cards
- `assets/data/search-index.json` search data
- `sitemap.html`, `sitemap.xml`, `robots.txt` for navigation and SEO

No admin pages, duplicate scripts, `.git`, videos, shortcut files, or report files are included.


## Folder based page structure

Public pages now use clean folder URLs. For example, `tours/index.html` is available as `/tours/`, `rituals/index.html` as `/rituals/`, and `contact/index.html` as `/contact/`. Shared header/footer links and search URLs have been updated accordingly.


Added: `plan/index.html` contains the multi-step Varanasi tour planning wizard. The bottom-right chatbot uses the same wizard logic from `assets/js/main.js`.
