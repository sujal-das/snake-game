const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.height / gridSize;
let snake;
let snakeDirection;
let fruit;
let isGameOver;
let score;

function initializeGame() {
    snake = [{ x: 10 * gridSize, y: 10 * gridSize }];
    snakeDirection = 'RIGHT';
    fruit = generateFruit();
    isGameOver = false;
    score = 0;
    document.getElementById('message')?.remove(); // Remove existing message if any
    gameLoop();
}

function gameLoop() {
    if (isGameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        return;
    }
    update();
    draw();
    setTimeout(gameLoop, 80); // Adjust the speed of the game here
}

function update() {
    const head = { ...snake[0] };

    switch (snakeDirection) {
        case 'UP':
            head.y -= gridSize;
            break;
        case 'DOWN':
            head.y += gridSize;
            break;
        case 'LEFT':
            head.x -= gridSize;
            break;
        case 'RIGHT':
            head.x += gridSize;
            break;
    }

    if (head.x === fruit.x && head.y === fruit.y) {
        score++;
        let ad = new Audio("food.wav");
        ad.play();
        fruit = generateFruit();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
        isGameOver = true;
        let ad = new Audio("game.wav");
        ad.play();
        return;
    }

    snake.unshift(head);
}

function collision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = 'rgb(10,21,24)';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw Fruit
    ctx.fillStyle = 'red';
    ctx.fillRect(fruit.x, fruit.y, gridSize, gridSize);

    // Draw Score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 50, 30);
}

function generateFruit() {
    let x, y;
    do {
        x = Math.floor(Math.random() * tileCount) * gridSize;
        y = Math.floor(Math.random() * tileCount) * gridSize;
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

function handleKeydown(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (snakeDirection !== 'DOWN') snakeDirection = 'UP';
            break;
        case 'ArrowDown':
            if (snakeDirection !== 'UP') snakeDirection = 'DOWN';
            break;
        case 'ArrowLeft':
            if (snakeDirection !== 'RIGHT') snakeDirection = 'LEFT';
            break;
        case 'ArrowRight':
            if (snakeDirection !== 'LEFT') snakeDirection = 'RIGHT';
            break;
    }
}

document.getElementById('restartButton').addEventListener('click', initializeGame);

document.addEventListener('keydown', handleKeydown);

initializeGame();
