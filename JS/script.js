//listeners
document.addEventListener("keydown", keyPush)


// canvas 

const canvas = document.querySelector("canvas");
const title = document.querySelector("h1");
const ctx = canvas.getContext("2d");


// main settings 
const tailSize = 50;  
const fps = 10;
let score = 0;
let snakeLenght = 5;

// player 

let snakeSpeed = tailSize;
let snakePosX = 0;
let snakePosY = canvas.height / 2;

let velocityX = 1;
let velocityY = 0;

let tail = []

// game
let gameIsRunning = true;

const titeCountX = canvas.width / tailSize;
const titeCountY = canvas.width / tailSize;

// food
let foodPosX = 0;
let foodPosY = 0;

// loop

function gameLoop() {
    if (gameIsRunning) {
        drawStuff();
        moveStuff();
        setTimeout(gameLoop, 1000/ fps) 
    }
}
resetfood();
gameLoop();


// move Everything 

function moveStuff() {
    snakePosX += snakeSpeed * velocityX;
    snakePosY += snakeSpeed * velocityY;

    // wall collision
    if (snakePosX > (canvas.width - tailSize)) {
        snakePosX = 0
    }

    if (snakePosX < 0) {
        snakePosX = canvas.width
    }

    if (snakePosY > (canvas.height - tailSize)) {
        snakePosY = 0
    }

    if (snakePosY <  0 ) {
        snakePosY = canvas.height
    }

    // GAME OVER (crash into myself)
   tail.forEach( snakePart => {
    if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
        gameOver();
    }
   })
    
    // tail
    tail.push({ x: snakePosX, y: snakePosY })

    // forget earliest parts of snake 
    tail = tail.slice(-1 * snakeLenght)

    // food collision 
    if (snakePosX === foodPosX && snakePosY === foodPosY) {
        title.textContent = ++score;
        snakeLenght++;
        resetfood()
    }
}



// draw Everything

function drawStuff() {
    // background
    rectangle("#ffbf00", 0, 0, canvas.width, canvas.height);

    // grid
    drawGrid()
    
   
    //food
    rectangle("#00bfff", foodPosX, foodPosY, tailSize, tailSize)

    //tail
    tail.forEach((snakePart) =>
        rectangle("#555", snakePart.x, snakePart.y, tailSize, tailSize)    
    )

    // snake
    rectangle("black", snakePosX, snakePosY, tailSize, tailSize);

}


// draw rectangle

function rectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawGrid() {
    for (let i = 0; i < titeCountX; i++) {
        for (let j = 0; j < titeCountY; j++) {
            rectangle("#fff", tailSize * i, tailSize * j, tailSize - 1, tailSize - 1);
        }
    }
}


// draw random food 

function resetfood() {

    if (snakeLenght === titeCountX * titeCountY) {
        gameOver()
    }

    foodPosX = Math.floor(Math.random() * titeCountX) * tailSize;
    foodPosY = Math.floor(Math.random() * titeCountY) * tailSize;

    // dont spawn food in me
    if ( foodPosX === snakePosX && foodPosY === snakePosY) {
        resetfood()
    }

    //dont spawn food on any snake part 
    if (tail.some(snakePart => snakePart.x === foodPosX && snakePart.y === foodPosY)) {
        resetfood()
    }
}


function gameOver() {
    title.innerHTML = `☠️ <strong> ${score} </strong> ☠️`;
	gameIsRunning = false;
}

//keyBoard

function keyPush(event) {
    switch (event.key) {
        case "ArrowUp" :
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;

        case "ArrowDown" :
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;

        case "ArrowLeft" :
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;

        case "ArrowRight" :
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
        default:
            //restart 
            if(!gameIsRunning) location.reload()
            break;
        
    }
}

