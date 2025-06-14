const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PADDLE_MARGIN = 22;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Player paddle (left)
const player = {
    x: PADDLE_MARGIN,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#4CAF50',
    score: 0,
};

// AI paddle (right)
const ai = {
    x: CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: '#F44336',
    speed: 4,
    score: 0,
};

// Ball
const ball = {
    x: CANVAS_WIDTH / 2 - BALL_SIZE / 2,
    y: CANVAS_HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speed: 5,
    velocityX: 5,
    velocityY: 3,
    color: '#FFEB3B',
};

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '40px Arial';
    ctx.fillText(text, x, y);
}

// Draw net
function drawNet() {
    ctx.fillStyle = "#FFF";
    const netWidth = 4;
    const netHeight = 25;
    for (let i = 0; i < CANVAS_HEIGHT; i += 35) {
        ctx.fillRect(CANVAS_WIDTH/2 - netWidth/2, i, netWidth, netHeight);
    }
}

// Draw everything
function render() {
    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Net
    drawNet();

    // Player
    drawRect(player.x, player.y, player.width, player.height, player.color);

    // AI
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Ball
    drawRect(ball.x, ball.y, ball.size, ball.size, ball.color);

    // Scores
    drawText(player.score, CANVAS_WIDTH/4, 50, '#4CAF50');
    drawText(ai.score, CANVAS_WIDTH*3/4, 50, '#F44336');
}

// Collision detection helper
function collision(b, p) {
    return (
        b.x < p.x + p.width &&
        b.x + b.size > p.x &&
        b.y < p.y + p.height &&
        b.y + b.size > p.y
    );
}

// Reset ball to center
function resetBall() {
    ball.x = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
    ball.y = CANVAS_HEIGHT / 2 - BALL_SIZE / 2;
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 2);
}

// Update game objects
function update() {
    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Wall collision (top/bottom)
    if (ball.y <= 0 || ball.y + ball.size >= CANVAS_HEIGHT) {
        ball.velocityY = -ball.velocityY;
    }

    // Paddle collision
    let paddle = (ball.x < CANVAS_WIDTH / 2) ? player : ai;
    if (collision(ball, paddle)) {
        // Calculate impact location
        let collidePoint = (ball.y + ball.size / 2) - (paddle.y + paddle.height / 2);
        collidePoint = collidePoint / (paddle.height / 2); // Normalize
        // Bounce angle (max 45deg)
        let angleRad = collidePoint * (Math.PI / 4);
        let direction = (ball.x < CANVAS_WIDTH / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        // Increase speed a bit (optional)
        ball.speed += 0.1;
    }

    // Score
    if (ball.x < 0) {
        ai.score++;
        ball.speed = 5;
        resetBall();
    } else if (ball.x + ball.size > CANVAS_WIDTH) {
        player.score++;
        ball.speed = 5;
        resetBall();
    }

    // AI movement: follow ball with some lag
    let aiCenter = ai.y + ai.height / 2;
    if (aiCenter < ball.y + ball.size / 2) {
        ai.y += ai.speed;
    } else if (aiCenter > ball.y + ball.size / 2) {
        ai.y -= ai.speed;
    }
    // Clamp AI paddle
    ai.y = Math.max(0, Math.min(CANVAS_HEIGHT - ai.height, ai.y));
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let scaleY = canvas.height / rect.height;
    let mouseY = (evt.clientY - rect.top) * scaleY;
    player.y = mouseY - player.height / 2;
    // Clamp paddle
    player.y = Math.max(0, Math.min(CANVAS_HEIGHT - player.height, player.y));
});

// Main game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();