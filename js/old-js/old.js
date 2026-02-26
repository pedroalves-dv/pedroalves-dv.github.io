  
// OLD CODE V2  
// document.addEventListener("DOMContentLoaded", () => {
//   // OLD CODE V2.1
//   // Link hover animation and random positioning
//   const allLinks = document.querySelectorAll("a");

//   // Set initial random positions
//   allLinks.forEach(link => {
//     randomX = Math.floor(Math.random() * (window.innerWidth) / 2);
//     randomY = Math.floor(Math.random() * (window.innerHeight) / 2);
//     link.style.transform = `translate(${randomX}px, ${randomY}px)`;

//   });

//   allLinks.forEach((link, index) => {
//     link.addEventListener("mouseover", () => {
//       // Move other links to random positions within container
//       allLinks.forEach((otherLink, otherIndex) => {
//         if (otherIndex !== index) {
//           let randomX, randomY;
//           let isOverlapping;

//           do {
//             isOverlapping = false;

//             randomX = Math.floor(Math.random() * (window.innerWidth - link.offsetWidth));
//             randomY = Math.floor(Math.random() * (window.innerHeight - link.offsetHeight));

//             // randomX = Math.floor(Math.random() * 350) - 150; // Random X between -175px and 175px
//             // randomY = Math.floor(Math.random() * 350) - 150; // Random Y between -175px and 175px

//             // Check for overlap with other links
//             const rect1 = otherLink.getBoundingClientRect();
//             const rect2 = {
//               left: rect1.left + randomX,
//               top: rect1.top + randomY,
//               right: rect1.right + randomX,
//               bottom: rect1.bottom + randomY
//             };

//             // Check overlap against all other links
//             allLinks.forEach((checkLink, checkIndex) => {
//               if (checkIndex !== otherIndex && checkIndex !== index) {
//                 const rect3 = checkLink.getBoundingClientRect();
            
//                 // Log raw bounding box
//                 console.log(`Raw rect3: (${rect3.left}, ${rect3.top}, ${rect3.right}, ${rect3.bottom})`);
                
            
//                  // Apply transform adjustments
//                 const transform = window.getComputedStyle(checkLink).transform;
//                 if (transform !== "none") {
//                   const matrix = transform
//                     .replace(/matrix\(|\)/g, "")
//                     .split(", ")
//                     .map(parseFloat);
//                   const offsetX = matrix[4] || 0; // Translation X
//                   const offsetY = matrix[5] || 0; // Translation Y
            
//                   // Adjust rect3 based on transform
//                   rect3.left += offsetX;
//                   rect3.right += offsetX;
//                   rect3.top += offsetY;
//                   rect3.bottom += offsetY;
//                 }
            
//                 // Log the adjusted rect3 for debugging
//                 console.log(`Adjusted rect3 (with transform): (${rect3.left}, ${rect3.top}, ${rect3.right}, ${rect3.bottom})`);
            
//                 // Check for overlap with rect2
//                 if (
//                   rect2.left < rect3.right &&
//                   rect2.right > rect3.left &&
//                   rect2.top < rect3.bottom &&
//                   rect2.bottom > rect3.top
//                 ) {
//                   console.log(
//                     `Detected overlap: rect2(${rect2.left}, ${rect2.top}, ${rect2.right}, ${rect2.bottom}) overlaps with rect3(${rect3.left}, ${rect3.top}, ${rect3.right}, ${rect3.bottom})`
//                   );
//                   isOverlapping = true;
//                 }
//               }
//             });
            
//             // Final overlap state log
//             console.log(`Final overlap state for link "${otherLink.textContent}": ${isOverlapping}`);
//             if (!isOverlapping) {
//               console.log(`Exiting loop: Position (${randomX}, ${randomY}) for link "${otherLink.textContent}" is valid.`);
//             }

//              // Ensure the new position stays within the viewport
//         if (
//           rect2.left < 0 ||
//           rect2.right > window.innerWidth ||
//           rect2.top < 0 ||
//           rect2.bottom > window.innerHeight
//         ) {
//           console.log(`Position out of bounds for link: ${otherLink.textContent}`);
//           isOverlapping = true; // Out of bounds
//         }
//           } while (isOverlapping);

//           otherLink.style.transition = "transform 0.6s ease";
//           otherLink.style.transform = `translate(${randomX}px, ${randomY}px)`;
//           otherLink.style.filter = "blur(2px)";
//         }
//       });
//     });

//     link.addEventListener("mouseout", () => {
//       // link.style.zIndex = ""; 
//       allLinks.forEach((otherLink) => {
//         otherLink.style.filter = ""; // Remove blur effect
//       });
//     });
//   });
// });
