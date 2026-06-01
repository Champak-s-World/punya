(() => {
  function afterIncludes() {
    const year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === current) link.setAttribute('aria-current', 'page');
    });

    const button = document.querySelector('[data-menu-toggle]');
    const nav = document.getElementById('siteNav');
    if (button && nav) {
      button.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(open));
      });
    }
  }

  document.addEventListener('site:includes-ready', afterIncludes);
})();
