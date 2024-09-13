
// Default, Player
let board;
let boardWidth = 1000;
let boardHeight = 300;
let context;
let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY = 215;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};
let gameOver = false;
let score = 0;
let time = 0;
let life = 3;

// Object
let boxImg;
let boxWidth = 40;
let boxHeight = 80;
let boxX = 1000;
let boxY = 215;

// Setting Object
let boxesArray = [];
let boxSpeed = -8;

// Gravity, Velocity
let VelocityY = 0;
let Gravity = 0.25;
let cloudImg;
let cloudWidth = 160;
let cloudHeight = 80;
let cloudX = 1300;
let cloudY = 60;
let cloudArray = [];
let cloudSpeed = -8

let Retry = document.getElementById("RetryButton");

console.log(player);
window.onload = function () {
    // Display
    board = document.getElementById("Board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Player
    playerImg = new Image();
    playerImg.src = "https://imgs.search.brave.com/64SiLwVocD46p33brIbQvA9yGh4kYXaaKClnQCDAdxk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmdm/cmUuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy9tYXJpby03NS0y/NTh4MzAwLnBuZw";
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    // Request animation frame
    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    Retry.addEventListener("click", gameReset);

    boxImg = new Image();
    boxImg.src = "https://imgs.search.brave.com/rCwzgfqJCiOhPZXu09NZoQvYZ4Eym6ptNDsmHZdGdRs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy85/LzkzL01hcmlvX3Bp/cGUucG5nPzIwMTUw/ODE4MDEzODE5";//TODO
    

    cloudImg = new Image();
    cloudImg.src = "cloud.png";
    setInterval(createCloud,1000);
    createBoxWithRandomInterval();
};

// Function to create a box at a random time interval
function createBoxWithRandomInterval() {

    if (gameOver) {
        return;
    }

    createBox(); // Create a box

    // Generate a random time between 1 and 3 seconds (1000 to 3000 milliseconds)
    let randomTime = rnd(1000, 2500);

    // Use setTimeout instead of setInterval to create boxes at random times
    setTimeout(createBoxWithRandomInterval, randomTime);
}

function rnd(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

// Update Function
function update() {
    requestAnimationFrame(update); // Always update animation

    if (gameOver) {
        return;
    }

    

    context.clearRect(0, 0, board.width, board.height);
    VelocityY += Gravity;

    for (let index = 0; index < cloudArray.length; index++) {
        let clouds = cloudArray[index];
        clouds.x += cloudSpeed;
        context.drawImage(clouds.img, clouds.x, clouds.y, clouds.width, clouds.height);
    }

    player.y = Math.min(player.y + VelocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let index = 0; index < boxesArray.length; index++) {
        let box = boxesArray[index];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);


        if (onCollision(player, box)) {
            gameOver = true;
            life -= 1;

            context.font = "normal bold 40px Arial";
            context.textAlign = "center";
            context.fillText("GameOver!", boardWidth / 2, boardHeight / 2);
            context.fillText("Your Score : "+score,boardWidth/2 ,(boardHeight/2)+50);


            setTimeout(() => {
                Retry.style.display = "block";
            }, 500);
        }
    }

    
    score++;
    time += 0.01;
    context.font = "normal bold 25px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, (boardWidth/2) - 300 ,30);
    context.fillText("Time : " + time.toFixed(0), (boardWidth/2) - 100 ,30);
    context.fillText("Life Remain : " + life, (boardWidth/2) + 50 ,30);
    if (time >= 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("You Won! With Score :" + score, boardWidth / 2, boardHeight / 2);
        



        setTimeout(() => {
            Retry.style.display = "block";
        }, 500);
    }
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        VelocityY = -10;
    }
}

function createBox(e) {
    if (gameOver) {
        return;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    };

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) && (obj1.x + obj1.width) > obj2.x // Crash in X move
        && obj1.y < (obj2.y + obj2.height) && (obj1.y + obj1.height) > obj2.y; // Crash in Y move
}

function gameReset() {
    if (!gameOver) {
        return;
    }

    if (life > 0) {
        gameOver = false;
        Retry.style.display = "none"; // Hide the Retry button
        

        score = 0;
        time = 0;
        boxesArray = [];
        VelocityY = 0; // Reset gravity effect
        player.y = playerY; // Reset player position

        createBoxWithRandomInterval(); // Restart creating boxes
    }
}

function createCloud(){
    if (gameOver) {
        return;
    }

    let cloud = {
        img: cloudImg,
        x: cloudX,
        y: cloudY,
        width: cloudWidth,
        height: cloudHeight
    };

    cloudArray.push(cloud);

    if (cloudArray.length > 5) {
        cloudArray.shift();
    }
}