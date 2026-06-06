const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function siteUrl(path) {
  if (!path) return "/";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return "/" + path.replace(/^\/+/, "");
}

async function includePart(el) {
  const file = el.dataset.include;
  if (!file) return;
  const res = await fetch(siteUrl(file));
  el.outerHTML = await res.text();
}

function currentPath() {
  let p = location.pathname;
  if (!p.endsWith("/")) p += "/";
  return p;
}

function titleFromPath(path) {
  const clean = path.replace(/^\/|\/$/g, "");
  if (!clean) return "Home";
  return clean.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function activateNav() {
  const path = currentPath();
  $$(".site-nav a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href === path || (path === "/" && href === "/")) {
      a.classList.add("active");
    }
  });
}

function breadcrumbs() {
  const b = $(".breadcrumbs");
  if (!b) return;
  const path = currentPath();
  const title = titleFromPath(path);
  b.innerHTML = path === "/" ? "Home" : `<a href="/">Home</a> / <span>${title}</span>`;
}

function theme() {
  const saved = localStorage.getItem("punya-theme") || "light";
  document.documentElement.dataset.theme = saved;
  $$("[data-theme-toggle]").forEach(btn => btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("punya-theme", next);
  }));
}

function lang() {
  const saved = localStorage.getItem("punya-lang") || "en";
  document.documentElement.lang = saved;
  $$("[data-lang-toggle]").forEach(btn => {
    btn.textContent = saved === "hi" ? "Hindi / English" : "English / Hindi";
    btn.addEventListener("click", () => {
      const next = document.documentElement.lang === "hi" ? "en" : "hi";
      document.documentElement.lang = next;
      localStorage.setItem("punya-lang", next);
      btn.textContent = next === "hi" ? "Hindi / English" : "English / Hindi";
    });
  });
}

function navToggle() {
  const h = $(".site-header"), btn = $(".nav-toggle");
  if (btn && h) btn.addEventListener("click", () => {
    const open = h.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", String(open));
  });
}

function year() {
  const y = $("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
}

async function renderHomeCards() {
  const boxes = $$("[data-content-cards]");
  if (!boxes.length) return;
  const res = await fetch("/assets/data/content.json");
  const data = await res.json();
  boxes.forEach(box => {
    const cat = box.dataset.contentCards;
    const limit = Number(box.dataset.limit || 3);
    const list = data.items.filter(i => !cat || i.category === cat).slice(0, limit);
    box.innerHTML = list.map(i => `<article class="card"><img src="${i.image}" alt="${i.title}"><h3>${i.title}</h3><p>${i.description}</p><a class="btn" href="${i.url}">View details</a></article>`).join("");
  });
}

function homeSearch() {
  const form = $("[data-home-search]");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = form.querySelector("input").value.trim();
    location.href = "/search/?q=" + encodeURIComponent(q);
  });
}

function init() {
  activateNav();
  breadcrumbs();
  theme();
  lang();
  navToggle();
  year();
  renderHomeCards();
  homeSearch();
}

Promise.all($$("[data-include]").map(includePart)).then(init);
