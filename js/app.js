document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let isDrawing = false;

  // Define the colors and the current color index
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
    ctx.lineWidth = 60;
    ctx.lineCap = "round";
    ctx.strokeStyle = colors[colorIndex]; // Change this value to adjust the stroke color
    ctx.shadowBlur = 30; // Change this value to adjust the amount of blur
    ctx.shadowColor = colors[colorIndex]; // Change this value to adjust the shadow color
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.lineWidth = 60;
    ctx.lineCap = "round";
    ctx.strokeStyle = colors[colorIndex]; // Solid stroke color for the line
    ctx.shadowBlur = 30; // No shadow for the line
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
    
    const allLinks = document.querySelectorAll("a");

    // Log all links and their text content
    console.log("All links:", allLinks);
    console.log("Number of links:", allLinks.length);
    allLinks.forEach((link) => console.log(link.textContent));
    

     // Function to position links using a grid system
  function positionLinksUsingGrid(excludeLink) {
    const gridCellWidth = 150; // Approximate width of links
    const gridCellHeight = 100; // Approximate height of links
    const paddingX = 100; // Left and right padding (space around the edges)
    const paddingY = 50; // Top and bottom padding (space around the edges)

    // Calculate available space excluding the padding zone
    const usableWidth = window.innerWidth - paddingX;
    const usableHeight = window.innerHeight - paddingY;

    const columns = Math.floor(usableWidth / gridCellWidth);
    const rows = Math.floor(usableHeight / gridCellHeight);

    // Initialize the grid with false values (no links placed yet)
    const grid = Array.from({ length: rows }, () => Array(columns).fill(false));


    
    allLinks.forEach((link) => {
      if (link === excludeLink) return; // Skip the hovered link

      let placed = false;
      while (!placed) {
        const randomCol = Math.floor(Math.random() * columns);
        const randomRow = Math.floor(Math.random() * rows);

        if (!grid[randomRow][randomCol]) {
          grid[randomRow][randomCol] = true;

          const randomX = paddingX + randomCol * gridCellWidth;
          const randomY = paddingY + randomRow * gridCellHeight;

          link.style.transform = `translate(${randomX}px, ${randomY}px)`;

          placed = true;
        }
      }
    });
  }

  // Initial positioning using the grid
  positionLinksUsingGrid();

  // Move links on hover
  allLinks.forEach((link) => {
    link.addEventListener("mouseover", () => {
      positionLinksUsingGrid(link); // Reposition all links using the grid
      
      allLinks.forEach((otherLink) => {
        if (otherLink !== link) {  // Apply the blur only to non-hovered links
          otherLink.style.transition = "transform 1.2s ease";
          otherLink.style.filter = "blur(2px)";
        } else {
          otherLink.style.filter = ""; // Ensure the hovered link is not blurred
        }
      });
    });

    link.addEventListener("mouseout", () => {
      allLinks.forEach((otherLink) => {
        otherLink.style.filter = ""; // Remove blur effect
      });
    });
  });
});