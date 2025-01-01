const face = document.getElementById("face");
let hairCount = 0;
const hairs = []; // Array to store the positions of all hairs
const trimmer = document.getElementById("trimmer");
const score = document.getElementById('score');
let currentScore = 0;
const audio = document.getElementById('myAudio');
audio.loop = true; // Enable looping
audio.volume = 0.5;
const info = document.getElementById('info');
const eb1 = document.getElementById('eb1');
const eb2 = document.getElementById('eb2');


let isGrowing = false; // Flag to prevent multiple growHair calls

// Create and grow hair
function growHair() {
  if (hairCount >= 100 || isGrowing) {
    return; 
  }
  isGrowing = true; // Prevent further hair growth until the current growHair finishes

  let validPosition = false;
  let x, y;

  // Loop until a valid position is found
  while (!validPosition) {
    const angle = Math.random() * Math.PI; // Random angle
    const radius = Math.random() * 370; // Random radius within the circle
    x = 370 + radius * Math.cos(angle); // Convert polar to cartesian
    y = 400 + radius * Math.sin(angle);

    // Check distance from all existing hairs
    validPosition = hairs.every(({ position }) => {
      const [hx, hy] = position;
      const distance = Math.sqrt((x - hx) ** 2 + (y - hy) ** 2);
      return distance >= 20; // Ensure at least 20px distance
    });
  }

  // Create hair and position it
  const hair = document.createElement("div");
  hair.style.position = "absolute";
  hair.style.width = "1px";
  hair.style.height = "2px";
  hair.style.backgroundColor = "black";
  hair.style.borderRadius = "3px";
  hair.style.left = `${x}px`;
  hair.style.top = `${y}px`;
  hair.style.transform = 'scaleY(1)';
  hair.style.transition = 'transform 1s ease-in-out';

  // Add hair to the face and store its position
  face.appendChild(hair);
  hairs.push({ element: hair, position: [x, y] });
  hairCount++;

  setTimeout(() => {
    hair.style.transform = 'scaleY(3)';
    isGrowing = false; // Allow the next growHair call after this finishes
  }, 50);
  score.innerText = `${currentScore}`;
}

// Start growing hair every second using requestAnimationFrame for smoother updates
function startGrowingHair() {
  function loop() {
    growHair();
    requestAnimationFrame(loop); // Keep calling growHair at optimal intervals
  }
  loop();
}

// Start hair growth loop
startGrowingHair();

function ebmove(){

}

document.addEventListener('mousemove', (event) => {
  trimmer.style.left = `${event.clientX - 35}px`;
  trimmer.style.top = `${event.clientY}px`;

  detectCollisions();
});

document.addEventListener('click', () => {

  
        
    if(audio.paused){
        audio.play().catch((error) => console.error('Playback error:', error));}
    else{ audio.pause()}
    info.remove();
  });
  

// Function to check for collision between trimmer and hair
function checkCollision(trimmer, hair) {
  const trimmerRect = trimmer.getBoundingClientRect();
  const hairRect = hair.getBoundingClientRect();

  // Check if the bounding boxes of trimmer and hair overlap
  return !(hairRect.right < trimmerRect.left || 
           hairRect.left > trimmerRect.right || 
           hairRect.bottom < trimmerRect.top || 
           hairRect.top > trimmerRect.bottom);
}

// Function to handle hair collision detection
async function detectCollisions() {

  // Loop through all hairs and check for collision
  hairs.forEach(({ element, position }, index) => {
    if (checkCollision(trimmer, element)) {
        // element.style.backgroundColor = 'red';
      

      // Apply translation effect on collision
      element.style.transform = 'translate(0px, 100px)';
    //   hairsToRemove.push(index); // Mark hair to be removed
      hairs.splice(index, 1); // Remove hair from array
      hairCount--;
      currentScore++;
      
      // Remove hair after a timeout
      setTimeout(() => {
        removeHair(element);
      }, 1000);
    }
  });

function removeHair(hair) {
  hair.remove();
}}
