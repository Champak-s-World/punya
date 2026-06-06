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

function chatbotWizard() {
  const widget = $("[data-chatbot-widget]");
  if (!widget) return;
  const toggle = $("[data-chatbot-toggle]", widget);
  const panel = $("[data-chatbot-panel]", widget);
  const close = $("[data-chatbot-close]", widget);
  const form = $("[data-tour-wizard]", widget);
  if (!toggle || !panel || !form) return;

  const steps = $$("[data-wizard-step]", form);
  const prev = $("[data-wizard-prev]", form);
  const next = $("[data-wizard-next]", form);
  const progress = $("[data-wizard-progress]", form);
  const summary = $("[data-wizard-summary]", form);
  const whatsapp = $("[data-wizard-whatsapp]", form);
  let step = 0;

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) window.setTimeout(() => {
      const first = $("input,select,textarea,button,a", panel);
      if (first) first.focus({ preventScroll: true });
    }, 30);
  }

  function data() {
    const fd = new FormData(form);
    return {
      date: fd.get("date") || "not fixed yet",
      days: fd.get("days") || "1 day",
      people: fd.get("people") || "2",
      group: fd.get("group") || "family",
      purpose: fd.get("purpose") || "Kashi darshan",
      pace: fd.get("pace") || "balanced",
      note: (fd.get("note") || "").trim()
    };
  }

  function planText(d) {
    const note = d.note ? `\nSpecial note: ${d.note}` : "";
    return `Punya Yatra tour request:\nDate: ${d.date}\nDuration: ${d.days}\nPeople: ${d.people}\nGroup: ${d.group}\nPurpose: ${d.purpose}\nPace: ${d.pace}${note}`;
  }

  function renderSummary() {
    const d = data();
    summary.innerHTML = `
      <strong>Suggested starting plan</strong>
      <ul>
        <li>${d.days} Varanasi visit for ${d.people} ${d.group} traveller(s).</li>
        <li>Main focus: ${d.purpose}.</li>
        <li>Recommended pace: ${d.pace}.</li>
        <li>Start with Kashi Vishwanath, nearby ghats, Ganga aarti, and add Sarnath if time allows.</li>
      </ul>
      <span>Use the WhatsApp button to send these details for final coordination.</span>`;
    whatsapp.href = "https://wa.me/919335874326?text=" + encodeURIComponent(planText(d));
  }

  function showStep(index) {
    step = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((item, i) => item.hidden = i !== step);
    if (progress) progress.style.width = (((step + 1) / steps.length) * 100) + "%";
    if (prev) prev.disabled = step === 0;
    if (next) next.textContent = step === steps.length - 2 ? "Create plan" : (step === steps.length - 1 ? "Edit details" : "Next");
    if (whatsapp) whatsapp.classList.toggle("is-visible", step === steps.length - 1);
    if (step === steps.length - 1) renderSummary();
  }

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  if (close) close.addEventListener("click", () => setOpen(false));
  if (prev) prev.addEventListener("click", () => showStep(step - 1));
  if (next) next.addEventListener("click", () => {
    if (step === steps.length - 1) showStep(0);
    else showStep(step + 1);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
  showStep(0);
}

function init() {
  activateNav();
  breadcrumbs();
  theme();
  navToggle();
  year();
  renderHomeCards();
  homeSearch();
  chatbotWizard();
}

Promise.all($$("[data-include]").map(includePart)).then(init);
