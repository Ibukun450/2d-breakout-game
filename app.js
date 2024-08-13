document.addEventListener('DOMContentLoaded', () => {
    alert("Left Click on PC or tap the screen on mobile to Start game");
});

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const win_prompt = document.getElementById('win-prompt');
const lose_prompt = document.getElementById('lose-prompt');

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2; // Reduced speed on the x-axis
let dy = -2; // Reduced speed on the y-axis
let paddleHeight = 10;
let paddleWidth = 85;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 5;
let brickColumnCount = 3;
let brickWidth = 85;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 10;
let score = 0;
let lives = 3;
let gameStarted = false; // Flag to check if the game has started

let startX; // Variables for swipe handling
let startY;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", startGame, false); // Add event listener for spacebar
canvas.addEventListener("click", startGame, false); // Add event listener for mobile tap

canvas.addEventListener("touchstart", touchStartHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);
canvas.addEventListener("touchend", touchEndHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Touch event handlers for swipe
function touchStartHandler(e) {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
}

function touchMoveHandler(e) {
    e.preventDefault(); // Prevent scrolling during swipe
    const touch = e.touches[0];
    const relativeX = touch.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function touchEndHandler(e) {
    // Optionally handle actions on touch end if needed
}

function rtyFunc() {
    document.location.reload();
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        win_prompt.style.display = 'flex';
                        gameStarted = false; // Stop the game loop
                        return; // Exit the function to prevent further execution
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                lose_prompt.style.display = 'flex';
                return;
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 1.5; // Reset speed after losing a life
                dy = -1.5; // Reset speed after losing a life
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    if (gameStarted) {
        requestAnimationFrame(draw);
    }
}

// Function to start the game
function startGame(e) {
    if (e.keyCode === 32 || e.type === "click") {
        if (!gameStarted) {
            gameStarted = true;
            draw();
        }
    }
}
