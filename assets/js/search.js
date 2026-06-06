async function runSearch() {
  const box = document.querySelector("[data-search-box]");
  const out = document.querySelector("[data-search-results]");
  if (!box || !out) return;

  const params = new URLSearchParams(location.search);
  box.value = params.get("q") || "";

  let data = [];
  try {
    data = await (await fetch("/assets/data/search-index.json")).json();
  } catch (e) {
    out.innerHTML = "<p>Search index could not be loaded.</p>";
    return;
  }

  function render() {
    const q = box.value.trim().toLowerCase();
    if (!q) {
      out.innerHTML = "<p>Type a word such as tour, ritual, katha, yagya, gallery, Kashi or Sarnath.</p>";
      return;
    }

    const hits = data.filter(i => (i.title + " " + i.category + " " + i.description).toLowerCase().includes(q));
    out.innerHTML = hits.length
      ? hits.map(i => `<a class="list-item" href="${i.url}"><strong>${i.title}</strong><br><span>${i.category}</span><p>${i.description}</p></a>`).join("")
      : "<p>No matching result found. Try a simpler word.</p>";
  }

  box.addEventListener("input", render);
  render();
}
runSearch();
