// Force light mode - prevent any automatic dark mode
document.addEventListener('DOMContentLoaded', function() {
    // Set color scheme meta tag if not already set
    if (!document.querySelector('meta[name="color-scheme"]')) {
        const meta = document.createElement('meta');
        meta.name = 'color-scheme';
        meta.content = 'light only';
        document.head.appendChild(meta);
    }
    
    // Force light mode styling
    document.documentElement.style.colorScheme = 'light only';
    document.body.style.colorScheme = 'light';
});

let gameSeq=[];
let userSeq=[];

let btnColors=["green","red","yellow","blue"]; // Fixed to match HTML layout order

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

// Start game on keydown or touch
document.addEventListener("keydown", startGame);
document.addEventListener("touchstart", function(e) {
    // Only start game if touch is not on a button
    if (!e.target.classList.contains('btn')) {
        startGame();
    }
});

function startGame() {
    if(started==false){
        console.log("Game started");
        started=true;
        gameOver = false;
        
        // Update UI text
        h2.innerText = "Watch the sequence...";
        
        // Immediately change opacity with transition
        enableButtons();
        
        // Reset game state properly
        reset();
        
        // Add delay before starting level (so user can see opacity change)
        setTimeout(() => {
            levelup();
        }, 800); // 800ms delay
    }
}

function gameFlash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    }, 300); // 0.3 second
}

function userFlash(btn){
    btn.classList.add("userFlash");
    setTimeout(function(){
        btn.classList.remove("userFlash");
    }, 180); // 0.18 second
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
    // Disable buttons during sequence display
    disableButtons();
    
    gameSeq.forEach((color, idx) => {
        setTimeout(() => {
            let btn = document.querySelector(`.${color}`);
            if (btn) {
                gameFlash(btn);
            }
            
            // Re-enable buttons after last flash
            if (idx === gameSeq.length - 1) {
                setTimeout(() => {
                    enableButtons();
                    h2.innerText = `Level ${level} - Your turn!`;
                }, 400);
            }
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
    
    // Ensure button exists and has ID
    if (!btn || !btn.getAttribute("id")) {
        console.error("Invalid button pressed");
        return;
    }
    
    // Check if button is disabled (during sequence display)
    if (btn.classList.contains("disabled")) {
        return;
    }
    
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkSeq(userSeq.length - 1);
}

for (let btn of allBtns){
    let touchHandled = false;
    
    // Enhanced touch support for mobile devices
    btn.addEventListener("touchstart", function(e) {
        touchHandled = true;
        // Prevent scrolling and other touch behaviors
        e.preventDefault();
        e.stopPropagation();
        btnPress.call(this, e);
        
        // Reset flag after a short delay
        setTimeout(() => { touchHandled = false; }, 300);
    }, { passive: false });
    
    // Primary click event for desktop (prevent if touch was handled)
    btn.addEventListener("click", function(e) {
        if (!touchHandled) {
            btnPress.call(this, e);
        }
    });
    
    // Additional touch end for better mobile response
    btn.addEventListener("touchend", function(e) {
        e.preventDefault();
    }, { passive: false });
}

function reset() {
    gameSeq = [];
    userSeq = [];
    level = 0;
}