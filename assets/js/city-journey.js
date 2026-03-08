(function(){
  'use strict';

  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const state = {
    flat: [],
    filterCity: 'all',
    query: '',
    selectedId: null,
    selectedMediaIndex: 0,
  };

  const cityVideoMap = {
    varanasi: [
      'assets/images/varanasi/WhatsApp Video 2026-02-02 at 6.54.01 PM.mp4',
      'assets/images/varanasi/WhatsApp Video 2026-02-02 at 6.54.02 PM.mp4'
    ]
  };

  function t(v){ return window.PP_LANG && PP_LANG.t ? PP_LANG.t(v) : (typeof v === 'string' ? v : (v && (v.en || v.hi)) || ''); }
  function currentLang(){ return window.PP_LANG && PP_LANG.getLang ? PP_LANG.getLang() : 'en'; }
  function isVideo(path){ return /\.(mp4|webm|mov)$/i.test(path || ''); }
  function escapeHtml(str){ return String(str || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  function enrichPlace(city, place){
    const images = Array.isArray(place.images) ? place.images.slice() : [];
    const videos = Array.isArray(place.videos) ? place.videos.slice() : [];
    const fallbackVideos = cityVideoMap[city.id] || [];
    if (!videos.length && fallbackVideos.length && city.id === 'varanasi') {
      if (/kashi|champak_roy/.test(place.id)) videos.push(fallbackVideos[0]);
      else if (/assi|dashashwamedh|manikarnika|sarnath/.test(place.id)) videos.push(fallbackVideos[1]);
      else videos.push(fallbackVideos[0]);
    }
    const media = images.map(src=>({type:'image',src})).concat(videos.map(src=>({type:'video',src})));
    return {
      ...place,
      cityId: city.id,
      cityName: t(city.name),
      search: [t(place.name), t(place.description), ...(place.tags || []), t(city.name)].join(' ').toLowerCase(),
      media,
    };
  }

  async function load(){
    const res = await fetch('data/master/locations.json', {cache:'no-store'});
    const data = await res.json();
    state.flat = (data.cities || []).flatMap(city => (city.places || []).map(p => enrichPlace(city, p)));
    renderCityChips(data.cities || []);
    bindEvents();
    restoreInitialSelection();
    renderList();
    renderView();
  }

  function restoreInitialSelection(){
    const fromUrl = new URLSearchParams(location.search).get('place');
    const initial = state.flat.find(p => p.id === fromUrl) || state.flat[0] || null;
    state.selectedId = initial ? initial.id : null;
  }

  function bindEvents(){
    const search = $('#citySearch');
    const prev = $('#cityPrev');
    const next = $('#cityNext');
    if (search) search.addEventListener('input', ()=>{ state.query = search.value.trim().toLowerCase(); renderList(); ensureValidSelection(); renderView(); });
    if (prev) prev.addEventListener('click', ()=>stepSelection(-1));
    if (next) next.addEventListener('click', ()=>stepSelection(1));
    window.addEventListener('pp:langchange', ()=>{ rerenderForLanguage(); });
  }

  function rerenderForLanguage(){
    state.flat = state.flat.map(item => ({ ...item, cityName: item.cityId ? item.cityName : item.cityName, search: [t(item.name), t(item.description), ...(item.tags || []), item.cityName].join(' ').toLowerCase() }));
    renderList();
    renderView();
    updateStaticText();
  }

  function updateStaticText(){
    const selected = getSelected();
    if (selected) document.title = `${t(selected.name)} | Move Through the City`;
  }

  function renderCityChips(cities){
    const wrap = $('#cityChips');
    if (!wrap) return;
    wrap.innerHTML = '';
    const all = document.createElement('button');
    all.className = 'city-chip active';
    all.type = 'button';
    all.textContent = 'All Cities';
    all.dataset.city = 'all';
    wrap.appendChild(all);
    cities.forEach(city=>{
      const b = document.createElement('button');
      b.className = 'city-chip';
      b.type = 'button';
      b.textContent = t(city.name);
      b.dataset.city = city.id;
      wrap.appendChild(b);
    });
    wrap.addEventListener('click', (e)=>{
      const btn = e.target.closest('.city-chip');
      if (!btn) return;
      state.filterCity = btn.dataset.city || 'all';
      $$('.city-chip', wrap).forEach(x=>x.classList.toggle('active', x === btn));
      renderList(); ensureValidSelection(); renderView();
    });
  }

  function getFiltered(){
    return state.flat.filter(item => {
      const cityOk = state.filterCity === 'all' || item.cityId === state.filterCity;
      const qOk = !state.query || item.search.includes(state.query);
      return cityOk && qOk;
    });
  }

  function getSelected(){
    return state.flat.find(x => x.id === state.selectedId) || null;
  }

  function ensureValidSelection(){
    const filtered = getFiltered();
    if (!filtered.find(x=>x.id === state.selectedId)) {
      state.selectedId = filtered[0] ? filtered[0].id : null;
      state.selectedMediaIndex = 0;
    }
  }

  function renderList(){
    const wrap = $('#cityList');
    const count = $('#cityCount');
    if (!wrap) return;
    const filtered = getFiltered();
    if (count) count.textContent = `${filtered.length} locations`;
    wrap.innerHTML = filtered.map(item => `
      <button class="city-place ${item.id === state.selectedId ? 'active' : ''}" type="button" data-place-id="${item.id}">
        <span class="city-place__thumb">${item.media[0] ? `<img src="${item.media[0].src}" alt="">` : ''}</span>
        <span>
          <span class="city-place__name">${escapeHtml(t(item.name))}</span>
          <span class="city-place__meta">${escapeHtml(item.cityName)} • ${(item.tags || []).slice(0,2).map(escapeHtml).join(' • ') || 'spiritual place'}</span>
        </span>
      </button>
    `).join('') || `<div class="city-empty">No locations match your search right now.</div>`;

    $$('.city-place', wrap).forEach(btn=>btn.addEventListener('click', ()=>{
      state.selectedId = btn.dataset.placeId;
      state.selectedMediaIndex = 0;
      renderList();
      renderView();
      history.replaceState({}, '', `city-journey.html?place=${encodeURIComponent(state.selectedId)}`);
    }));
  }

  function stepSelection(dir){
    const filtered = getFiltered();
    if (!filtered.length) return;
    const idx = Math.max(0, filtered.findIndex(x => x.id === state.selectedId));
    const next = filtered[(idx + dir + filtered.length) % filtered.length];
    state.selectedId = next.id;
    state.selectedMediaIndex = 0;
    renderList();
    renderView();
    history.replaceState({}, '', `city-journey.html?place=${encodeURIComponent(state.selectedId)}`);
  }

  function renderView(){
    const item = getSelected();
    const mount = $('#cityView');
    if (!mount) return;
    if (!item){
      mount.innerHTML = `<div class="city-empty">No location selected.</div>`;
      return;
    }
    const media = item.media || [];
    const activeMedia = media[state.selectedMediaIndex] || media[0] || null;
    const routeQuery = encodeURIComponent(t(item.name));
    mount.innerHTML = `
      <div class="city-view__top">
        <div>
          <div class="pp-mini">Move Through the City</div>
          <h2 class="city-view__title">${escapeHtml(t(item.name))}</h2>
          <div class="city-tags" style="margin-top:12px">
            <span class="pp-pill">${escapeHtml(item.cityName)}</span>
            ${(item.tags || []).map(tag=>`<span class="pp-pill">${escapeHtml(tag)}</span>`).join('')}
          </div>
          <p class="pp-muted city-view__summary">${escapeHtml(t(item.description) || 'A meaningful stop on your spiritual city journey.')}</p>
          <div class="city-actions">
            <a class="pp-btn" href="route.html">Open Route Map</a>
            <a class="pp-btn pp-btn--ghost" href="routes.html?q=${routeQuery}">Add to Route Builder</a>
            <a class="pp-btn pp-btn--ghost" href="gallery.html">Open Gallery</a>
          </div>
        </div>
        <div class="city-statbox">
          <div class="city-stat"><b>City</b><span class="pp-muted">${escapeHtml(item.cityName)}</span></div>
          <div class="city-stat"><b>Coordinates</b><span class="pp-muted">${item.lat}, ${item.lng}</span></div>
          <div class="city-stat"><b>Media</b><span class="pp-muted">${media.filter(x=>x.type==='image').length} images • ${media.filter(x=>x.type==='video').length} videos</span></div>
        </div>
      </div>

      <div class="city-gallery">
        <div class="city-stage">${renderStage(activeMedia, item)}</div>
        <div class="city-thumbs">
          ${media.map((m, i)=>`
            <button class="city-thumb ${i === state.selectedMediaIndex ? 'active' : ''}" type="button" data-media-index="${i}">
              ${m.type === 'video' ? `<video src="${m.src}" muted preload="metadata"></video>` : `<img src="${m.src}" alt="">`}
              <span class="city-thumb__label">${m.type === 'video' ? 'Video' : 'Image'} ${i+1}</span>
            </button>
          `).join('') || `<div class="city-empty">No media added yet for this location.</div>`}
        </div>
      </div>

      <div class="city-panelgrid">
        <div class="city-panel">
          <div class="pp-mini">About this stop</div>
          <p class="pp-muted" style="margin-top:10px">${escapeHtml(t(item.description) || 'Details will appear here as you enrich the location data.')}</p>
          <div class="city-related">
            <a href="maps.html">Open city map</a>
            <a href="tours.html">Browse tours</a>
            <a href="calendar.html">Check occasions</a>
          </div>
        </div>
        <div class="city-panel">
          <div class="pp-mini">Continue the journey</div>
          <div class="pp-muted" style="margin-top:10px">Use Previous and Next to move through the city, then add the places you like to your route map or itinerary.</div>
          <div class="city-actions" style="margin-top:14px">
            <button class="pp-btn pp-btn--ghost" id="cityPrev">← Previous</button>
            <button class="pp-btn pp-btn--ghost" id="cityNext">Next →</button>
          </div>
        </div>
      </div>
    `;
    $$('.city-thumb', mount).forEach(btn=>btn.addEventListener('click', ()=>{
      state.selectedMediaIndex = Number(btn.dataset.mediaIndex || 0);
      renderView();
    }));
    $('#cityPrev', mount)?.addEventListener('click', ()=>stepSelection(-1));
    $('#cityNext', mount)?.addEventListener('click', ()=>stepSelection(1));
    updateStaticText();
  }

  function renderStage(media, item){
    if (!media) return `<div class="city-stage--empty">No image or video is available yet for ${escapeHtml(t(item.name))}.</div>`;
    if (media.type === 'video') return `<video src="${media.src}" controls playsinline preload="metadata"></video>`;
    return `<img src="${media.src}" alt="${escapeHtml(t(item.name))}">`;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    load().catch(err=>{
      console.error(err);
      const mount = document.getElementById('cityView');
      if (mount) mount.innerHTML = `<div class="city-empty">Could not load city data right now.</div>`;
    });
  });
})();
