(() => {
  async function includePart(node) {
    const url = node.getAttribute('data-include');
    if (!url) return;
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      node.innerHTML = await response.text();
    } catch (error) {
      node.innerHTML = `<div class="site-include-error">Could not load ${url}</div>`;
      console.error('Include failed:', url, error);
    }
  }

  async function loadIncludes() {
    const nodes = [...document.querySelectorAll('[data-include]')];
    await Promise.all(nodes.map(includePart));
    document.dispatchEvent(new CustomEvent('site:includes-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
  } else {
    loadIncludes();
  }
})();
