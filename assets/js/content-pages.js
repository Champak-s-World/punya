async function loadRituals() {
  const res = await fetch("rituals.json");
  const data = await res.json();
  return data.rituals || [];
}

function normalize(item = {}) {
  return {
    id: item.id || "",
    featured: item.featured || false,
    featuredRank: item.featuredRank || 0,
    title: {
      en: item.title?.en || "",
      hi: item.title?.hi || "",
    },
    content: {
      en: item.content?.en || "",
      hi: item.content?.hi || "",
    },
    images: item.images || [],
  };
}

function getText(obj, lang) {
  return obj?.[lang] || obj?.en || "";
}

function renderExpandable(text, id) {
  const short = text.slice(0, 300);
  const long = text;

  if (text.length <= 300) {
    return `<p>${text}</p>`;
  }

  return `
  <div class="expandable">
    <p id="short-${id}">${short}...</p>
    <p id="full-${id}" style="display:none">${long}</p>

    <button onclick="toggleText('${id}')" class="more-btn">
      More
    </button>
  </div>
  `;
}

function toggleText(id) {
  const short = document.getElementById("short-" + id);
  const full = document.getElementById("full-" + id);
  const btn = short.parentElement.querySelector("button");

  if (full.style.display === "none") {
    short.style.display = "none";
    full.style.display = "block";
    btn.innerText = "Less";
  } else {
    short.style.display = "block";
    full.style.display = "none";
    btn.innerText = "More";
  }
}

function renderRitual(item, lang) {
  const title = getText(item.title, lang);
  const content = getText(item.content, lang);

  return `
  <div class="ritual-card">

      <h3>${title}</h3>

      ${renderExpandable(content, item.id)}

  </div>
  `;
}

async function initRituals(lang = "en") {
  const rituals = await loadRituals();

  const container = document.getElementById("rituals-container");
alert(container);
  const html = rituals.map((r) => renderRitual(normalize(r), lang)).join("");

  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  initRituals("en");
});
