document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  // // Set canvas size
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
  //   // Increment the color index
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
