(() => {
  const input = document.getElementById('searchPageInput');
  const form = document.getElementById('searchPageForm');
  const results = document.getElementById('searchResults');
  if (!input || !form || !results) return;

  const params = new URLSearchParams(location.search);
  const initial = params.get('q') || '';
  input.value = initial;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }

  function score(item, words) {
    const hay = `${item.title} ${item.description} ${item.text}`.toLowerCase();
    return words.reduce((total, word) => total + (hay.includes(word) ? 1 : 0), 0);
  }

  async function runSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '<p class="pp-muted">Enter a word or phrase to search the site.</p>';
      return;
    }
    const words = q.split(/\s+/).filter(Boolean);
    try {
      const response = await fetch('data/search-index.json', {cache: 'no-cache'});
      const items = await response.json();
      const matches = items
        .map((item) => ({...item, _score: score(item, words)}))
        .filter((item) => item._score > 0)
        .sort((a, b) => b._score - a._score || a.title.localeCompare(b.title));

      if (!matches.length) {
        results.innerHTML = `<p class="pp-muted">No results found for <strong>${escapeHtml(query)}</strong>.</p>`;
        return;
      }
      results.innerHTML = `<p class="pp-muted">${matches.length} result${matches.length === 1 ? '' : 's'} found.</p>` + matches.slice(0, 20).map((item) => `
        <article class="search-result">
          <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
          <p>${escapeHtml(item.description || '')}</p>
        </article>
      `).join('');
    } catch (error) {
      results.innerHTML = '<p class="pp-muted">Search could not load right now. Please try again after refreshing.</p>';
      console.error(error);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const q = input.value.trim();
    history.replaceState(null, '', q ? `search.html?q=${encodeURIComponent(q)}` : 'search.html');
    runSearch(q);
  });

  runSearch(initial);
})();
