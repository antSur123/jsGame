// Plannering https://docs.google.com/document/d/15m22qdkUSni4wRro1tTjpulOBNoxaa2P1uKWIwTHs8A/edit
// Dokumentation https://docs.google.com/document/d/1Wij25DYcz6bglkBAEUzfXRDs5U3jSjaIIoH0hM12gHU/edit

// Sets up canvases and relvant tools.
var gameMapCanvas = document.getElementById("game-map");
gameMapCanvas.width = window.innerWidth * 0.9;
gameMapCanvas.height = window.innerHeight;
var gmc = gameMapCanvas.getContext('2d');

var sidePanelCanvas = document.getElementById("side-panel");
sidePanelCanvas.width = window.innerWidth * 0.1;
sidePanelCanvas.height = window.innerHeight;
var spc = sidePanelCanvas.getContext('2d');

// Sets up global variables.
const RADIUS = 35;
const WIDTH = 65;
const HEIGHT = WIDTH;
const BORDER_WIDTH = +getComputedStyle(document.getElementById('side-panel')).borderRightWidth.slice(0, -2);
const SIDEPANEL_OFFSET = BORDER_WIDTH + sidePanelCanvas.width;
const START_TIME = 5;
let timeLeft;
let wantedCharacter;
let timer;
let isWantedCharacterFound = false;


// Constructor for Circles.
class Circle {
    constructor(x, y, canvas, color) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.type = this.constructor.name;
        this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];
        this.canvas = gmc || canvas;


        // Updates character's animation.
        this.update = () => {
            if (this.x + RADIUS > gameMapCanvas.width || this.x - RADIUS < 0) {
                this.dx *= -1;
            }
            if (this.y + RADIUS > gameMapCanvas.height || this.y - RADIUS < 0) {
                this.dy *= -1;
            }

            this.x += this.dx;
            this.y += this.dy;
            this.draw(this.canvas);
        };

        // Draws character on the game canvas, or on the side panel canvas.  
        this.draw = (canvas) => {
            if (canvas != gmc) {
                canvas.beginPath();
                canvas.arc(sidePanelCanvas.width / 2, sidePanelCanvas.height / 2, RADIUS, 0, Math.PI * 2, false);
                canvas.fillStyle = this.color;
                canvas.fill();
                canvas.stroke();
            }
            else {
                canvas.beginPath();
                canvas.arc(this.x, this.y, RADIUS, 0, Math.PI * 2, false);
                canvas.fillStyle = this.color;
                canvas.fill();
                canvas.stroke();

            }
        };
    }
}


// Constructor for Squares.
class Square {
    constructor(x, y, canvas, color) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.type = this.constructor.name;
        this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];
        this.canvas = gmc || canvas;


        // Updates character's animation.
        this.update = () => {
            if (this.x + WIDTH > gameMapCanvas.width || this.x < 0) {
                this.dx *= -1;
            }
            if (this.y + WIDTH > gameMapCanvas.height || this.y < 0) {
                this.dy *= -1;
            }

            this.x += this.dx;
            this.y += this.dy;
            this.draw(this.canvas);
        };


        // Draws character on the game canvas, or on the side panel canvas.  
        this.draw = (canvas) => {
            if (canvas != gmc) {
                canvas.fillStyle = this.color;
                let x = (sidePanelCanvas.width - WIDTH) / 2;
                let y = (sidePanelCanvas.height - HEIGHT) / 2;
                canvas.fillRect(x, y, WIDTH, HEIGHT);
                canvas.strokeRect(x, y, WIDTH, HEIGHT);
            }
            else {
                canvas.fillStyle = this.color;
                canvas.fillRect(this.x, this.y, WIDTH, HEIGHT);
                canvas.strokeRect(this.x, this.y, WIDTH, HEIGHT);
            }
        };
    }
}


// Constructor for text.
class Text {
    constructor(y, text, fontSize) {
        this.text = text;
        this.fontSize = fontSize;
        this.y = y;

        // Updates text's info.
        this.update = () => {
            this.width = spc.measureText(this.text).width;
            this.x = (sidePanelCanvas.width - this.width ) / 2;
            this.draw();
        };

        // Draws text.
        this.draw = () => {
            spc.fillStyle = "red";
            spc.font = `${this.fontSize}px Arial`;
            spc.fillText(this.text, this.x, this.y);
        };
    }
}


// Checks if player clicks.
window.addEventListener('mousedown', (event) => {
    if (gameMapItems.length > 1) {
        clickDetection(event.x, event.y);
    }
});


// Runs foundWantedCharacter() if clicked on the wanted char, and runs foundWrongCharacter() if not.
function clickDetection(mouseX, mouseY) {
    let charX = wantedCharacter.x + SIDEPANEL_OFFSET;
    let charY = wantedCharacter.y;

    console.log("char", charX, charY);
    console.log("mouse", mouseX, mouseY);

    if (wantedCharacter.type == "Square") {
        let isWithinX = mouseX > charX - 1 && mouseX < charX + WIDTH + 1;
        let isWithinY = mouseY > charY - 1 && mouseY < charY + HEIGHT + 1;
        isWithinX && isWithinY ? foundWantedCharacter() : foundWrongCharacter();
    }

    else if (wantedCharacter.type == "Circle") {
        let distance = Math.sqrt(Math.abs(Math.pow(mouseX - charX, 2) - Math.pow(mouseY - charY, 2)));
        distance <= RADIUS ? foundWantedCharacter() : foundWrongCharacter();
    }
}


// This wins the round and starts the next one after 3000 ticks.
function foundWantedCharacter() {
    console.log("Found!");
    isWantedCharacterFound = true;
    gameMapItems.length = 1;
    for (let i = 0 ; i < 2; i++) {
        if (timeLeft <= 49) {
            timeLeft += 1;
        }
    }
    clearTimeout(countdown)
    timer.text = `${timeLeft}s`;
    setTimeout(startNextRound, 3000);
}


// This punishes the player for clicking on the wrong char.
function foundWrongCharacter() {
    console.log("Miss!");
}


// This counts down the timer. If it reaches 0 it ends the game.
function countdown() {
    console.log("timeLeft: " + timeLeft);
    if (!isWantedCharacterFound) {
	    timeLeft -= 1;
	    timer.text = `${timeLeft}s`;
	
	    if (timeLeft == 0) {
	        console.log("Time's up!");
	        gameOver();
	    }
	    else if (timeLeft > 0) {
	        setTimeout(countdown, 1000)
	    }
    }
}


// Ends game.
function gameOver() {
    console.log("Game Over!");
    gameMapItems.length = 1;
}


// Starts new round.
function startNextRound() {
    isWantedCharacterFound = false;

    gameMapItems = [];
    sidePanelItems = []; 
    colorArray = [
        "#3caea3",
        "#f4c095",
        "#ed553b",
        "#f6d55c"
    ];

    // Chosess the unique color the wanted char will have, and excluted it for all other chars.
    let randomColorArrayIndex = Math.floor(Math.random() * colorArray.length);
    let chosenColor = colorArray.splice(randomColorArrayIndex, 1)[0];

    generateCharacters(100);

    // Recolors the wanted character.
    wantedCharacter = gameMapItems[0];
    wantedCharacter.color = chosenColor;
    
    timer.draw();
    setTimeout(countdown, 1000)
}


// Generates ammount of characters.
function generateCharacters(ammount) {
    for (let i = 0; i < ammount; i++) {
        let x = Math.floor(Math.random() * (gameMapCanvas.width - 2 * WIDTH) + (WIDTH / 1.5));
        let y = Math.floor(Math.random() * (gameMapCanvas.height - 2 * HEIGHT) + (HEIGHT / 1.5));
        let randomShape = Math.floor(Math.random() * 2);

        if (randomShape == 0) {
            gameMapItems.push(new Circle(x, y, gmc));
        }
        else if (randomShape == 1) {
            gameMapItems.push(new Square(x, y, gmc));
        }
    }
}


// Animates next frame for all characters.
function animationFrame() {
    requestAnimationFrame(animationFrame);
    gmc.clearRect(0, 0, gameMapCanvas.width, gameMapCanvas.height);
    spc.clearRect(0, 0, gameMapCanvas.width, gameMapCanvas.height);
    
    timer.update();
    wantedCharacter.draw(spc);

    for (let i = 0; i < gameMapItems.length; i++) {
        gameMapItems[i].update();
    }
}

function gameInit() {
    timeLeft = START_TIME;  // START_TIME
    timer = new Text(100, `${timeLeft}s`, 60);

    startNextRound();
    animationFrame();
}

gameInit();