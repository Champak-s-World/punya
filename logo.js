/* logo.js
   Punya Yatra animated floating logo widget
   Features:
   - Uses an image logo
   - Draggable
   - Position persistence with localStorage
   - Optional resize via API
   - Hover glow / float animation
   - Click to expand / collapse
   - Double click to reset position
   - Easy embed in any HTML page

   Usage:
   1. Put your logo image somewhere in your project, for example:
      assets/images/punya-yatra-logo.png

   2. Include this file:
      <script src="assets/js/logo.js"></script>

   3. Add this after including the file:
      <script>
        PunyaYatraLogo.init({
          imageSrc: "assets/images/punya-yatra-logo.png"
        });
      </script>
*/

(function () {
  "use strict";

  const DEFAULTS = {
    imageSrc: "assets/images/punya-yatra-logo.png",
    width: 280,
    mobileWidth: 180,
    startX: null,
    startY: null,
    position: "bottom-right", // top-left, top-right, bottom-left, bottom-right, center
    margin: 18,
    zIndex: 9999,
    containerId: "py-floating-logo",
    storageKey: "py-floating-logo-state-v1",
    draggable: true,
    rememberPosition: true,
    rememberSize: true,
    clickable: true,
    collapsible: true,
    showControls: true,
    floatAnimation: true,
    glowAnimation: true,
    entranceAnimation: true,
    allowTouchDrag: true,
    keepInsideViewport: true,
    opacity: 1,
    autoHideWhenPrinting: true,
    title: "Punya Yatra"
  };

  const state = {
    cfg: null,
    root: null,
    card: null,
    img: null,
    handle: null,
    controls: null,
    isDragging: false,
    dragMoved: false,
    pointerId: null,
    startPointerX: 0,
    startPointerY: 0,
    startLeft: 0,
    startTop: 0,
    collapsed: false,
    width: 0,
    left: 0,
    top: 0,
    raf: null
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function getInitialWidth(cfg) {
    return isMobile() ? cfg.mobileWidth : cfg.width;
  }

  function loadSavedState() {
    if (!state.cfg.rememberPosition && !state.cfg.rememberSize) return null;
    try {
      const raw = localStorage.getItem(state.cfg.storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function saveState() {
    if (!state.cfg.rememberPosition && !state.cfg.rememberSize) return;
    try {
      const data = {
        left: state.left,
        top: state.top,
        width: state.width,
        collapsed: state.collapsed
      };
      localStorage.setItem(state.cfg.storageKey, JSON.stringify(data));
    } catch (err) {
      // ignore
    }
  }

  function removeSavedState() {
    try {
      localStorage.removeItem(state.cfg.storageKey);
    } catch (err) {
      // ignore
    }
  }

  function createStyles() {
    if (document.getElementById("py-floating-logo-styles")) return;

    const style = document.createElement("style");
    style.id = "py-floating-logo-styles";
    style.textContent = `
      .py-floating-logo-root{
        position:fixed;
        inset:auto auto auto auto;
        pointer-events:none;
        user-select:none;
        -webkit-user-select:none;
        touch-action:none;
      }

      .py-floating-logo-card{
        position:relative;
        pointer-events:auto;
        border-radius:22px;
        background:linear-gradient(180deg, rgba(255,253,248,.96), rgba(255,246,230,.92));
        border:1px solid rgba(217,119,6,.18);
        box-shadow:
          0 16px 42px rgba(146,64,14,.16),
          0 8px 20px rgba(217,119,6,.10),
          inset 0 1px 0 rgba(255,255,255,.7);
        overflow:hidden;
        backdrop-filter:blur(10px);
        transform-origin:center;
      }

      .py-floating-logo-card.py-entrance{
        animation:pyLogoEntrance .65s ease-out both;
      }

      .py-floating-logo-card.py-collapsed{
        width:74px !important;
        height:74px !important;
        border-radius:999px;
      }

      .py-floating-logo-card.py-collapsed .py-floating-logo-image-wrap{
        padding:10px;
      }

      .py-floating-logo-card.py-collapsed .py-floating-logo-controls{
        opacity:0;
        pointer-events:none;
        transform:translateY(8px);
      }

      .py-floating-logo-card.py-dragging{
        cursor:grabbing;
        box-shadow:
          0 22px 58px rgba(146,64,14,.22),
          0 10px 24px rgba(217,119,6,.16),
          inset 0 1px 0 rgba(255,255,255,.7);
      }

      .py-floating-logo-handle{
        position:absolute;
        top:8px;
        left:8px;
        right:8px;
        height:26px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        z-index:3;
        border-radius:999px;
        background:rgba(255,255,255,.45);
        backdrop-filter:blur(6px);
        padding:0 10px;
        cursor:grab;
      }

      .py-floating-logo-handle-left{
        display:flex;
        align-items:center;
        gap:7px;
        min-width:0;
      }

      .py-floating-logo-dot{
        width:8px;
        height:8px;
        border-radius:50%;
        background:linear-gradient(135deg,#d97706,#f59e0b);
        box-shadow:0 0 10px rgba(245,158,11,.45);
        flex:0 0 auto;
      }

      .py-floating-logo-title{
        font:700 11px/1.1 system-ui, Arial, sans-serif;
        color:#7c3f08;
        letter-spacing:.06em;
        text-transform:uppercase;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }

      .py-floating-logo-buttons{
        display:flex;
        align-items:center;
        gap:6px;
        flex:0 0 auto;
      }

      .py-floating-logo-btn{
        appearance:none;
        border:none;
        width:24px;
        height:24px;
        border-radius:999px;
        display:grid;
        place-items:center;
        cursor:pointer;
        background:rgba(255,255,255,.92);
        color:#8b4510;
        font:700 13px/1 system-ui, Arial, sans-serif;
        box-shadow:0 4px 10px rgba(0,0,0,.08);
        transition:transform .18s ease, background .18s ease, box-shadow .18s ease;
      }

      .py-floating-logo-btn:hover{
        transform:translateY(-1px) scale(1.04);
        background:#fff8ef;
      }

      .py-floating-logo-image-wrap{
        position:relative;
        padding:42px 14px 14px;
        display:flex;
        align-items:center;
        justify-content:center;
        min-height:100px;
      }

      .py-floating-logo-image{
        display:block;
        width:100%;
        height:auto;
        max-width:100%;
        object-fit:contain;
        filter:drop-shadow(0 10px 20px rgba(217,119,6,.12));
        transform-origin:center;
      }

      .py-floating-logo-card.py-float .py-floating-logo-image{
        animation:pyLogoFloat 4.5s ease-in-out infinite;
      }

      .py-floating-logo-card.py-glow::after{
        content:"";
        position:absolute;
        inset:-15%;
        background:
          radial-gradient(circle at 50% 50%, rgba(245,158,11,.22), transparent 52%),
          radial-gradient(circle at 55% 35%, rgba(59,130,246,.18), transparent 40%);
        z-index:0;
        pointer-events:none;
        animation:pyLogoGlow 4.8s ease-in-out infinite;
      }

      .py-floating-logo-card > *{
        position:relative;
        z-index:1;
      }

      .py-floating-logo-controls{
        display:flex;
        gap:8px;
        justify-content:center;
        padding:0 12px 12px;
        transition:opacity .2s ease, transform .2s ease;
      }

      .py-floating-logo-control{
        appearance:none;
        border:1px solid rgba(217,119,6,.18);
        background:#fffaf3;
        color:#8b4510;
        border-radius:999px;
        height:28px;
        min-width:28px;
        padding:0 10px;
        cursor:pointer;
        font:700 13px/1 system-ui, Arial, sans-serif;
        box-shadow:0 4px 12px rgba(217,119,6,.07);
        transition:transform .18s ease, background .18s ease;
      }

      .py-floating-logo-control:hover{
        transform:translateY(-1px);
        background:#fff4e2;
      }

      .py-floating-logo-resize-label{
        font:700 11px/1 system-ui, Arial, sans-serif;
        color:#9a5b1d;
        padding:0 4px;
        display:flex;
        align-items:center;
      }

      @keyframes pyLogoFloat{
        0%,100%{ transform:translateY(0px) scale(1); }
        50%{ transform:translateY(-6px) scale(1.01); }
      }

      @keyframes pyLogoGlow{
        0%,100%{ opacity:.65; transform:scale(1); }
        50%{ opacity:1; transform:scale(1.03); }
      }

      @keyframes pyLogoEntrance{
        0%{ opacity:0; transform:translateY(18px) scale(.94); }
        100%{ opacity:1; transform:translateY(0) scale(1); }
      }

      @media (max-width: 768px){
        .py-floating-logo-handle{
          height:24px;
        }
        .py-floating-logo-title{
          font-size:10px;
        }
      }

      @media print{
        .py-floating-logo-root.py-hide-print{
          display:none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function resolveStartPosition(cfg, widthGuess, heightGuess) {
    const m = cfg.margin;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = m;
    let top = m;

    switch (cfg.position) {
      case "top-left":
        left = m;
        top = m;
        break;
      case "top-right":
        left = vw - widthGuess - m;
        top = m;
        break;
      case "bottom-left":
        left = m;
        top = vh - heightGuess - m;
        break;
      case "center":
        left = (vw - widthGuess) / 2;
        top = (vh - heightGuess) / 2;
        break;
      case "bottom-right":
      default:
        left = vw - widthGuess - m;
        top = vh - heightGuess - m;
        break;
    }

    if (Number.isFinite(cfg.startX)) left = cfg.startX;
    if (Number.isFinite(cfg.startY)) top = cfg.startY;

    return { left, top };
  }

  function applyPosition() {
    if (!state.root) return;

    const cardRect = state.card.getBoundingClientRect();
    let left = state.left;
    let top = state.top;

    if (state.cfg.keepInsideViewport) {
      left = clamp(left, 4, window.innerWidth - cardRect.width - 4);
      top = clamp(top, 4, window.innerHeight - cardRect.height - 4);
      state.left = left;
      state.top = top;
    }

    state.root.style.left = `${left}px`;
    state.root.style.top = `${top}px`;
    state.root.style.width = `${state.width}px`;
    state.card.style.width = `${state.width}px`;
    state.card.style.opacity = String(state.cfg.opacity);
  }

  function setCollapsed(collapsed, save = true) {
    state.collapsed = !!collapsed;
    state.card.classList.toggle("py-collapsed", state.collapsed);
    if (save) saveState();
  }

  function setWidth(nextWidth, save = true) {
    const min = isMobile() ? 120 : 150;
    const max = isMobile() ? Math.min(window.innerWidth - 20, 260) : Math.min(window.innerWidth - 30, 460);
    state.width = clamp(nextWidth, min, max);
    applyPosition();
    if (save) saveState();
  }

  function resetPosition() {
    const pos = resolveStartPosition(state.cfg, state.width, state.width * 0.62);
    state.left = pos.left;
    state.top = pos.top;
    setCollapsed(false, false);
    applyPosition();
    removeSavedState();
    saveState();
  }

  function onPointerDown(e) {
    if (!state.cfg.draggable) return;
    if (e.button !== undefined && e.button !== 0) return;

    state.isDragging = true;
    state.dragMoved = false;
    state.pointerId = e.pointerId || null;
    state.startPointerX = e.clientX;
    state.startPointerY = e.clientY;
    state.startLeft = state.left;
    state.startTop = state.top;

    state.card.classList.add("py-dragging");

    if (state.handle.setPointerCapture && state.pointerId !== null) {
      try {
        state.handle.setPointerCapture(state.pointerId);
      } catch (err) {
        // ignore
      }
    }

    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!state.isDragging) return;

    const dx = e.clientX - state.startPointerX;
    const dy = e.clientY - state.startPointerY;

    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      state.dragMoved = true;
    }

    state.left = state.startLeft + dx;
    state.top = state.startTop + dy;

    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(applyPosition);
  }

  function onPointerUp() {
    if (!state.isDragging) return;
    state.isDragging = false;
    state.card.classList.remove("py-dragging");
    applyPosition();
    saveState();
  }

  function onResize() {
    const cardRect = state.card.getBoundingClientRect();
    state.left = clamp(state.left, 4, window.innerWidth - cardRect.width - 4);
    state.top = clamp(state.top, 4, window.innerHeight - cardRect.height - 4);
    applyPosition();
    saveState();
  }

  function createButton(text, title, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "py-floating-logo-btn";
    btn.textContent = text;
    btn.title = title;
    btn.setAttribute("aria-label", title);
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      onClick(e);
    });
    return btn;
  }

  function buildDOM(cfg) {
    const root = document.createElement("div");
    root.id = cfg.containerId;
    root.className = "py-floating-logo-root" + (cfg.autoHideWhenPrinting ? " py-hide-print" : "");

    const card = document.createElement("div");
    card.className = "py-floating-logo-card";
    if (cfg.floatAnimation) card.classList.add("py-float");
    if (cfg.glowAnimation) card.classList.add("py-glow");
    if (cfg.entranceAnimation) card.classList.add("py-entrance");

    const handle = document.createElement("div");
    handle.className = "py-floating-logo-handle";

    const handleLeft = document.createElement("div");
    handleLeft.className = "py-floating-logo-handle-left";

    const dot = document.createElement("span");
    dot.className = "py-floating-logo-dot";

    const title = document.createElement("div");
    title.className = "py-floating-logo-title";
    title.textContent = cfg.title;

    handleLeft.appendChild(dot);
    handleLeft.appendChild(title);

    const buttons = document.createElement("div");
    buttons.className = "py-floating-logo-buttons";

    const toggleBtn = createButton("–", "Collapse or expand", function () {
      setCollapsed(!state.collapsed);
      toggleBtn.textContent = state.collapsed ? "+" : "–";
    });

    const resetBtn = createButton("↺", "Reset position", function () {
      resetPosition();
    });

    buttons.appendChild(resetBtn);
    buttons.appendChild(toggleBtn);

    handle.appendChild(handleLeft);
    handle.appendChild(buttons);

    const imageWrap = document.createElement("div");
    imageWrap.className = "py-floating-logo-image-wrap";

    const img = document.createElement("img");
    img.className = "py-floating-logo-image";
    img.src = cfg.imageSrc;
    img.alt = cfg.title;
    img.draggable = false;

    imageWrap.appendChild(img);

    const controls = document.createElement("div");
    controls.className = "py-floating-logo-controls";

    const shrink = document.createElement("button");
    shrink.type = "button";
    shrink.className = "py-floating-logo-control";
    shrink.textContent = "−";
    shrink.title = "Reduce size";
    shrink.setAttribute("aria-label", "Reduce size");
    shrink.addEventListener("click", function (e) {
      e.stopPropagation();
      setWidth(state.width - 20);
    });

    const label = document.createElement("div");
    label.className = "py-floating-logo-resize-label";
    label.textContent = "size";

    const grow = document.createElement("button");
    grow.type = "button";
    grow.className = "py-floating-logo-control";
    grow.textContent = "+";
    grow.title = "Increase size";
    grow.setAttribute("aria-label", "Increase size");
    grow.addEventListener("click", function (e) {
      e.stopPropagation();
      setWidth(state.width + 20);
    });

    controls.appendChild(shrink);
    controls.appendChild(label);
    controls.appendChild(grow);

    card.appendChild(handle);
    card.appendChild(imageWrap);
    if (cfg.showControls) card.appendChild(controls);
    root.appendChild(card);
    document.body.appendChild(root);

    if (cfg.clickable && cfg.collapsible) {
      img.addEventListener("click", function () {
        if (state.dragMoved) return;
        setCollapsed(!state.collapsed);
        toggleBtn.textContent = state.collapsed ? "+" : "–";
      });
    }

    card.addEventListener("dblclick", function () {
      resetPosition();
    });

    if (cfg.draggable) {
      handle.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    }

    img.addEventListener("load", function () {
      applyPosition();
    });

    img.addEventListener("error", function () {
      console.warn("PunyaYatraLogo: image failed to load:", cfg.imageSrc);
    });

    state.root = root;
    state.card = card;
    state.img = img;
    state.handle = handle;
    state.controls = controls;
  }

  function init(userCfg) {
    destroy();

    createStyles();

    const cfg = Object.assign({}, DEFAULTS, userCfg || {});
    state.cfg = cfg;
    state.width = getInitialWidth(cfg);

    buildDOM(cfg);

    const saved = loadSavedState();
    if (saved) {
      if (cfg.rememberSize && Number.isFinite(saved.width)) {
        state.width = saved.width;
      }
      if (cfg.rememberPosition && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
        state.left = saved.left;
        state.top = saved.top;
      } else {
        const pos = resolveStartPosition(cfg, state.width, state.width * 0.62);
        state.left = pos.left;
        state.top = pos.top;
      }
      state.collapsed = !!saved.collapsed;
      setCollapsed(state.collapsed, false);
    } else {
      const pos = resolveStartPosition(cfg, state.width, state.width * 0.62);
      state.left = pos.left;
      state.top = pos.top;
      setCollapsed(false, false);
    }

    applyPosition();
    saveState();

    window.addEventListener("resize", onResize);

    return api;
  }

  function destroy() {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);

    if (state.root && state.root.parentNode) {
      state.root.parentNode.removeChild(state.root);
    }

    state.cfg = null;
    state.root = null;
    state.card = null;
    state.img = null;
    state.handle = null;
    state.controls = null;
    state.isDragging = false;
    state.dragMoved = false;
    state.pointerId = null;
    state.raf = null;
  }

  function show() {
    if (state.root) state.root.style.display = "";
    return api;
  }

  function hide() {
    if (state.root) state.root.style.display = "none";
    return api;
  }

  function moveTo(left, top) {
    if (!state.root) return api;
    if (Number.isFinite(left)) state.left = left;
    if (Number.isFinite(top)) state.top = top;
    applyPosition();
    saveState();
    return api;
  }

  function setPosition(positionName) {
    if (!state.root) return api;
    state.cfg.position = positionName;
    const pos = resolveStartPosition(state.cfg, state.width, state.width * 0.62);
    state.left = pos.left;
    state.top = pos.top;
    applyPosition();
    saveState();
    return api;
  }

  function setImage(src) {
    if (!state.img) return api;
    state.img.src = src;
    state.cfg.imageSrc = src;
    return api;
  }

  function setSize(width) {
    if (!Number.isFinite(width)) return api;
    setWidth(width);
    return api;
  }

  function collapse() {
    setCollapsed(true);
    return api;
  }

  function expand() {
    setCollapsed(false);
    return api;
  }

  function toggle() {
    setCollapsed(!state.collapsed);
    return api;
  }

  function reset() {
    resetPosition();
    return api;
  }

  const api = {
    init,
    destroy,
    show,
    hide,
    moveTo,
    setPosition,
    setImage,
    setSize,
    collapse,
    expand,
    toggle,
    reset
  };

  window.PunyaYatraLogo = api;
})();