(() => {
  const PAGES = {
    'index.html': 'Home',
    'tours.html': 'Tours',
    'rituals.html': 'Rituals',
    'kathas.html': 'Kathas',
    'katha.html': 'Katha Details',
    'yagyas.html': 'Yagyas',
    'routes.html': 'Routes',
    'route.html': 'Route Details',
    'route-map.html': 'Route Map',
    'maps.html': 'Maps',
    'calendar.html': 'Calendar',
    'occasions.html': 'Occasions',
    'acharyas.html': 'Acharyas',
    'experiences.html': 'Experiences',
    'gallery.html': 'Gallery',
    'videos.html': 'Videos',
    'city-journey.html': 'City Journey',
    'contact.html': 'Contact',
    'search.html': 'Search',
    'sitemap.html': 'Sitemap',
    '404.html': 'Page Not Found'
  };

  function pageName() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function humanTitle(file) {
    return PAGES[file] || file.replace(/\.html$/i, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function setupYear() {
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  function setupActiveNav() {
    const current = pageName();
    document.querySelectorAll('.site-nav a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === current) link.setAttribute('aria-current', 'page');
    });
  }

  function setupMenu() {
    const button = document.querySelector('[data-menu-toggle]');
    const nav = document.getElementById('siteNav');
    if (!button || !nav) return;
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  }

  function setupBreadcrumbs() {
    const holder = document.querySelector('[data-breadcrumbs]');
    if (!holder) return;
    const current = pageName();
    if (current === 'index.html') {
      holder.innerHTML = '<span>Home</span>';
      return;
    }
    holder.innerHTML = `<a href="index.html">Home</a><span aria-hidden="true">/</span><span>${humanTitle(current)}</span>`;
  }

  function setupSearch() {
    document.querySelectorAll('.site-search').forEach((form) => {
      form.addEventListener('submit', (event) => {
        const input = form.querySelector('input[type="search"]');
        const query = input ? input.value.trim() : '';
        if (!query) {
          event.preventDefault();
          input?.focus();
        }
      });
    });
  }

  function afterIncludes() {
    setupYear();
    setupActiveNav();
    setupMenu();
    setupBreadcrumbs();
    setupSearch();
  }

  document.addEventListener('site:includes-ready', afterIncludes);
})();
