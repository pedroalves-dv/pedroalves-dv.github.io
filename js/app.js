document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  // Set canvas size
  // canvas.width = window.innerWidth * 0.8; // 80% of the window width
  // canvas.height = window.innerHeight * 0.8; // 80% of the window height

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

  // function startDrawing(event) {
  //   isDrawing = true;
  // Increment the color index
  //   colorIndex = (colorIndex + 1) % colors.length;
  //   ctx.beginPath();

  // }

  function startDrawing(event) {
    isDrawing = true;

    // Increment the color index
    // colorIndex = (colorIndex + 1) % colors.length;

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
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let isDrawing = false;

  // Define colors for drawing
  const colors = ["red", "#fc3b00", "#c1fc00", "#5000fc", "green", "#ff7393", "lightgray"];
  let colorIndex = 0;

  // Event listeners for drawing
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  function startDrawing(event) {
    isDrawing = true;
    colorIndex = Math.floor(Math.random() * colors.length);
    ctx.beginPath();
    ctx.strokeStyle = colors[colorIndex];
    ctx.lineWidth = 60;
    ctx.lineCap = "round";
    ctx.shadowBlur = 30;
    ctx.shadowColor = `rgba(${hexToRgb(colors[colorIndex])}, 0.5)`;
  }

  function draw(event) {
    if (!isDrawing) return;
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.moveTo(x, y);
  }

  function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
  }

  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }

  // Link hover animation and random positioning
  const allLinks = document.querySelectorAll("a");

  // Set initial random positions
  allLinks.forEach(link => {
    const randomX = Math.floor(Math.random() * 300) - 150; // Random X between -150px and 150px
    const randomY = Math.floor(Math.random() * 300) - 150; // Random Y between -150px and 150px
    link.style.transform = `translate(${randomX}px, ${randomY}px)`;
  });

  allLinks.forEach((link, index) => {
    link.addEventListener("mouseover", () => {
      link.style.zIndex = 10; // Bring the hovered link to the front
      const randomColor = getRandomVividColor();
      link.style.setProperty('--smudge-color', randomColor);

      // Move other links to random positions within container
      allLinks.forEach((otherLink, otherIndex) => {
        if (otherIndex !== index) {
          const randomX = Math.floor(Math.random() * 350) - 175; // Random X between -175px and 175px
          const randomY = Math.floor(Math.random() * 350) - 175; // Random Y between -175px and 175px
          otherLink.style.transition = "transform 0.6s ease";
          otherLink.style.transform = `translate(${randomX}px, ${randomY}px)`;
          otherLink.style.filter = "blur(2px)";
        }
      });
    });

    link.addEventListener("mouseout", () => {
      link.style.zIndex = ""; // Reset z-index
      allLinks.forEach((otherLink) => {
        otherLink.style.filter = ""; // Remove blur effect
      });
    });
  });
});
// Function to generate random letter spacing for hover effect
function getRandomLetterSpacing() {
  return Math.floor(Math.random() * 20) + 1; // Random letter-spacing between 1px and 6px
}

// Function to get a random vivid color
function getRandomVividColor() {
  const colors = ["#de2a2a", "#3bd43b", "#3232d1", "#ffff2b", "#3e1ba8", "#1ee3e3"];
  return colors[Math.floor(Math.random() * colors.length)];
}


