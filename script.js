function openFullscreen() {
  let element = document.documentElement;
  if (element.requestFullscreen) element.requestFullscreen();
  else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
  else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
  else if (element.msRequestFullscreen) element.msRequestFullscreen();
}

let timerInterval;

function startTimer() {
  const timerDisplay = document.getElementById('timer');
  const submitAlert = document.getElementById('submitAlert');

  let totalTime = 105 * 60; // UPDATED TO 1HR 45MINS
  const blinkTime = 15 * 60;
  let blink = false;

  timerInterval = setInterval(() => {

    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;

    timerDisplay.textContent = 
      (minutes < 10 ? "0" + minutes : minutes) + ":" + 
      (seconds < 10 ? "0" + seconds : seconds);

    if (totalTime <= blinkTime) {
      blink = !blink;
      timerDisplay.style.visibility = blink ? "visible" : "hidden";
      timerDisplay.style.color = "red";
      submitAlert.style.display = "block";
    }

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "00:00";
      timerDisplay.style.visibility = "visible";
      submitAlert.textContent = "TIME UP! SUBMIT NOW!";
      submitAlert.style.display = "block";
    }

    totalTime--;
  }, 1000);
}

const subjectMap = {
  "Further Mathematics Examination": {
    submitUrl: "https://docs.google.com/forms/d/e/1FAIpQLScwWc0knbK1YiKpTFjbEtWDeCk3RLqUShmEkLITjvGzGbpgPg/viewform",
    entryID: "entry.1522719571"
  }
};

document.getElementById("startBtn").addEventListener("click", function() {

  const name = document.getElementById("studentName").value.trim();
  const selectedText = document.getElementById("subjectSelect").value;

  if(!name){ 
    alert("Please enter your name before starting."); 
    return; 
  }

  if(!selectedText){ 
    alert("Please select your subject before starting."); 
    return; 
  }

  const subjectData = subjectMap[selectedText];
  if(!subjectData){ 
    alert("Invalid subject selected."); 
    return; 
  }

  openFullscreen();
  document.getElementById("welcomeScreen").style.display = "none";

  const iframe = document.getElementById("examForm");
  const viewFormUrl = subjectData.submitUrl.replace("formResponse", "viewform");

  iframe.src = viewFormUrl + "?" + subjectData.entryID + "=" + encodeURIComponent(name);
  iframe.style.display = "block";

  startTimer();
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    alert("You exited full screen! The exam requires full screen mode.");
    location.reload();
  }
});

// Particle animation
const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const colors = ["rgba(255,255,255,0.7)", "rgba(255,255,255,0.5)"];

class Particle {
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.speedY = Math.random() * 0.5 + 0.2;
  }
  update(){
    this.y -= this.speedY;
    if(this.y < 0) this.y = canvas.height;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
    ctx.fill();
  }
}

function initParticles() {
  for(let i=0; i<100; i++){
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  particlesArray.forEach(p => { 
    p.update(); 
    p.draw(); 
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
