const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let score = 0;
const tileSize = 40;
const player = { x: 1, y: 1 };

// 1 = Wall, 0 = Empty
const world = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,1,1,0,1,1,0,0,0,1],
    [1,0,0,0,1,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
];

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw Map
    for(let y=0; y<10; y++) {
        for(let x=0; x<10; x++) {
            if(world[y][x] === 1) {
                ctx.fillStyle = "#444";
                ctx.fillRect(x*tileSize, y*tileSize, tileSize-1, tileSize-1);
            }
        }
    }
    // Draw Player
    ctx.fillStyle = "#00D2FF";
    ctx.fillRect(player.x*tileSize + 5, player.y*tileSize + 5, tileSize - 10, tileSize - 10);
}

// THE SCORING SYSTEM
function addPoints(type) {
    if (type === "perfect") score += 1;
    if (type === "combo") score += 3;   // Perfect + Bazooka
    if (type === "bazooka") score += 4;
    scoreEl.innerText = score;
}

// KEYBOARD CONTROLS
window.addEventListener("keydown", e => {
    let nx = player.x; let ny = player.y;
    if (e.key === "w") ny--;
    if (e.key === "s") ny++;
    if (e.key === "a") nx--;
    if (e.key === "d") nx++;
    
    if (world[ny][nx] === 0) { player.x = nx; player.y = ny; }
    
    if (e.code === "Space") addPoints("perfect");
    if (e.key === "b") addPoints("bazooka");
    if (e.key === "c") addPoints("combo");
    draw();
});

// TABLET TOUCH CONTROLS (Swiping & Tapping)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    // Tapping acts as a "Perfect Hit"
    addPoints("perfect");
});

canvas.addEventListener("touchend", e => {
    let dx = e.changedTouches[0].clientX - touchStartX;
    let dy = e.changedTouches[0].clientY - touchStartY;

    let nx = player.x; let ny = player.y;
    // Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) nx++; else if (dx < -30) nx--;
    } else {
        if (dy > 30) ny++; else if (dy < -30) ny--;
    }

    if (world[ny][nx] === 0) { player.x = nx; player.y = ny; }
    draw();
});

draw();
