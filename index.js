let gameSeq=[];
let userSeq=[];

let btnColors=["green","yellow","red","blue"];

let started=false;
let level=0;
let gameOver = false;

let h2=document.querySelector("h2");

// Get highest score from localStorage or set to 0 if doesn't exist
let highestScore = localStorage.getItem("highestScore") || 0;
document.getElementById("highscore").innerText = highestScore;

let allBtns=document.querySelectorAll(".btn");

// Make buttons dull initially
function disableButtons() {
    allBtns.forEach(btn => {
        btn.classList.add("disabled");
        btn.classList.remove("enabled");
    });
}

// Make buttons bright and clickable
function enableButtons() {
    allBtns.forEach(btn => {
        btn.classList.add("enabled");
        btn.classList.remove("disabled");
    });
}

// Initialize with dull buttons
disableButtons();

document.addEventListener("keydown",function(){
    if(started==false){
        console.log("Game started");
        started=true;
        gameOver = false;
        
        // Immediately change opacity with transition
        enableButtons();
        
        // Reset game state properly
        reset();
        
        // Add delay before starting level (so user can see opacity change)
        setTimeout(() => {
            levelup();
        }, 800); // 800ms delay
    }
});

function gameFlash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn){
    btn.classList.add("userFlash");
    setTimeout(function(){
        btn.classList.remove("userFlash");
    }, 250);
}

function levelup(){
    userSeq = [];
    level++;
    h2.innerText=`Level ${level}`;
     
    // Generate new color and add to sequence
    let randIdx=Math.floor(Math.random()*4);
    let randColor = btnColors[randIdx];
    gameSeq.push(randColor);
    
    // Flash the entire sequence with delays
    flashSequence();
}

function flashSequence() {
    gameSeq.forEach((color, idx) => {
        setTimeout(() => {
            let btn = document.querySelector(`.${color}`);
            gameFlash(btn);
        }, (idx + 1) * 600);
    });
}

function checkSeq(idx){
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length){
            setTimeout(levelup, 1000);
        }
    } else {
        h2.innerText = 'Game Over! Press any key to start again';
        gameOver = true;
        started = false; // Add this line - allows restart
        disableButtons();
        
        // Check if current level is higher than stored highest score
        if (level > highestScore) {
            highestScore = level;
            localStorage.setItem("highestScore", highestScore);
            document.getElementById("highscore").innerText = highestScore;
        }
    }
}

function btnPress() {
    if (gameOver || !started) {
        return;
    }
    
    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkSeq(userSeq.length - 1);
}

for (let btn of allBtns){
    btn.addEventListener("click",btnPress);
}

function reset() {
    gameSeq = [];
    userSeq = [];
    level = 0;
}