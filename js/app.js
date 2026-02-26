//---------------------------------------------------------------------------------------
// Canvas Drawing Functionality
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  setCanvasSize();
  window.addEventListener("resize", setCanvasSize);

  let isDrawing = false;
  const colors = ["red", "#fc3b00", "#c1fc00", "#5000fc", "green", "#ff7393", "lightgray"];

  canvas.addEventListener("mousedown", () => {
    isDrawing = true;
    ctx.beginPath();
    ctx.lineWidth = 50;
    ctx.lineCap = "round";
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.shadowBlur = 30;
    ctx.shadowColor = ctx.strokeStyle;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!isDrawing) return;
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
  });

  canvas.addEventListener("mouseup", () => (isDrawing = false));
  canvas.addEventListener("mouseleave", () => (isDrawing = false));

//---------------------------------------------------------------------------------------
// Dark Mode Functionality
  const layoutToggle = document.querySelector(".layout-toggle");
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  const body = document.body;
  const html = document.documentElement;
  let isDarkMode = localStorage.getItem("dark-mode") === "enabled";

  function updateDarkMode() {
    // body.classList.toggle("dark-mode", isDarkMode);
    html.classList.toggle("dark-mode", isDarkMode);
    const filterValue = isDarkMode ? "invert(0)" : "invert(1)";
    layoutToggle.style.filter = filterValue;
    darkModeToggle.style.filter = filterValue;
    const darkModeIcon = darkModeToggle.querySelector("img");
  if (darkModeIcon) {
    darkModeIcon.src = isDarkMode
      ? "assets/images/light-mode-icon.png"
      : "assets/images/light-mode-icon.png";
    darkModeIcon.alt = isDarkMode ? "Disable Dark Mode" : "Enable Dark Mode";
  }
    localStorage.setItem("dark-mode", isDarkMode ? "enabled" : "disabled");
  }

  updateDarkMode();

  darkModeToggle.addEventListener("click", () => {
      // Temporarily disable transitions site-wide to avoid intermediate colors
      document.documentElement.classList.add('no-transition');
      const headerEl = document.querySelector('.header');
      if (headerEl) headerEl.classList.add('no-transition');

      isDarkMode = !isDarkMode;
      updateDarkMode();

      // Force a repaint and remove the helper so other transitions remain smooth
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.documentElement.classList.remove('no-transition');
          if (headerEl) headerEl.classList.remove('no-transition');
        }, 60);
      });
  });

//---------------------------------------------------------------------------------------
// Layouts
  // Select scattered links by class so selection remains valid even if we reparent them
  let allLinks = document.querySelectorAll("a.scattered-link");
  const main = document.querySelector("main");
  const straightLayoutContainer = document.querySelector(".straight-layout-container");
  const projects = document.querySelector(".projects");
  const info = document.querySelector(".info");
  let isStraightLayout = false;
  let assignedPositions = new Map();

// Create an overlay container appended at the end of <body> so links paint above the canvas
let overlayLinks = document.querySelector('.overlay-links');
if (!overlayLinks) {
  overlayLinks = document.createElement('div');
  overlayLinks.className = 'overlay-links';
  // keep it non-blocking by default; links inside will re-enable pointer-events
  overlayLinks.style.position = 'fixed';
  overlayLinks.style.inset = '0';
  overlayLinks.style.pointerEvents = 'none';
  overlayLinks.style.zIndex = '9999';
  document.body.appendChild(overlayLinks);
}

function moveLinksToOverlay() {
  const links = Array.from(document.querySelectorAll('a.scattered-link'));
  links.forEach(link => {
    overlayLinks.appendChild(link);
    // enable interaction on the link itself
    link.style.pointerEvents = 'auto';
  });
  // refresh NodeList
  allLinks = document.querySelectorAll('a.scattered-link');
}

function moveLinksToMain() {
  const links = Array.from(overlayLinks.querySelectorAll('a.scattered-link'));
  links.forEach(link => {
    main.appendChild(link);
    link.style.pointerEvents = '';
  });
  allLinks = document.querySelectorAll('a.scattered-link');
}

//---------------------------------------------------------------------------------------
// Scattered Layout
function generateGridPositions() {
  const gridCellWidth = 200;
  const gridCellHeight = 70;

  // Customize these to control grid position
  const paddingTop = 100;
  const paddingRight = 100;
  const paddingBottom = 200;
  const paddingLeft = 350;
  // Optionally cap the maximum number of columns (makes the grid narrower)
  const maxColumns = 5; // change this number to reduce/increase columns

  const usableWidth = window.innerWidth - paddingLeft - paddingRight;
  const usableHeight = window.innerHeight - paddingTop - paddingBottom;
  const columns = Math.min(Math.floor(usableWidth / gridCellWidth), maxColumns);
  const rows = Math.floor(usableHeight / gridCellHeight);

  // Calculate the actual grid size
  const gridWidth = columns * gridCellWidth;
  const gridHeight = rows * gridCellHeight;

  // Center the grid within the padded area
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
    if (isStraightLayout) return; // Prevent movement in straight mode

    let availablePositions = [...assignedPositions.values()];
    let hoveredPosition = assignedPositions.get(excludeLink);

    if (hoveredPosition) {
      availablePositions = availablePositions.filter(
        (pos) => pos !== hoveredPosition
      );
    }

    let shuffledPositions = availablePositions.sort(() => Math.random() - 0.5);
    let index = 0;

    allLinks.forEach((link) => {
      if (link === excludeLink) return;
      const newPos = shuffledPositions[index++];
      assignedPositions.set(link, newPos);
      link.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
    });
  }



//---------------------------------------------------------------------------------------
// Dynamic Preview Modal Functionality
let currentPreviewModal = null;

allLinks.forEach((link, idx) => {
  link.setAttribute("data-preview-id", `preview-modal-link${idx + 1}`);
  link.addEventListener("mouseenter", () => {
    if (!isStraightLayout) {
      const previewId = link.getAttribute("data-preview-id");
      // If the current modal is already showing, do nothing
      if (currentPreviewModal && currentPreviewModal.id === previewId && !currentPreviewModal.classList.contains("hidden")) {
        return;
      }
      // Hide previous modal
      if (currentPreviewModal) {
        // hide previous modal with transition
        currentPreviewModal.classList.remove("show");
        currentPreviewModal.classList.add("hidden");
      }
      // Show new modal
      if (previewId) {
        const modal = document.getElementById(previewId);
        if (modal) {
          // Position the modal near the hovered link while avoiding covering
          // other nearby links. We'll measure the modal, compute a few
          // candidate positions (right, left, above, below the link), and
          // pick the first that doesn't intersect other links. If all
          // intersect, pick the one with minimal overlap area.

          // Reveal the modal off-screen so we can measure it without flashing
          modal.classList.remove("hidden");
          modal.style.left = '-9999px';
          modal.style.top = '-9999px';
          modal.style.right = '';
          // force layout so modal has a proper size
          void modal.offsetHeight;
          const mRect = modal.getBoundingClientRect();
          const linkRect = link.getBoundingClientRect();
          const margin = 12;

          // helper to clamp to viewport
          function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

          const candidates = [];
          // Right of link (vertically centered)
          candidates.push({
            left: clamp(linkRect.right + margin, 10, window.innerWidth - mRect.width - 10),
            top: clamp(linkRect.top + (linkRect.height - mRect.height) / 2, 10, window.innerHeight - mRect.height - 10)
          });
          // Left of link
          candidates.push({
            left: clamp(linkRect.left - mRect.width - margin, 10, window.innerWidth - mRect.width - 10),
            top: clamp(linkRect.top + (linkRect.height - mRect.height) / 2, 10, window.innerHeight - mRect.height - 10)
          });
          // Above link (horizontally centered)
          candidates.push({
            left: clamp(linkRect.left + (linkRect.width - mRect.width) / 2, 10, window.innerWidth - mRect.width - 10),
            top: clamp(linkRect.top - mRect.height - margin, 10, window.innerHeight - mRect.height - 10)
          });
          // Below link
          candidates.push({
            left: clamp(linkRect.left + (linkRect.width - mRect.width) / 2, 10, window.innerWidth - mRect.width - 10),
            top: clamp(linkRect.bottom + margin, 10, window.innerHeight - mRect.height - 10)
          });

          function rectsIntersect(a, b) {
            return !(a.left + a.width < b.left || b.left + b.width < a.left ||
                     a.top + a.height < b.top || b.top + b.height < a.top);
          }

          function overlapArea(a, b) {
            const xOverlap = Math.max(0, Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left));
            const yOverlap = Math.max(0, Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top));
            return xOverlap * yOverlap;
          }

          // Build list of other link rects to avoid
          const others = Array.from(allLinks).filter(l => l !== link).map(l => l.getBoundingClientRect());

          let chosen = null;
          for (const c of candidates) {
            const candRect = { left: c.left, top: c.top, width: mRect.width, height: mRect.height };
            let hits = false;
            // Avoid overlapping any other link
            for (const o of others) {
              if (rectsIntersect(candRect, o)) { hits = true; break; }
            }
            // Also avoid overlapping the hovered link itself
            if (!hits && rectsIntersect(candRect, linkRect)) {
              hits = true;
            }
            if (!hits) { chosen = c; break; }
          }

          if (!chosen) {
            // Try a spiral search around the link's center to find a placement
            // that does not overlap any other links. This is more robust than
            // the few fixed candidates above in crowded areas.
            const centerX = linkRect.left + linkRect.width / 2;
            const centerY = linkRect.top + linkRect.height / 2;
            const maxRadius = Math.max(window.innerWidth, window.innerHeight);
            const step = 24; // pixels per ring step
            const angleSteps = 12; // samples per ring
            let found = null;
            outer: for (let r = 0; r <= maxRadius; r += step) {
              for (let i = 0; i < angleSteps; i++) {
                const theta = (i / angleSteps) * Math.PI * 2;
                const cx = centerX + r * Math.cos(theta);
                const cy = centerY + r * Math.sin(theta);
                const left = clamp(cx - mRect.width / 2, 10, window.innerWidth - mRect.width - 10);
                const top = clamp(cy - mRect.height / 2, 10, window.innerHeight - mRect.height - 10);
                const candRect = { left, top, width: mRect.width, height: mRect.height };
                let overlap = false;
                // Avoid overlapping any other link
                for (const o of others) {
                  if (rectsIntersect(candRect, o)) { overlap = true; break; }
                }
                // Also avoid overlapping the hovered link itself
                if (!overlap && rectsIntersect(candRect, linkRect)) {
                  overlap = true;
                }
                if (!overlap) { found = { left, top }; break outer; }
              }
            }
            if (found) {
              chosen = found;
            } else {
              // If spiral search failed (very crowded), fall back to minimal overlap
              let best = null;
              let bestArea = Infinity;
              for (const c of candidates) {
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

          // Force reflow then show with transition
          void modal.offsetHeight;
          modal.classList.add("show");

          // Make modal clickable: open the link in a new tab
          modal.onclick = (e) => {
            e.stopPropagation();
            window.open(link.href, "_blank");
          };
          currentPreviewModal = modal;
        }
      }
    }
  });
});

//---------------------------------------------------------------------------------------
// Straight Layout
function populateStraightLayout() {
  projects.innerHTML = "";



  allLinks.forEach((link) => {
    // Get the alt text from the data-alt
    const altText = link.getAttribute("data-alt")

    const card = document.createElement("div");
    card.classList.add("card");
    // Creates a slug from the alt text for the card class
    const slug = altText.toLowerCase().replace(/\s+/g, '-');
    card.classList.add(`${slug}-card`);

  

    card.innerHTML = `
      <a href="${link.href}" target="_blank">
        <img src="${link.getAttribute("data-screenshot")}" alt="${altText}">
        <div class="card-content">
          <h3 class="indent-card">${altText.toUpperCase()}</h3>
          <p>${link.getAttribute("data-description")}</p>
        </div>
      </a>`;

    projects.appendChild(card);
    link.style.display = "none";
    requestAnimationFrame(() => {
      card.classList.add("fade-in");
    });
  });

  requestAnimationFrame(() => {
    projects.classList.add("fade-in");
    info.classList.add("fade-in");
  });

  straightLayoutContainer.appendChild(projects);
  straightLayoutContainer.appendChild(info);
}

layoutToggle.addEventListener("click", () => {
  isStraightLayout = !isStraightLayout;

  if (currentPreviewModal) {
    currentPreviewModal.classList.remove("show");
  currentPreviewModal.classList.remove("show");
  currentPreviewModal.classList.add("hidden");
    currentPreviewModal = null;
  }

  if (isStraightLayout) {
    straightLayoutContainer.classList.remove("hidden");
    straightLayoutContainer.classList.add("fade-in");
    main.classList.add("hidden");
    layoutToggle.innerHTML = `<img src="assets/images/straight.png" alt="Straight Layout">`;

    document.body.style.overflow = "auto";
    populateStraightLayout();

  } else {
    projects.classList.remove("fade-in");
    info.classList.remove("fade-in");
    straightLayoutContainer.classList.add("hidden");
    main.classList.remove("hidden");
    main.classList.add("fade-in");
    layoutToggle.innerHTML = `<img src="assets/images/scattered.png" alt="Scattered Layout">`;

    // Ensure links are rendered in the overlay (so they appear above the canvas)
    moveLinksToOverlay();

    // Prepare links to re-appear smoothly and be interactive
    allLinks.forEach((link) => {
      link.style.display = "block";
      link.style.opacity = "0";
      link.style.pointerEvents = 'auto';
    });

    assignGridPositions();

    // Force reflow then fade in
    void main.offsetHeight;
    requestAnimationFrame(() => {
      allLinks.forEach((link) => link.style.opacity = '1');
    });

    // Disable scroll for scattered layout
    document.body.style.overflow = "hidden";

    // --- FIX: Reset scroll position and prevent scroll ---
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    projects.scrollTop = 0;
  }
});

//---------------------------------------------------------------------------------------
// Show Grid Cells for Debugging

function showGridCells() {
  // Remove any previous grid overlays
  document.querySelectorAll('.grid-debug-cell').forEach(el => el.remove());

  const gridCells = generateGridPositions();
  gridCells.forEach(cell => {
    const div = document.createElement('div');
    div.className = 'grid-debug-cell';
    div.style.position = 'absolute';
    div.style.left = `${cell.x}px`;
    div.style.top = `${cell.y}px`;
    div.style.width = '200px';   // match gridCellWidth
    div.style.height = '70px';   // match gridCellHeight
    div.style.border = '1px dashed #ff00ff';
    div.style.pointerEvents = 'none'; // so it doesn't block links
    div.style.zIndex = 1; // behind your links
    document.body.appendChild(div);
  });
}

  assignGridPositions();
  
  // Makes the links appear instead of slide in on First visit/Page reload 
  // Force a reflow so the browser applies the transform instantly
  void main.offsetHeight;

  // Enable the transition for future shuffles
  allLinks.forEach(link => {
  // Match preview modal easing/duration for movement; keep color snappy (200ms)
  link.style.transition = "transform 600ms cubic-bezier(.2,.9,.2,1), color 200ms linear, opacity 600ms cubic-bezier(.2,.9,.2,1)";
});

//---------------------------------------------------------------------------------------
// Show Grid Cells for Debugging (uncomment to use)
  // showGridCells()


//---------------------------------------------------------------------------------------
// Puts a cooldown on shuffling links
// This prevents the links from being shuffled too frequently

let canShuffle = true;

allLinks.forEach((link) => {
  link.addEventListener("mouseover", () => {
    if (!canShuffle) return;

    canShuffle = false;
    shufflePositions(link);

    setTimeout(() => {
      canShuffle = true;
    }, 5000);
  });
});


//---------------------------------------------------------------------------------------
// Change link colors on hover (saturated colors)


// const saturatedColors = [
//   "#ff0000", // red
//   "#ff8000", // orange
//   "#ffff00", // yellow
//   "#80ff00", // lime
//   "#00ff00", // green
//   "#00ff80", // spring green
//   "#00ffff", // cyan
//   "#0080ff", // azure
//   "#0000ff", // blue
//   "#8000ff", // violet
//   "#ff00ff", // magenta
// ];


// allLinks.forEach(link => {
//   link.addEventListener("mouseenter", () => {
//     const randomColor = saturatedColors[Math.floor(Math.random() * saturatedColors.length)];
//     link.style.color = randomColor;
//   });
//   link.addEventListener("mouseleave", () => {
//     link.style.color = ""; // Reset on mouse out
//   });
// });

//---------------------------------------------------------------------------------------
// Mobile Layout

  function isMobile() {
  return window.innerWidth <= 1440; // or your preferred breakpoint
}

function setMobileLayout() {
   if (currentPreviewModal) {
    currentPreviewModal.classList.add("hidden");
    currentPreviewModal = null;
  }
  if (isMobile()) {
    // Always show straight layout, hide toggle
    straightLayoutContainer.classList.remove("hidden");
    main.classList.add("hidden");
    
    layoutToggle.style.display = "none";
    isStraightLayout = true;
    populateStraightLayout(); // <-- Populate the straight layout!
     info.style.display = "none"; // Hide info in mobile layout
  } else {
    // Restore normal toggle behavior
    layoutToggle.style.display = "";
     info.style.display = ""; // Show info in desktop layout
    if (!isStraightLayout) {
      straightLayoutContainer.classList.add("hidden");
      main.classList.remove("hidden");
      // Show links again
      allLinks.forEach((link) => {
        link.style.display = "block";
      });
    }
  }
}

window.addEventListener("resize", setMobileLayout);
window.addEventListener("DOMContentLoaded", setMobileLayout);