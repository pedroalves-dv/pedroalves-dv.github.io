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
  let isDarkMode = localStorage.getItem("dark-mode") === "enabled";

  function updateDarkMode() {
    body.classList.toggle("dark-mode", isDarkMode);
    const filterValue = isDarkMode ? "invert(0)" : "invert(1)";
    layoutToggle.style.filter = filterValue;
    darkModeToggle.style.filter = filterValue;
    const darkModeIcon = darkModeToggle.querySelector("img");
  if (darkModeIcon) {
    darkModeIcon.src = isDarkMode
      ? "assets/images/straight-layout.png"
      : "assets/images/scattered-layout.png";
    darkModeIcon.alt = isDarkMode ? "Disable Dark Mode" : "Enable Dark Mode";
  }
    localStorage.setItem("dark-mode", isDarkMode ? "enabled" : "disabled");
  }

  updateDarkMode();

  darkModeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    updateDarkMode();
  });

//---------------------------------------------------------------------------------------
// Layouts
  const allLinks = document.querySelectorAll("main a");
  const main = document.querySelector("main");
  const straightLayoutContainer = document.querySelector(".straight-layout-container");
  const projects = document.querySelector(".projects");
  const info = document.querySelector(".info");
  let isStraightLayout = false;
  let assignedPositions = new Map();

//---------------------------------------------------------------------------------------
// Scattered Layout
function generateGridPositions() {
  const gridCellWidth = 200;
  const gridCellHeight = 70;

  // Customize these to control grid position
  const paddingTop = 70;
  const paddingRight = 300;
  const paddingBottom = 150;
  const paddingLeft = 100;

  const usableWidth = window.innerWidth - paddingLeft - paddingRight;
  const usableHeight = window.innerHeight - paddingTop - paddingBottom;
  const columns = Math.floor(usableWidth / gridCellWidth);
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
      // Hide previous modal
      if (currentPreviewModal) {
        currentPreviewModal.classList.add("hidden");
      }
      // Show new modal
      const previewId = link.getAttribute("data-preview-id");
      if (previewId) {
        const modal = document.getElementById(previewId);
        if (modal) {
          // Assign a random top position (px)
          const minTop = 25;
          const maxTop = 440;
          const randomTop = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
          modal.style.top = `${randomTop}px`;
          modal.style.right = "30px"; // keep right fixed

          modal.classList.remove("hidden");
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

    // document.body.style.overflow = "hidden";
  } else {
    projects.classList.remove("fade-in");
    info.classList.remove("fade-in");
    straightLayoutContainer.classList.add("hidden");
    main.classList.remove("hidden");
    main.classList.add("fade-in");
    layoutToggle.innerHTML = `<img src="assets/images/scattered.png" alt="Scattered Layout">`;

    allLinks.forEach((link) => {
      link.style.display = "block";
    });

    assignGridPositions();

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
//---------------------------------------------------------------------------------------

  // showGridCells()


//---------------------------------------------------------------------------------------
// Shuffle positions on hover with a cooldown on the shuffling for ease of use

let canShuffle = true;

allLinks.forEach((link) => {
  link.addEventListener("mouseover", () => {
    if (!canShuffle) return; // Prevent shuffling if not allowed

    canShuffle = false;
    shufflePositions(link);

    setTimeout(() => {
      canShuffle = true;
    }, 6000);
  });
});

//---------------------------------------------------------------------------------------
// Change link colors on hover (random)

// allLinks.forEach(link => {
//   link.addEventListener("mouseenter", () => {
//     const randomColor = `hsl(${Math.floor(Math.random()*360)}, 80%, 50%)`;
//     link.style.color = randomColor;
//   });
//   link.addEventListener("mouseleave", () => {
//     link.style.color = ""; // Reset on mouse out
//   });
// });

//---------------------------------------------------------------------------------------
// Change link colors on hover (saturated colors)


const saturatedColors = [
  "#ff0000", // red
  "#ff8000", // orange
  "#ffff00", // yellow
  "#80ff00", // lime
  "#00ff00", // green
  "#00ff80", // spring green
  "#00ffff", // cyan
  "#0080ff", // azure
  "#0000ff", // blue
  "#8000ff", // violet
  "#ff00ff", // magenta
];


allLinks.forEach(link => {
  link.addEventListener("mouseenter", () => {
    const randomColor = saturatedColors[Math.floor(Math.random() * saturatedColors.length)];
    link.style.color = randomColor;
  });
  link.addEventListener("mouseleave", () => {
    link.style.color = ""; // Reset on mouse out
  });
});

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