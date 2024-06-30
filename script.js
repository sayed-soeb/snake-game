const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 100, y: 100 };
let foodImage = new Image();
foodImage.src = 'https://img.icons8.com/emoji/48/000000/red-apple.png'; // Apple emoji

document.addEventListener('keydown', changeDirection);

// Add touch event listeners
canvas.addEventListener('touchstart', handleTouchStart);

function gameLoop() {
    if (isGameOver()) {
        alert('Game Over');
        document.location.reload();
        return;
    }

    setTimeout(() => {
        clearCanvas();
        drawGrid();
        drawFood();
        moveSnake();
        drawSnake();
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
    ctx.strokeStyle = '#444';
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawSnake() {
    ctx.fillStyle = 'lime';
    ctx.strokeStyle = 'darkgreen';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const key = event.keyCode;
    const goingUp = direction.y === -gridSize;
    const goingDown = direction.y === gridSize;
    const goingRight = direction.x === gridSize;
    const goingLeft = direction.x === -gridSize;

    if (key === 37 && !goingRight) { direction = { x: -gridSize, y: 0 }; }
    if (key === 38 && !goingDown) { direction = { x: 0, y: -gridSize }; }
    if (key === 39 && !goingLeft) { direction = { x: gridSize, y: 0 }; }
    if (key === 40 && !goingUp) { direction = { x: 0, y: gridSize }; }
}

function handleTouchStart(event) {
    const touch = event.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    canvas.addEventListener('touchend', event => {
        const touch = event.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && !direction.x === -gridSize) {
                direction = { x: gridSize, y: 0 };
            } else if (deltaX < 0 && !direction.x === gridSize) {
                direction = { x: -gridSize, y: 0 };
            }
        } else {
            if (deltaY > 0 && !direction.y === -gridSize) {
                direction = { x: 0, y: gridSize };
            } else if (deltaY < 0 && !direction.y === gridSize) {
                direction = { x: 0, y: -gridSize };
            }
        }
    });
}

function drawFood() {
    ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * canvas.width / gridSize) * gridSize,
        y: Math.floor(Math.random() * canvas.height / gridSize) * gridSize
    };

    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            placeFood();
        }
    });
}

function isGameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

placeFood();
gameLoop();