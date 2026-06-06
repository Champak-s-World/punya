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
    if (href === path || (path === "/" && href === "/")) a.classList.add("active");
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
  $$('[data-theme-toggle]').forEach(btn => btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("punya-theme", next);
  }));
}

function navToggle() {
  const h = $(".site-header"), btn = $(".nav-toggle");
  if (!btn || !h) return;
  btn.addEventListener("click", () => {
    const open = h.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
}

function year() {
  const y = $("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
}

async function renderHomeCards() {
  const boxes = $$('[data-content-cards]');
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
  const form = $('[data-home-search]');
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = form.querySelector("input").value.trim();
    location.href = "/search/?q=" + encodeURIComponent(q);
  });
}

const plannerSteps = [
  { key: "purpose", title: "What is the main purpose?", help: "Choose the closest reason. You can refine this later.", type: "radio", options: ["Kashi darshan", "Family pilgrimage", "Ganga aarti and ghats", "Ritual or puja", "Sarnath with Varanasi", "Not sure yet"] },
  { key: "date", title: "When are you planning to come?", help: "Approximate dates are fine at this stage.", type: "fields", fields: [
    { name: "arrival", label: "Arrival date", input: "date" },
    { name: "days", label: "Number of days", input: "select", options: ["1 day", "2 days", "3 days", "4+ days", "Not decided"] }
  ]},
  { key: "group", title: "Who is travelling?", help: "This helps us suggest a comfortable pace.", type: "fields", fields: [
    { name: "people", label: "Number of people", input: "number", min: "1", placeholder: "Example: 4" },
    { name: "groupType", label: "Group type", input: "select", options: ["Family", "Senior citizens", "Couple", "Solo traveller", "Devotional group", "Mixed group"] }
  ]},
  { key: "pace", title: "What pace do you prefer?", help: "Varanasi is best enjoyed at the right speed.", type: "radio", options: ["Slow and comfortable", "Balanced", "Cover more places", "Senior-friendly", "Child-friendly"] },
  { key: "places", title: "Places you want to include", help: "Select all that matter to you.", type: "checkbox", options: ["Kashi Vishwanath", "Dashashwamedh Ghat", "Ganga Aarti", "Assi Ghat", "Kal Bhairav", "Annapurna Temple", "Sarnath", "Boat ride", "Local food stop"] },
  { key: "services", title: "Any ritual or special service?", help: "Leave blank if this is only a tour.", type: "checkbox", options: ["Rudrabhishek", "Griha puja", "Sankalp", "Bhagwat Katha", "Ram Katha", "Yagya", "Guide only", "Transport help"] },
  { key: "contact", title: "How should we contact you?", help: "Add enough details for a helpful first reply.", type: "fields", fields: [
    { name: "name", label: "Name", input: "text", placeholder: "Your name" },
    { name: "phone", label: "Phone or WhatsApp", input: "tel", placeholder: "+91..." },
    { name: "notes", label: "Extra notes", input: "textarea", placeholder: "Hotel area, mobility needs, preferred language, budget range, or anything important." }
  ]},
  { key: "summary", title: "Your tour planning summary", help: "Send this on WhatsApp or copy it for email.", type: "summary" }
];

function getWizardMessage(state) {
  const get = key => state[key] || "Not specified";
  const places = (state.places || []).join(", ") || "Not specified";
  const services = (state.services || []).join(", ") || "Not specified";
  return [
    "Namaste Punya Yatra, I want help planning a Varanasi tour.",
    "",
    "Purpose: " + get("purpose"),
    "Arrival date: " + get("arrival"),
    "Trip length: " + get("days"),
    "People: " + get("people"),
    "Group type: " + get("groupType"),
    "Pace: " + get("pace"),
    "Places: " + places,
    "Services: " + services,
    "Name: " + get("name"),
    "Phone/WhatsApp: " + get("phone"),
    "Notes: " + get("notes")
  ].join("\n");
}

function buildPlanningWizard(container, options = {}) {
  if (!container || container.dataset.wizardReady === "true") return;
  container.dataset.wizardReady = "true";
  let index = 0;
  const state = {};
  const compact = Boolean(options.compact);
  container.classList.add("wizard");

  function saveCurrent() {
    const step = plannerSteps[index];
    if (!step) return;
    if (step.type === "radio") {
      const checked = container.querySelector(`input[name="${step.key}"]:checked`);
      if (checked) state[step.key] = checked.value;
    } else if (step.type === "checkbox") {
      state[step.key] = Array.from(container.querySelectorAll(`input[name="${step.key}"]:checked`)).map(i => i.value);
    } else if (step.type === "fields") {
      step.fields.forEach(field => {
        const el = container.querySelector(`[name="${field.name}"]`);
        if (el) state[field.name] = el.value.trim();
      });
    }
  }

  function fieldMarkup(field) {
    const value = state[field.name] || "";
    if (field.input === "select") {
      return `<label>${field.label}<select name="${field.name}">${field.options.map(o => `<option value="${o}" ${value === o ? "selected" : ""}>${o}</option>`).join("")}</select></label>`;
    }
    if (field.input === "textarea") return `<label>${field.label}<textarea name="${field.name}" placeholder="${field.placeholder || ""}">${value}</textarea></label>`;
    return `<label>${field.label}<input type="${field.input}" name="${field.name}" value="${value}" min="${field.min || ""}" placeholder="${field.placeholder || ""}"></label>`;
  }

  function bodyMarkup(step) {
    if (step.type === "radio") {
      return `<div class="wizard-options two">${step.options.map(o => `<label class="wizard-option"><input type="radio" name="${step.key}" value="${o}" ${state[step.key] === o ? "checked" : ""}><span>${o}</span></label>`).join("")}</div>`;
    }
    if (step.type === "checkbox") {
      const selected = state[step.key] || [];
      return `<div class="wizard-options two">${step.options.map(o => `<label class="wizard-option"><input type="checkbox" name="${step.key}" value="${o}" ${selected.includes(o) ? "checked" : ""}><span>${o}</span></label>`).join("")}</div>`;
    }
    if (step.type === "fields") return `<div class="wizard-fields">${step.fields.map(fieldMarkup).join("")}</div>`;
    const message = getWizardMessage(state);
    const encoded = encodeURIComponent(message);
    const rows = [
      ["Purpose", state.purpose], ["Arrival", state.arrival], ["Days", state.days], ["People", state.people], ["Group", state.groupType], ["Pace", state.pace], ["Places", (state.places || []).join(", ")], ["Services", (state.services || []).join(", ")], ["Name", state.name], ["Phone", state.phone], ["Notes", state.notes]
    ];
    return `<div class="wizard-summary">${rows.map(([k,v]) => `<div class="wizard-summary-row"><strong>${k}</strong><span>${v || "Not specified"}</span></div>`).join("")}<a class="btn primary" href="https://wa.me/919335874326?text=${encoded}" target="_blank" rel="noopener">Send on WhatsApp</a><button class="btn" type="button" data-copy-plan>Copy summary</button><p class="wizard-copy-status" data-copy-status></p></div>`;
  }

  function render() {
    const step = plannerSteps[index];
    const pct = Math.round(((index + 1) / plannerSteps.length) * 100);
    container.innerHTML = `
      <div class="wizard-head"><div><h2 class="wizard-title">${compact ? "Tour planner" : "Varanasi tour planning wizard"}</h2></div><div class="wizard-count">Step ${index + 1} of ${plannerSteps.length}</div></div>
      <div class="wizard-progress"><span style="width:${pct}%"></span></div>
      <div class="wizard-body"><h3>${step.title}</h3><p>${step.help}</p>${bodyMarkup(step)}</div>
      <div class="wizard-actions"><button class="btn small" type="button" data-wizard-back ${index === 0 ? "disabled" : ""}>Back</button><div class="right">${index < plannerSteps.length - 1 ? `<button class="btn primary small" type="button" data-wizard-next>Next</button>` : `<button class="btn primary small" type="button" data-wizard-restart>Start again</button>`}</div></div>`;
    const next = container.querySelector("[data-wizard-next]");
    const back = container.querySelector("[data-wizard-back]");
    const restart = container.querySelector("[data-wizard-restart]");
    const copy = container.querySelector("[data-copy-plan]");
    if (next) next.addEventListener("click", () => { saveCurrent(); index = Math.min(plannerSteps.length - 1, index + 1); render(); });
    if (back) back.addEventListener("click", () => { saveCurrent(); index = Math.max(0, index - 1); render(); });
    if (restart) restart.addEventListener("click", () => { Object.keys(state).forEach(k => delete state[k]); index = 0; render(); });
    if (copy) copy.addEventListener("click", async () => {
      const status = container.querySelector("[data-copy-status]");
      try { await navigator.clipboard.writeText(getWizardMessage(state)); if (status) status.textContent = "Summary copied."; }
      catch (err) { if (status) status.textContent = "Could not copy automatically. Select and copy the WhatsApp message after opening it."; }
    });
  }
  render();
}

function initPageWizards() {
  $$('[data-planning-wizard]').forEach(el => buildPlanningWizard(el, { compact: false }));
}

function chatbot() {
  if ($('.chatbot-launcher')) return;
  const panel = document.createElement('section');
  panel.className = 'chatbot-panel';
  panel.setAttribute('aria-label', 'Punya Yatra tour planning chatbot');
  panel.innerHTML = `<div class="chatbot-head"><div><h2>Punya Yatra helper</h2><p>Plan a Varanasi tour step by step</p></div><button class="chatbot-close" type="button" aria-label="Close chatbot">×</button></div><div class="chatbot-body"><p class="chatbot-note">Answer a few simple questions. The final step creates a WhatsApp-ready tour request.</p><div data-chatbot-wizard></div></div>`;
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'chatbot-launcher';
  launcher.textContent = 'Plan tour';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'punya-chatbot-panel');
  panel.id = 'punya-chatbot-panel';
  document.body.appendChild(panel);
  document.body.appendChild(launcher);
  const close = panel.querySelector('.chatbot-close');
  const wizardBox = panel.querySelector('[data-chatbot-wizard]');
  buildPlanningWizard(wizardBox, { compact: true });
  function openPanel() { panel.classList.add('open'); launcher.setAttribute('aria-expanded', 'true'); const first = panel.querySelector('input,select,textarea,button,a'); if (first) setTimeout(() => first.focus(), 50); }
  function closePanel() { panel.classList.remove('open'); launcher.setAttribute('aria-expanded', 'false'); launcher.focus(); }
  function togglePanel() { panel.classList.contains('open') ? closePanel() : openPanel(); }
  launcher.addEventListener('click', togglePanel);
  close.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) closePanel(); });
  $$('[data-open-chatbot]').forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); openPanel(); }));
}

function init() {
  activateNav();
  breadcrumbs();
  theme();
  navToggle();
  year();
  renderHomeCards();
  homeSearch();
  initPageWizards();
  chatbot();
}

Promise.all($$('[data-include]').map(includePart)).then(init);
