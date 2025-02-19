// Canvas Drawing Functionality
// ===============================================================================
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

// Dark Mode Functionality
// ===============================================================================
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

// Layouts
// ===============================================================================
  const allLinks = document.querySelectorAll("main a");
  const main = document.querySelector("main");
  const straightLayoutContainer = document.querySelector(".straight-layout-container");
  const projects = document.querySelector(".projects");
  const info = document.querySelector(".info");
  let isStraightLayout = false;
  let assignedPositions = new Map();

// Scattered Layout

  function generateGridPositions() {
    const gridCellWidth = 150;
    const gridCellHeight = 50;
    const paddingX = window.innerWidth * 0.3;
    const paddingY = window.innerHeight * 0.2;
    const usableWidth = window.innerWidth - 2 * paddingX;
    const usableHeight = window.innerHeight - 2 * paddingY;
    const columns = Math.floor(usableWidth / gridCellWidth);
    const rows = Math.floor(usableHeight / gridCellHeight);

    let positions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        positions.push({
          x: paddingX + col * gridCellWidth,
          y: paddingY + row * gridCellHeight,
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

  // Strtaight Layout

  layoutToggle.addEventListener("click", () => {
    isStraightLayout = !isStraightLayout;

    if (isStraightLayout) {
      straightLayoutContainer.classList.remove("hidden");
      main.classList.add("hidden");
      layoutToggle.innerHTML = `<img src="assets/images/straight.png" alt="Straight Layout">`;

      projects.innerHTML = "";

      allLinks.forEach((link) => {
        const card = document.createElement("div");
        card.classList.add("card");
        const slug = link.textContent.toLowerCase().replace(/\s+/g, '-');
        card.classList.add(`${slug}-card`);
        card.innerHTML = `
          <a href="${link.href}" target="_blank">
          <img src="${link.getAttribute("data-screenshot")}" alt="${link.textContent}">
          <div class="card-content">
            <h3 class="indent-card">${link.textContent.toUpperCase()}</h3>
            <p>${link.getAttribute("data-description")}</p>
          </div>
          </a>`;
          
        projects.appendChild(card);
        link.style.display = "none";
      });

      straightLayoutContainer.appendChild(projects);
      straightLayoutContainer.appendChild(info);
     
    } else {
      straightLayoutContainer.classList.add("hidden");
      main.classList.remove("hidden");
      layoutToggle.innerHTML = `<img src="assets/images/scattered.png" alt="Scattered Layout">`;

      allLinks.forEach((link) => {
        link.style.display = "block";
      });

      assignGridPositions();
    }
  });

  assignGridPositions();

  allLinks.forEach((link) => {
    link.addEventListener("mouseover", () => shufflePositions(link));
  });
