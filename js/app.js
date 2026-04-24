// app.js

// ── Canvas Drawing ──────────────────────────────────────────────────────────
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const PANEL_W = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--panel-w'), 10) || 420;

function setCanvasSize() {
  const newW = window.innerWidth - PANEL_W;
  const newH = window.innerHeight;
  if (canvas.width === newW && canvas.height === newH) return;

  const off = document.createElement("canvas");
  off.width = canvas.width;
  off.height = canvas.height;
  off.getContext("2d").drawImage(canvas, 0, 0);

  canvas.width = newW;
  canvas.height = newH;
  ctx.drawImage(off, 0, 0);
}

setCanvasSize();
window.addEventListener("resize", setCanvasSize);

let isDrawing = false;
const colors = [
  "red",
  "#fc3b00",
  "#c1fc00",
  "#5000fc",
  "green",
  "#ff7393",
  "lightgray",
];

canvas.addEventListener("mousedown", (event) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.lineWidth = 50;
  ctx.lineCap = "round";
  ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
  ctx.shadowBlur = 30;
  ctx.shadowColor = ctx.strokeStyle;
  ctx.moveTo(event.offsetX, event.offsetY);
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
});

canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseleave", () => (isDrawing = false));

// ── Dark Mode — apply from localStorage ──────────────────────────────────────
const html = document.documentElement;
let isDarkMode = localStorage.getItem("dark-mode") === "enabled";
html.classList.toggle("dark-mode", isDarkMode);

// ── Layout State ─────────────────────────────────────────────────────────────
let allLinks = document.querySelectorAll("a.scattered-link");
const main = document.querySelector("main");
const straightLayoutContainer = document.querySelector(".straight-layout-container");
const projects = document.querySelector(".projects");
const info = document.querySelector(".info");
let isStraightLayout = false;
let currentMode = "scatter"; // "scatter" | "list" — the layout mode, never "draw"
let isDrawActive = false;    // draw overlay is independent of layout mode
let assignedPositions = new Map();
let currentPreviewModal = null;

// Overlay container so scattered links paint above the canvas
let overlayLinks = document.querySelector(".overlay-links");
if (!overlayLinks) {
  overlayLinks = document.createElement("div");
  overlayLinks.className = "overlay-links";
  overlayLinks.style.position = "fixed";
  overlayLinks.style.inset = "0";
  overlayLinks.style.pointerEvents = "none";
  overlayLinks.style.zIndex = "9999";
  document.body.appendChild(overlayLinks);
}

function moveLinksToOverlay() {
  const links = Array.from(document.querySelectorAll("a.scattered-link"));
  links.forEach((link) => {
    overlayLinks.appendChild(link);
    link.style.pointerEvents = "auto";
  });
  allLinks = document.querySelectorAll("a.scattered-link");
}

// ── Scattered Layout ─────────────────────────────────────────────────────────
function generateGridPositions() {
  const gridCellWidth = 260;
  const gridCellHeight = 110;
  const paddingTop = 80;
  const paddingRight = 100;
  const paddingBottom = 200;
  const paddingLeft = PANEL_W + 30;
  const maxColumns = 5;

  const usableWidth = window.innerWidth - paddingLeft - paddingRight;
  const usableHeight = window.innerHeight - paddingTop - paddingBottom;
  const columns = Math.min(Math.floor(usableWidth / gridCellWidth), maxColumns);
  const rows = Math.floor(usableHeight / gridCellHeight);

  const gridWidth = columns * gridCellWidth;
  const gridHeight = rows * gridCellHeight;

  const startX = paddingLeft + (usableWidth - gridWidth) / 2;
  const startY = paddingTop + (usableHeight - gridHeight) / 2;

  let positions = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      positions.push({
        x: startX + col * gridCellWidth,
        y: startY + row * gridCellHeight,
      });
    }
  }
  return positions;
}

function assignGridPositions() {
  let availablePositions = [...generateGridPositions()];
  allLinks.forEach((link) => {
    if (availablePositions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const position = availablePositions.splice(randomIndex, 1)[0];
    assignedPositions.set(link, position);
    link.style.transform = `translate(${position.x}px, ${position.y}px)`;
    link.style.opacity = "1";
  });
}

function shufflePositions(excludeLink) {
  if (isStraightLayout) return;

  let availablePositions = [...assignedPositions.values()];
  const hoveredPosition = assignedPositions.get(excludeLink);

  if (hoveredPosition) {
    availablePositions = availablePositions.filter((pos) => pos !== hoveredPosition);
  }

  const shuffledPositions = availablePositions.sort(() => Math.random() - 0.5);
  let index = 0;

  allLinks.forEach((link) => {
    if (link === excludeLink) return;
    const newPos = shuffledPositions[index++];
    assignedPositions.set(link, newPos);
    link.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
  });
}

// ── Preview Modals ────────────────────────────────────────────────────────────
allLinks.forEach((link, idx) => {
  link.setAttribute("data-preview-id", `preview-modal-link${idx + 1}`);
  link.addEventListener("mouseenter", () => {
    if (!isStraightLayout) {
      const previewId = link.getAttribute("data-preview-id");
      if (
        currentPreviewModal &&
        currentPreviewModal.id === previewId &&
        !currentPreviewModal.classList.contains("hidden")
      ) {
        return;
      }
      if (currentPreviewModal) {
        currentPreviewModal.classList.remove("show");
        currentPreviewModal.classList.add("hidden");
      }
      if (previewId) {
        const modal = document.getElementById(previewId);
        if (modal) {
          modal.classList.remove("hidden");
          modal.style.left = "-9999px";
          modal.style.top = "-9999px";
          modal.style.right = "";
          void modal.offsetHeight;
          const mRect = modal.getBoundingClientRect();
          const linkRect = link.getBoundingClientRect();
          const margin = 12;

          function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
          }

          const maxTop = Math.max(10, window.innerHeight - mRect.height - 10);
          const candidates = [];
          candidates.push({
            left: clamp(linkRect.right + margin, PANEL_W + 10, window.innerWidth - mRect.width - 10),
            top: clamp(linkRect.top + (linkRect.height - mRect.height) / 2, 10, maxTop),
          });
          candidates.push({
            left: clamp(linkRect.left - mRect.width - margin, PANEL_W + 10, window.innerWidth - mRect.width - 10),
            top: clamp(linkRect.top + (linkRect.height - mRect.height) / 2, 10, maxTop),
          });
          candidates.push({
            left: clamp(linkRect.left + (linkRect.width - mRect.width) / 2, PANEL_W + 10, window.innerWidth - mRect.width - 10),
            top: clamp(linkRect.top - mRect.height - margin, 10, maxTop),
          });
          candidates.push({
            left: clamp(linkRect.left + (linkRect.width - mRect.width) / 2, PANEL_W + 10, window.innerWidth - mRect.width - 10),
            top: clamp(linkRect.bottom + margin, 10, maxTop),
          });

          function rectsIntersect(a, b) {
            return !(
              a.left + a.width < b.left ||
              b.left + b.width < a.left ||
              a.top + a.height < b.top ||
              b.top + b.height < a.top
            );
          }

          function overlapArea(a, b) {
            const xOverlap = Math.max(0, Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left));
            const yOverlap = Math.max(0, Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top));
            return xOverlap * yOverlap;
          }

          const others = Array.from(allLinks)
            .filter((l) => l !== link)
            .map((l) => l.getBoundingClientRect());

          let chosen = null;
          for (const c of candidates) {
            const candRect = { left: c.left, top: c.top, width: mRect.width, height: mRect.height };
            let hits = false;
            for (const o of others) {
              if (rectsIntersect(candRect, o)) { hits = true; break; }
            }
            if (!hits && rectsIntersect(candRect, linkRect)) hits = true;
            if (!hits) { chosen = c; break; }
          }

          if (!chosen) {
            const centerX = linkRect.left + linkRect.width / 2;
            const centerY = linkRect.top + linkRect.height / 2;
            const maxRadius = Math.max(window.innerWidth, window.innerHeight);
            const step = 24;
            const angleSteps = 12;
            let found = null;
            outer: for (let r = 0; r <= maxRadius; r += step) {
              for (let i = 0; i < angleSteps; i++) {
                const theta = (i / angleSteps) * Math.PI * 2;
                const cx = centerX + r * Math.cos(theta);
                const cy = centerY + r * Math.sin(theta);
                const left = clamp(cx - mRect.width / 2, PANEL_W + 10, window.innerWidth - mRect.width - 10);
                const top = clamp(cy - mRect.height / 2, 10, window.innerHeight - mRect.height - 10);
                const candRect = { left, top, width: mRect.width, height: mRect.height };
                let overlap = false;
                for (const o of others) {
                  if (rectsIntersect(candRect, o)) { overlap = true; break; }
                }
                if (!overlap && rectsIntersect(candRect, linkRect)) overlap = true;
                if (!overlap) { found = { left, top }; break outer; }
              }
            }
            if (found) {
              chosen = found;
            } else {
              let best = null;
              let bestArea = Infinity;
              const nonOverlapping = candidates.filter(c => !rectsIntersect(
                { left: c.left, top: c.top, width: mRect.width, height: mRect.height },
                linkRect
              ));
              const pool = nonOverlapping.length > 0 ? nonOverlapping : candidates;
              for (const c of pool) {
                const candRect = { left: c.left, top: c.top, width: mRect.width, height: mRect.height };
                let area = 0;
                for (const o of others) area += overlapArea(candRect, o);
                if (area < bestArea) { bestArea = area; best = c; }
              }
              chosen = best || candidates[0];
            }
          }

          modal.style.left = `${Math.round(chosen.left)}px`;
          modal.style.top = `${Math.round(chosen.top)}px`;

          void modal.offsetHeight;
          modal.classList.add("show");

          modal.onclick = (e) => {
            e.stopPropagation();
            window.open(link.href, "_blank", "noopener,noreferrer");
          };
          currentPreviewModal = modal;
        }
      }
    }
  });
});

// ── Straight Layout ───────────────────────────────────────────────────────────
function populateStraightLayout() {
  projects.innerHTML = "";

  allLinks.forEach((link) => {
    const altText = link.getAttribute("data-alt");
    const card = document.createElement("div");
    card.classList.add("card");
    const slug = altText.toLowerCase().replace(/\s+/g, "-");
    card.classList.add(`${slug}-card`);

    card.innerHTML = `
      <a href="${link.href}" target="_blank" rel="noopener noreferrer">
        <img src="${link.getAttribute("data-screenshot")}" alt="${altText}">
        <div class="card-content">
          <h3 class="indent-card">${altText.toUpperCase()}</h3>
          <p>${link.getAttribute("data-description")}</p>
        </div>
      </a>`;

    const img = card.querySelector("img");
    card.addEventListener("mouseenter", (e) => {
      const rect = card.getBoundingClientRect();
      const fromLeft = e.clientX < rect.left + rect.width / 2;
      img.style.transform = `translateX(${fromLeft ? -42 : 42}px)`;
    });
    card.addEventListener("mouseleave", () => {
      img.style.transform = "";
    });

    projects.appendChild(card);
    link.style.display = "none";
    requestAnimationFrame(() => { card.classList.add("fade-in"); });
  });

  requestAnimationFrame(() => {
    projects.classList.add("fade-in");
    info.classList.add("fade-in");
  });

  straightLayoutContainer.appendChild(projects);
  straightLayoutContainer.appendChild(info);
}

// ── Draw Overlay ──────────────────────────────────────────────────────────────
function enterDraw() {
  isDrawActive = true;
  document.body.classList.add("draw-mode");
  setCanvasSize();
  if (currentPreviewModal) {
    currentPreviewModal.classList.remove("show");
    currentPreviewModal.classList.add("hidden");
    currentPreviewModal = null;
  }
  syncDrawButton();
}

function exitDraw() {
  isDrawActive = false;
  document.body.classList.remove("draw-mode");
  setCanvasSize();
  syncDrawButton();
}

function toggleDraw() {
  if (isDrawActive) exitDraw();
  else enterDraw();
}

// ── Mode Switching (layout only — never "draw") ────────────────────────────────
function setMode(mode) {
  if (isDrawActive) exitDraw();
  currentMode = mode;

  syncModeButtons(mode);

  if (currentPreviewModal) {
    currentPreviewModal.classList.remove("show");
    currentPreviewModal.classList.add("hidden");
    currentPreviewModal = null;
  }

  if (mode === "list") {
    isStraightLayout = true;
    straightLayoutContainer.classList.remove("hidden");
    straightLayoutContainer.classList.add("fade-in");
    main.classList.add("hidden");
    // ensure scattered links are hidden and non-interactive
    overlayLinks.style.opacity = "0";
    overlayLinks.style.pointerEvents = "none";
    overlayLinks.style.zIndex = "0";
    document.body.style.overflow = "auto";
    populateStraightLayout();
  } else {
    if (isStraightLayout) {
      isStraightLayout = false;
      projects.classList.remove("fade-in");
      info.classList.remove("fade-in");
      straightLayoutContainer.classList.add("hidden");
      main.classList.remove("hidden");
      main.classList.add("fade-in");

      moveLinksToOverlay();
      allLinks.forEach((link) => {
        link.style.display = "block";
        link.style.opacity = "0";
        link.style.pointerEvents = "auto";
      });
      assignGridPositions();

      // restore overlay links visibility
      overlayLinks.style.opacity = "";
      overlayLinks.style.pointerEvents = "";
      overlayLinks.style.zIndex = "9999";

      void main.offsetHeight;
      requestAnimationFrame(() => {
        allLinks.forEach((link) => (link.style.opacity = "1"));
      });

      document.body.style.overflow = "hidden";
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      projects.scrollTop = 0;
    } else {
      // switching within scatter — ensure overlay is in correct state
      overlayLinks.style.opacity = "";
      overlayLinks.style.pointerEvents = "";
      overlayLinks.style.zIndex = "9999";
    }
  }
}

// ── Mode button roving tabindex ───────────────────────────────────────────────
const modeBtns = Array.from(document.querySelectorAll(".mode-btn"));

function syncModeButtons(activeMode) {
  modeBtns.forEach((btn) => {
    if (btn.dataset.mode === "draw" || btn.dataset.mode === "darkmode") return;
    const isActive = btn.dataset.mode === activeMode;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    btn.tabIndex = isActive ? 0 : -1;
  });
}

function syncDrawButton() {
  const drawBtn = document.querySelector('.mode-btn[data-mode="draw"]');
  if (!drawBtn) return;
  drawBtn.classList.toggle("draw-active", isDrawActive);
  drawBtn.setAttribute("aria-pressed", isDrawActive ? "true" : "false");
}

function syncDarkModeButton() {
  const darkBtn = document.querySelector('.mode-btn[data-mode="darkmode"]');
  if (!darkBtn) return;
  darkBtn.classList.toggle("dark-active", isDarkMode);
  darkBtn.setAttribute("aria-pressed", isDarkMode ? "true" : "false");
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  html.classList.toggle("dark-mode", isDarkMode);
  localStorage.setItem("dark-mode", isDarkMode ? "enabled" : "disabled");
  syncDarkModeButton();
}

modeBtns.forEach((btn) => {
  if (btn.dataset.mode === "draw") {
    btn.addEventListener("click", toggleDraw);
  } else if (btn.dataset.mode === "darkmode") {
    btn.addEventListener("click", toggleDarkMode);
  } else {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  }
  btn.addEventListener("keydown", (e) => {
    const idx = modeBtns.indexOf(document.activeElement);
    if (idx === -1) return;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = modeBtns[(idx + 1) % modeBtns.length];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = modeBtns[(idx - 1 + modeBtns.length) % modeBtns.length];
    }
    if (next) { next.focus(); next.click(); }
  });
});

// Exit draw when clicking the left panel
document.querySelector(".left-panel").addEventListener("mousedown", () => {
  if (isDrawActive) exitDraw();
});

// Logo → reset to scattered home
document.querySelector(".panel-section-label").addEventListener("click", () => {
  setMode("scatter");
});

// Clear canvas button
document.getElementById("clearCanvasBtn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// ── Initial position assignment ───────────────────────────────────────────────
syncDarkModeButton();
assignGridPositions();
void main.offsetHeight;

allLinks.forEach((link) => {
  link.style.transition =
    "transform 600ms cubic-bezier(.2,.9,.2,1), color 200ms linear, opacity 600ms cubic-bezier(.2,.9,.2,1)";
});

// ── Shuffle cooldown ──────────────────────────────────────────────────────────
let canShuffle = true;

allLinks.forEach((link) => {
  link.addEventListener("mouseover", () => {
    if (!canShuffle || isStraightLayout) return;
    canShuffle = false;
    shufflePositions(link);
    setTimeout(() => { canShuffle = true; }, 5000);
  });
});

// ── Mobile Project List ───────────────────────────────────────────────────────

function buildMobileProjectList() {
  const container = document.getElementById("mobileProjectList");
  if (!container) return;
  container.innerHTML = "";
  document.querySelectorAll("a.scattered-link").forEach((link) => {
    const card = document.createElement("a");
    card.className = "mobile-card";
    card.href = link.href;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.innerHTML = `
      <img src="${link.getAttribute("data-screenshot")}" alt="${link.getAttribute("data-alt")}" loading="lazy">
      <span class="mobile-card-title">${link.getAttribute("data-alt")}</span>`;
    container.appendChild(card);
  });
}

buildMobileProjectList();

// ── Escape key ────────────────────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (isDrawActive) exitDraw();
});

// ── Mobile Layout ─────────────────────────────────────────────────────────────
function isMobile() {
  return window.innerWidth <= 1440;
}

function setMobileLayout() {
  if (currentPreviewModal) {
    currentPreviewModal.classList.add("hidden");
    currentPreviewModal = null;
  }
  if (isMobile()) {
    straightLayoutContainer.classList.remove("hidden");
    main.classList.add("hidden");
    isStraightLayout = true;
    populateStraightLayout();
    info.style.display = "none";
  } else {
    info.style.display = "";
    if (!isStraightLayout) {
      straightLayoutContainer.classList.add("hidden");
      main.classList.remove("hidden");
      allLinks.forEach((link) => { link.style.display = "block"; });
    }
  }
}

// Force straight layout when resizing below 1440px while in scatter mode
window.addEventListener("resize", () => {
  if (isMobile() && currentMode === "scatter") {
    currentMode = "list";
    syncModeButtons("list");
    isStraightLayout = true;
    straightLayoutContainer.classList.remove("hidden");
    straightLayoutContainer.classList.add("fade-in");
    main.classList.add("hidden");
    overlayLinks.style.opacity = "0";
    overlayLinks.style.pointerEvents = "none";
    overlayLinks.style.zIndex = "0";
    document.body.style.overflow = "auto";
    populateStraightLayout();
    info.style.display = "none";
  }
});

window.addEventListener("DOMContentLoaded", setMobileLayout);

