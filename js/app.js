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
    const colors = ["red", "#fc3b00", "#c1fc00", "#5000fc", "indigo", "#ff7393", "black"];
    let colorIndex = 0;

  // Event listeners
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  function startDrawing(event) {
    isDrawing = true;
        // Increment the color index
    colorIndex = (colorIndex + 1) % colors.length;
  }


  function draw(event) {
    if (!isDrawing) return;

    // Get mouse coordinates
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    // Draw on the canvas
    ctx.lineWidth = 35;
    ctx.lineCap = "round";
    ctx.strokeStyle = colors[colorIndex]; // Change this value to adjust the stroke color
    ctx.shadowBlur = 20; // Change this value to adjust the amount of blur
    ctx.shadowColor = colors[colorIndex]; // Change this value to adjust the shadow color
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
