document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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
  let colorIndex = 0;

  // Event listeners
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  function startDrawing(event) {
    isDrawing = true;

    // Generate a random index
    colorIndex = Math.floor(Math.random() * colors.length);

    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    ctx.lineWidth = 60;
    ctx.lineCap = "round";
    ctx.strokeStyle = colors[colorIndex];
    ctx.shadowBlur = 30;
    ctx.shadowColor = colors[colorIndex];

    ctx.beginPath();
    ctx.stroke();
  }

  function draw(event) {
    if (!isDrawing) return;

    // Get mouse coordinates
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    // Draw on the canvas
    ctx.lineWidth = 50;
    ctx.lineCap = "round";
    ctx.strokeStyle = colors[colorIndex]; 
    ctx.shadowBlur = 30; 
    ctx.shadowColor = colors[colorIndex]; 
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.lineWidth = 50;
    ctx.lineCap = "round";
    ctx.strokeStyle = colors[colorIndex];
    ctx.shadowBlur = 50; 
    ctx.shadowColor = colors[colorIndex];
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Start a new path
  }});


  document.addEventListener("DOMContentLoaded", () => {
    const toggleSwitch = document.getElementById("checkbox");
    const body = document.body;
    const layoutToggle = document.getElementById("layoutToggle");
  
    // Check if dark mode is stored in localStorage
    if (localStorage.getItem("dark-mode") === "disabled") {
      body.classList.remove("dark-mode");
      layoutToggle.classList.remove("dark-mode");
      layoutToggle.style.filter = "invert(1)";
      toggleSwitch.checked = false;
    } else {
      // Default to dark mode
      body.classList.add("dark-mode");
      layoutToggle.classList.add("dark-mode");
      layoutToggle.style.filter = "invert(0)";
      toggleSwitch.checked = true;
      localStorage.setItem("dark-mode", "enabled"); // Ensure persistence
    }
  
    // Toggle dark mode on click
    toggleSwitch.addEventListener("change", () => {
      if (toggleSwitch.checked) {
        body.classList.add("dark-mode");
        layoutToggle.classList.add("dark-mode");
        layoutToggle.style.filter = "invert(0)";
        localStorage.setItem("dark-mode", "enabled"); // Save preference
      } else {
        body.classList.remove("dark-mode");
        layoutToggle.classList.remove("dark-mode");
        layoutToggle.style.filter = "invert(1)";
        localStorage.setItem("dark-mode", "disabled"); // Save preference
      }
    });
  });
  


//   document.addEventListener("DOMContentLoaded", () => {
    
//     const allLinks = document.querySelectorAll("a");

//     // Log all links and their text content
//     console.log("All links:", allLinks);
//     console.log("Number of links:", allLinks.length);
//     allLinks.forEach((link) => console.log(link.textContent));
    

//      // 1️⃣ Generate a fixed grid of positions
//   function generateGridPositions() {
//     const gridCellWidth = 150;
//     const gridCellHeight = 50;
//     const paddingX = window.innerWidth * 0.3;
//     const paddingY = window.innerHeight * 0.3;

//     const usableWidth = window.innerWidth - 2 * paddingX;
//     const usableHeight = window.innerHeight - 2 * paddingY;

//     const columns = Math.floor(usableWidth / gridCellWidth);
//     const rows = Math.floor(usableHeight / gridCellHeight);

//     let positions = [];
//     for (let row = 0; row < rows; row++) {
//       for (let col = 0; col < columns; col++) {
//         positions.push({
//           x: paddingX + col * gridCellWidth,
//           y: paddingY + row * gridCellHeight
//         });
//       }
//     }
//     return positions;
//   }

//   const allPositions = generateGridPositions(); // Fixed grid positions
//   let assignedPositions = new Map(); // Store link positions

//   // 2️⃣ Assign each link a unique position at start
//   function assignInitialPositions() {
//     let availablePositions = [...allPositions]; // Copy of grid positions
//     allLinks.forEach((link) => {
//       if (availablePositions.length === 0) return;
//       const randomIndex = Math.floor(Math.random() * availablePositions.length);
//       const position = availablePositions.splice(randomIndex, 1)[0]; // Remove from available
//       assignedPositions.set(link, position);
//       link.style.transform = `translate(${position.x}px, ${position.y}px)`;
//     });
//   }

//   // 3️⃣ When a link is hovered, shuffle other links' positions
//   function shufflePositions(excludeLink) {
//     let availablePositions = [...assignedPositions.values()]; // All occupied positions
//     let hoveredPosition = assignedPositions.get(excludeLink);
    
//     if (hoveredPosition) {
//       availablePositions = availablePositions.filter(pos => pos !== hoveredPosition);
//     }

//     let shuffledPositions = availablePositions.sort(() => Math.random() - 0.5); // Shuffle
//     let index = 0;

//     allLinks.forEach((link) => {
//       if (link === excludeLink) return; // Keep hovered link in place

//       const newPos = shuffledPositions[index++];
//       assignedPositions.set(link, newPos);
//       link.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
//     });
//   }

// // 4️⃣ Add event listeners
//   assignInitialPositions(); // Set initial positions

//   allLinks.forEach((link) => {
//     link.addEventListener("mouseover", () => {
//       shufflePositions(link);
//       // allLinks.forEach(link => link.style.pointerEvents = "none"); // Disable other links
//       // setTimeout(() => {
//       //   allLinks.forEach(link => link.style.pointerEvents = "auto"); // Re-enable
//       // }, 1000);
//     });
//   });



    
  

//   // // Initial positioning using the grid
//   // positionLinksUsingGrid();

//   // // Move links on hover
//   // allLinks.forEach((link) => {
//   //   link.addEventListener("mouseover", () => {
//   //     positionLinksUsingGrid(link);
      
//   //     link.style.filter = "none";
//   //   });

//   //   link.addEventListener("mouseout", () => {
//   //     allLinks.forEach((otherLink) => {
//   //       otherLink.style.filter = ""; // Remove blur effect
//   //     });
//   //   });
//   // });
  
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const layoutToggle = document.getElementById("layoutToggle");
//   const previewBox = document.getElementById("previewBox");
//   const allLinks = document.querySelectorAll("a");

//   let isVerticalLayout = false; // Track layout state

//   layoutToggle.addEventListener("click", () => {
//     isVerticalLayout = !isVerticalLayout;

//     if (isVerticalLayout) {
//       document.body.classList.add("vertical-layout");

//       // Reset transforms to avoid overlap
//       allLinks.forEach((link) => {
//         link.style.transform = "none"; 
//       });
//     } else {
//       document.body.classList.remove("vertical-layout");

//       // Restore shuffled positions
//       allLinks.forEach((link) => {
//         const position = assignedPositions.get(link);
//         if (position) {
//           link.style.transform = `translate(${position.x}px, ${position.y}px)`;
//         }
//       });
//     }
//   });

//   // Handle hover previews
//   allLinks.forEach((link) => {
//     link.addEventListener("mouseover", () => {
//       if (!isVerticalLayout) return; // Only show preview in vertical mode

//       const previewUrl = link.getAttribute("href"); // Get the URL

//       // If needed, replace with an iframe:
//       previewBox.innerHTML = `<iframe src="${previewUrl}" width="100%" height="100%" style="border:none;"></iframe>`;
//       previewBox.style.display = "block";
//     });

//     link.addEventListener("mouseout", () => {
//       previewBox.style.display = "none"; // Hide preview when not hovering
//     });
//   });
// })

document.addEventListener("DOMContentLoaded", () => {
  const layoutToggle = document.getElementById("layoutToggle");
  const previewBox = document.getElementById("previewBox");
  const allLinks = document.querySelectorAll("a");
  const body = document.body;

  let isStraightLayout = false; // Track layout state
  let assignedPositions = new Map(); // Store positions for grid mode


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
          y: paddingY + row * gridCellHeight
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
      availablePositions = availablePositions.filter(pos => pos !== hoveredPosition);
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

  // Toggle layout button
  layoutToggle.addEventListener("click", () => {
    isStraightLayout = !isStraightLayout;
    
    if (isStraightLayout) {
      body.classList.add("straight-layout");
      body.classList.remove("scattered-layout");
      const layoutToggle = document.getElementById("layoutToggle");
      layoutToggle.innerHTML = "";
      layoutToggle.innerHTML = `<img src="assets/images/straight-layout.png" style="width: 25px;" alt="Straight Layout">`;

      // Reset links for straight layout 
      allLinks.forEach((link, index) => {
        link.style.transform = "none";
        link.style.position = "relative";
        link.style.margin = "10px 0";
        link.style.textAlign = "right";
      });

    } else {
      body.classList.remove("straight-layout");
      body.classList.add("scattered-layout");
      layoutToggle.innerHTML = "";
      layoutToggle.innerHTML = `<img src="assets/images/scattered-layout.png" style="width: 25px;" alt="Scattered Layout">`;

      // Restore grid layout
      allLinks.forEach((link) => {
        link.style.position = "absolute";
      });
      assignGridPositions();
    }
  });

  // Initial grid setup
  assignGridPositions();

  // Hover movement (only for grid layout)
  allLinks.forEach((link) => {
    link.addEventListener("mouseover", () => {
      shufflePositions(link);
    });
  });

  // Hover preview (only in straight mode)
  allLinks.forEach((link) => {
    link.addEventListener("mouseover", () => {
      if (!isStraightLayout) return; // Only show preview in straight mode
  
      const previewUrl = link.getAttribute("href");
  
      if (previewUrl.includes("github.com")) {
        previewBox.style.display = "none";
        document.querySelector(".github-arrow").style.display = "inline-block";
      } else {
        // Use the link's text (trimmed, lowercased, spaces replaced with underscores) for the screenshot name
        const linkName = link.textContent.trim().toLowerCase().replace(/\s+/g, '_');
        const screenshotUrl = `assets/images/${linkName}.jpg`; 
  
        previewBox.innerHTML = `<img src="${screenshotUrl}" alt="${link.textContent}">`;
        previewBox.style.display = "block";
      }
    });
  
    link.addEventListener("mouseout", () => {
      previewBox.style.display = "none"; // Hide preview when not hovering
      document.querySelector(".github-arrow").style.display = "none";
    });
  });

  
});

// document.addEventListener("DOMContentLoaded", () => {
//   const screensaver = document.createElement("canvas");
//   screensaver.id = "screensaver";
//   screensaver.style.position = "fixed";
//   screensaver.style.top = "0";
//   screensaver.style.left = "0";
//   screensaver.style.width = "100vw";
//   screensaver.style.height = "100vh";
//   screensaver.style.display = "none";
//   screensaver.style.zIndex = "9999";
//   document.body.appendChild(screensaver);
//   // screensaver.style.imageRendering = "pixelated";

//   const ctx = screensaver.getContext("2d");

//   let timeout;
//   let isScreensaverActive = false;

//   const box = {
//       x: Math.random() * (window.innerWidth - 50),
//       y: Math.random() * (window.innerHeight - 50),
//       size: 50,
//       dx: (Math.random() > 0.5 ? 1 : -1) * 2,
//       dy: (Math.random() > 0.5 ? 1 : -1) * 2
//   };

//   function drawLogo(ctx, x, y, scale = 1) {
//     ctx.clearRect(0, 0, screensaver.width, screensaver.height);

//     const ovalWidth = 150 * scale;
//     const ovalHeight = 60 * scale;

//     // === OVAL (Outer Border) ===
//     ctx.beginPath();
//     ctx.ellipse(x, y, ovalWidth, ovalHeight, 0, 0, Math.PI * 2);
//     ctx.strokeStyle = "white"; // Border color
//     ctx.lineWidth = 4 * scale;
//     ctx.stroke();

//     // === "SUPER WEBSITE" TEXT ===
//     ctx.font = `${22 * scale}px 'Press Start 2P', sans-serif`; // Pixel-style font
//     ctx.fillStyle = "white";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle"; // Centers text in the oval
//     ctx.fillText("VERY COOL", x, y);
// }

// // === Update Bounce Logic to Fit the Oval ===
// function updateScreensaver() {
//     if (!isScreensaverActive) return;

//     ctx.clearRect(0, 0, screensaver.width, screensaver.height);

//     const ovalWidth = 150;  // Half of the actual width
//     const ovalHeight = 60;  // Half of the actual height

//     // Move the logo
//     box.x += box.dx;
//     box.y += box.dy;

//     // Bounce off edges using the actual oval size
//     if (box.x - ovalWidth <= 0 || box.x + ovalWidth >= screensaver.width) {
//         box.dx *= -1;
//     }
//     if (box.y - ovalHeight <= 0 || box.y + ovalHeight >= screensaver.height) {
//         box.dy *= -1;
//     }

//     // Draw the logo
//     drawLogo(ctx, box.x, box.y);

//     requestAnimationFrame(updateScreensaver);
// }

//   function showScreensaver() {
//       isScreensaverActive = true;
//       screensaver.width = window.innerWidth;
//       screensaver.height = window.innerHeight;
//       screensaver.style.display = "block";

//       // Hide UI elements
//         document.getElementById("main").style.display = "none";
//         document.getElementById("layoutToggle").style.display = "none";
//         document.getElementById("darkmode").style.display = "none";
//       updateScreensaver();
//   }

//   function hideScreensaver() {
//       isScreensaverActive = false;
//       screensaver.style.display = "none";

//       // Show UI elements
//       document.getElementById("main").style.display = "inline-block";
//       document.getElementById("layoutToggle").style.display = "inline-block";
//       document.getElementById("darkmode").style.display = "inline-block";
//       resetScreensaverTimer();
//   }

//   function resetScreensaverTimer() {
//       clearTimeout(timeout);
//       if (isScreensaverActive) hideScreensaver();
//       timeout = setTimeout(showScreensaver, 25000); // 1-minute delay
//   }

//   // Reset timer on user activity
//   ["mousemove", "keydown", "click", "scroll"].forEach(event => {
//       document.addEventListener(event, resetScreensaverTimer);
//   });

//   // Responsive resizing
//   window.addEventListener("resize", () => {
//       screensaver.width = window.innerWidth;
//       screensaver.height = window.innerHeight;
//   });

//   resetScreensaverTimer();
// });

