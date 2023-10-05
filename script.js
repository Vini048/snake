// Obtém elementos HTML importantes
const gameBoard = document.getElementById('game-board'); // Onde o jogo será exibido
const scoreElement = document.getElementById('score'); // Elemento para exibir a pontuação

// Tamanho da grade do jogo
const gridSize = 20;

// Velocidade inicial da cobra (em milissegundos)
let snakeSpeed = 150;

// Array que representa a posição da cobra
let snake = [{ x: 5, y: 5 }]; // Inicialmente, a cobra tem uma posição

// Variáveis para rastrear a comida
let food = generateFoodPosition(); // Inicializa a comida em uma posição aleatória
let dx = 1; // Direção horizontal (1: direita, -1: esquerda)
let dy = 0; // Direção vertical (1: para baixo, -1: para cima)

// Variável para rastrear se a direção está sendo alterada
let changingDirection = false;

// Inicializa a pontuação e o contador de comidas coletadas
let score = 0;
let foodEaten = 0;

// Função para gerar uma posição aleatória para a comida
function generateFoodPosition() {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    return { x, y };
}

// Função para desenhar a cobra e a comida no tabuleiro
function draw() {
    gameBoard.innerHTML = '';

    // Desenha a comida
    const foodElement = document.createElement('div');
    foodElement.style.gridColumn = food.x + 1;
    foodElement.style.gridRow = food.y + 1;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);

    // Desenha a cobra
    snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridColumn = segment.x + 1;
        snakeElement.style.gridRow = segment.y + 1;
        snakeElement.classList.add('snake');

        // Define a cor da cabeça da cobra como azul
        if (index === 0) {
            snakeElement.classList.add('head');
        }

        gameBoard.appendChild(snakeElement);
    });
}

// Função para atualizar a posição da cobra
function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score++; // Aumenta a pontuação
        foodEaten++; // Incrementa o contador de comidas coletadas
        food = generateFoodPosition();

        // Verifica se a cada 5 comidas coletadas para aumentar a velocidade
        if (foodEaten % 5 === 0) {
            snakeSpeed /= 2; // Diminui pela metade a velocidade
            clearInterval(gameInterval); 
            gameInterval = setInterval(gameLoop, snakeSpeed);
        }
    } else {
        snake.pop();
    }

    // Verifica se a cobra atingiu o limite do tabuleiro
    if (head.y < 0) {
        head.y = gridSize - 1; // Aparece na parte inferior
    } else if (head.y >= gridSize) {
        head.y = 0; // Aparece na parte superior
    }
}

// Função para verificar colisões e condições de fim de jogo
function checkCollision() {
    const head = snake[0];

    // Colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }

    // Colisão com as laterais direita ou esquerda
    if (head.x < 0 || head.x >= gridSize) {
        return true;
    }

    return false;
}

// Função para controlar a direção da cobra
function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
}

// Função para exibir a pontuação na tela
function displayScore() {
    scoreElement.textContent = score;
}

// Função para controlar o loop do jogo
function gameLoop() {
    if (checkCollision()) {
        clearInterval(gameInterval);
        if (score === gridSize * gridSize - 1) {
            alert('Parabéns! Você venceu com pontuação máxima!');
        } else {
            alert('Game Over! Sua Pontuação: ' + score);
        }
    } else {
        changingDirection = false;
        update();
        draw();
        displayScore(); // Atualiza a pontuação na tela
    }
}

// Inicialização do jogo
document.addEventListener('keydown', changeDirection);

let gameInterval = setInterval(gameLoop, snakeSpeed); // Inicializa o loop do jogo com a velocidade inicial
