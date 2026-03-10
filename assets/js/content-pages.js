(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const els = {
    title: $("cpTitle"),
    subtitle: $("cpSubtitle"),
    status: $("cpStatus"),
    langBtn: $("cpLang"),
    query: $("cpQuery"),
    tagFilter: $("cpTagFilter"),
    searchBtn: $("cpSearchBtn"),
    clearBtn: $("cpClearBtn"),
    featured: $("cpFeatured"),
    list: $("cpList"),
  };

  const state = {
    lang: "en",
    collection: "",
    jsonUrl: "",
    items: [],
    filtered: [],
    tagOptions: [],
  };

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function getLangText(value, lang = state.lang) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") return value[lang] || value.en || value.hi || "";
    return "";
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function normalizeItem(item = {}, index = 0) {
    const title =
      item.title ||
      item.name ||
      { en: `Item ${index + 1}`, hi: `Item ${index + 1}` };

    const summary =
      item.summary ||
      item.featuredNote ||
      item.subtitle ||
      { en: "", hi: "" };

    const body =
      item.content ||
      item.description ||
      item.details ||
      { en: "", hi: "" };

    return {
      id: item.id || `item-${index + 1}`,
      title,
      summary,
      body,
      tags: normalizeArray(item.tags),
      images: normalizeArray(item.images),
      featured: Boolean(item.featured),
      featuredRank: Number.isFinite(Number(item.featuredRank))
        ? Number(item.featuredRank)
        : 999,
      ctaText: item.ctaText || { en: "Know More", hi: "और जानें" },
      whatsappText: item.whatsappText || { en: "", hi: "" },
      raw: item,
    };
  }

  function getImage(item) {
    return item.images[0] || "assets/images/placeholder/place.svg";
  }

  function getPageTitle() {
    return getLangText(window.__CP_PAGE_TITLE, state.lang) || "Content";
  }

  function getPageSubtitle() {
    return getLangText(window.__CP_PAGE_SUB, state.lang) || "";
  }

  function getSearchPlaceholder() {
    return state.lang === "hi"
      ? "खोजने के लिए 3+ अक्षर टाइप करें…"
      : "Type 3+ characters to search…";
  }

  function getAllTagsLabel() {
    return state.lang === "hi" ? "सभी टैग" : "All tags";
  }

  function getFeaturedEmptyText() {
    return state.lang === "hi" ? "कोई featured item नहीं मिला।" : "No featured items found.";
  }

  function getListEmptyText() {
    return state.lang === "hi" ? "कोई item नहीं मिला।" : "No items found.";
  }

  function getMoreLabel(expanded) {
    if (state.lang === "hi") return expanded ? "कम" : "और";
    return expanded ? "Less" : "More";
  }

  function getStatusText(count) {
    if (state.lang === "hi") {
      return `${count} आइटम`;
    }
    return `${count} items`;
  }

  function tokenizeItem(item) {
    const title = getLangText(item.title, state.lang);
    const summary = getLangText(item.summary, state.lang);
    const body = getLangText(item.body, state.lang);
    return [title, summary, body, ...item.tags].join(" ").toLowerCase();
  }

  function excerpt(text = "", max = 220) {
    const clean = String(text).trim();
    if (clean.length <= max) return clean;
    const sliced = clean.slice(0, max);
    const lastSpace = sliced.lastIndexOf(" ");
    return (lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim() + "…";
  }

  function renderExpandableBody(fullText, itemId) {
    const safeFull = escapeHtml(fullText);
    const safeShort = escapeHtml(excerpt(fullText, 260));
    const isLong = fullText.trim().length > 260;

    if (!isLong) {
      return `<div class="cp-body">${safeFull}</div>`;
    }

    return `
      <div class="cp-body-wrap" data-expand="${escapeHtml(itemId)}">
        <div class="cp-body cp-body--short">${safeShort}</div>
        <div class="cp-body cp-body--full" hidden>${safeFull}</div>
        <button class="pp-btn pp-btn--ghost cp-more-btn" type="button" data-expand-btn="${escapeHtml(itemId)}">
          ${escapeHtml(getMoreLabel(false))}
        </button>
      </div>
    `;
  }

  function renderCard(item, opts = {}) {
    const title = getLangText(item.title, state.lang);
    const summary = getLangText(item.summary, state.lang);
    const body = getLangText(item.body, state.lang);
    const image = getImage(item);
    const showBody = opts.showBody !== false;
    const summaryText = summary || excerpt(body, 120);

    return `
      <article class="pp-card pp-pad cp-item" data-id="${escapeHtml(item.id)}">
        <div class="cp-item__media">
          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(title)}"
            loading="lazy"
            onerror="this.src='assets/images/placeholder/place.svg'"
            style="width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:16px;"
          />
        </div>

        <div class="cp-item__content" style="margin-top:12px">
          <h3 class="pp-h3" style="margin:0 0 8px">${escapeHtml(title)}</h3>

          ${summaryText ? `<div class="pp-muted" style="margin-bottom:10px">${escapeHtml(summaryText)}</div>` : ""}

          ${item.tags.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">${item.tags.map((tag) => `<span class="pp-chip">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}

          ${showBody ? renderExpandableBody(body, item.id) : ""}
        </div>
      </article>
    `;
  }

  function renderEmpty(message) {
    return `<div class="pp-muted">${escapeHtml(message)}</div>`;
  }

  function sortItems(items) {
    return [...items].sort((a, b) => {
      if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured);
      if (a.featuredRank !== b.featuredRank) return a.featuredRank - b.featuredRank;
      const aTitle = getLangText(a.title, state.lang).toLowerCase();
      const bTitle = getLangText(b.title, state.lang).toLowerCase();
      return aTitle.localeCompare(bTitle);
    });
  }

  function buildTagOptions(items) {
    const set = new Set();
    items.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  function renderTagOptions() {
    if (!els.tagFilter) return;
    const current = els.tagFilter.value || "";
    els.tagFilter.innerHTML = `
      <option value="">${escapeHtml(getAllTagsLabel())}</option>
      ${state.tagOptions.map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag)}</option>`).join("")}
    `;
    els.tagFilter.value = current;
  }

  function updatePageChrome() {
    if (els.title) els.title.textContent = getPageTitle();
    if (els.subtitle) els.subtitle.textContent = getPageSubtitle();
    if (els.query) els.query.placeholder = getSearchPlaceholder();
    if (els.langBtn) els.langBtn.textContent = state.lang === "en" ? "HI" : "EN";
  }

  function applyFilters() {
    const q = (els.query?.value || "").trim().toLowerCase();
    const tag = (els.tagFilter?.value || "").trim().toLowerCase();

    let result = [...state.items];

    if (q.length >= 3) {
      result = result.filter((item) => tokenizeItem(item).includes(q));
    }

    if (tag) {
      result = result.filter((item) => item.tags.some((t) => t.toLowerCase() === tag));
    }

    state.filtered = sortItems(result);
  }

  function render() {
    updatePageChrome();
    applyFilters();

    const featuredItems = state.filtered
      .filter((item) => item.featured)
      .sort((a, b) => a.featuredRank - b.featuredRank);

    if (els.featured) {
      els.featured.innerHTML = featuredItems.length
        ? featuredItems.map((item) => renderCard(item, { showBody: false })).join("")
        : renderEmpty(getFeaturedEmptyText());
    }

    if (els.list) {
      els.list.innerHTML = state.filtered.length
        ? state.filtered.map((item) => renderCard(item, { showBody: true })).join("")
        : renderEmpty(getListEmptyText());
    }

    if (els.status) {
      els.status.textContent = getStatusText(state.filtered.length);
    }
  }

  async function loadData() {
    const body = document.body;
    state.collection = body.dataset.collection || "";
    state.jsonUrl = body.dataset.json || "";

    if (!state.collection || !state.jsonUrl) {
      throw new Error("Missing body[data-collection] or body[data-json].");
    }

    const res = await fetch(state.jsonUrl, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to load ${state.jsonUrl} (${res.status})`);
    }

    const json = await res.json();
    const rawItems = Array.isArray(json[state.collection]) ? json[state.collection] : [];

    state.items = rawItems.map(normalizeItem);
    state.tagOptions = buildTagOptions(state.items);
  }

  function bindEvents() {
    els.searchBtn?.addEventListener("click", render);

    els.clearBtn?.addEventListener("click", () => {
      if (els.query) els.query.value = "";
      if (els.tagFilter) els.tagFilter.value = "";
      render();
    });

    els.query?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") render();
    });

    els.tagFilter?.addEventListener("change", render);

    els.langBtn?.addEventListener("click", () => {
      state.lang = state.lang === "en" ? "hi" : "en";

      if (window.PP_LANG && typeof window.PP_LANG.setLang === "function") {
        window.PP_LANG.setLang(state.lang);
      } else if (window.setLang && typeof window.setLang === "function") {
        window.setLang(state.lang);
      }

      render();
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-expand-btn]");
      if (!btn) return;

      const id = btn.getAttribute("data-expand-btn");
      const wrap = document.querySelector(`[data-expand="${id.replaceAll('"', '&quot;')}"]`);
      if (!wrap) return;

      const shortEl = wrap.querySelector(".cp-body--short");
      const fullEl = wrap.querySelector(".cp-body--full");
      const expanded = !fullEl.hidden;

      fullEl.hidden = expanded;
      shortEl.hidden = !expanded;
      btn.textContent = getMoreLabel(!expanded);
    });

    window.addEventListener("pp:langchange", (e) => {
      const nextLang = e.detail?.lang;
      if (!nextLang || nextLang === state.lang) return;
      state.lang = nextLang;
      render();
    });
  }

  async function init() {
    if (!els.list || !els.featured) {
      console.error("Content page contract is incomplete. Missing #cpList or #cpFeatured.");
      return;
    }

    try {
      const initialLang = window.PP_LANG?.getLang?.() || document.documentElement.lang || "en";
      state.lang = initialLang === "hi" ? "hi" : "en";

      if (els.status) els.status.textContent = state.lang === "hi" ? "लोड हो रहा है…" : "Loading…";

      await loadData();
      renderTagOptions();
      bindEvents();
      render();
    } catch (err) {
      console.error(err);
      if (els.status) {
        els.status.textContent = state.lang === "hi" ? "डेटा लोड नहीं हो सका।" : "Could not load data.";
      }
      if (els.list) {
        els.list.innerHTML = renderEmpty(state.lang === "hi" ? "कृपया JSON फ़ाइल और page setup जाँचें।" : "Please check the JSON file and page setup.");
      }
      if (els.featured) {
        els.featured.innerHTML = "";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
