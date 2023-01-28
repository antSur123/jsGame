// Plannering https://docs.google.com/document/d/15m22qdkUSni4wRro1tTjpulOBNoxaa2P1uKWIwTHs8A/edit
// Dokumentation https://docs.google.com/document/d/15m22qdkUSni4wRro1tTjpulOBNoxaa2P1uKWIwTHs8A/edit

// Sets up canvases.
var gameMapCanvas = document.getElementById("game-map");
gameMapCanvas.width = window.innerWidth * 0.9;
gameMapCanvas.height = window.innerHeight - 1;
var gmc = gameMapCanvas.getContext('2d');

var sidePanelCanvas = document.getElementById("side-panel");
sidePanelCanvas.width = window.innerWidth * 0.1;
sidePanelCanvas.height = window.innerHeight;
var spc = sidePanelCanvas.getContext('2d');

// Sets up global variables.
const RADIUS = 35;
const WIDTH = 65;
const HEIGHT = WIDTH;
const BORDERWIDTH = +getComputedStyle(document.getElementById('side-panel')).borderRightWidth.slice(0, -2);
const SIDEPANELOFFSET = BORDERWIDTH + sidePanelCanvas.width;
let wantedCharacter;


// Checks if player clicks.
window.addEventListener('mousedown', (event) => {
    if (characterArray.length > 1) {
        clickDetection(event.x, event.y);
    }
});


// Runs foundWantedCharacter() if clicked on the wanted char, and runs foundWrongCharacter() if not.
function clickDetection(mouseX, mouseY) {
    let charX = wantedCharacter.x + SIDEPANELOFFSET;
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
    characterArray.length = 1;
    setTimeout(startNextRound, 3000);
}


// This punishes the player for clicking on the wrong char.
function foundWrongCharacter() {
    console.log("Miss!");
}


// Constructor for Circles.
class Circle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.type = this.constructor.name;
        this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];

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
            this.draw();
        };

        // Draws character on the game canvas, or on the side panel canvas.  
        this.draw = (canvas = gmc) => {
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
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.type = this.constructor.name;
        this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];


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
            this.draw();
        };


        // Draws character on the game canvas, or on the side panel canvas.  
        this.draw = (canvas = gmc) =>{
            if (canvas != gmc) {
                canvas.fillStyle = this.color;
                canvas.fillRect((sidePanelCanvas.width - WIDTH) / 2, (sidePanelCanvas.height - HEIGHT) / 2, WIDTH, HEIGHT);
                canvas.strokeRect((sidePanelCanvas.width - WIDTH) / 2, (sidePanelCanvas.height - HEIGHT) / 2, WIDTH, HEIGHT);
            }
            else {
                canvas.fillStyle = this.color;
                canvas.fillRect(this.x, this.y, WIDTH, HEIGHT);
                canvas.strokeRect(this.x, this.y, WIDTH, HEIGHT);
            }
        };
    }
}


// Starts new game.
function startNextRound() {
    spc.clearRect(0, 0, gameMapCanvas.width, gameMapCanvas.height);

    characterArray = [];
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
    wantedCharacter = characterArray[0];
    wantedCharacter.color = chosenColor;
    wantedCharacter.draw(spc);
}


// Generates ammount of characters.
function generateCharacters(ammount) {
    for (let i = 0; i < ammount; i++) {
        let x = Math.floor(Math.random() * (gameMapCanvas.width - 2 * WIDTH) + (WIDTH / 1.5));
        let y = Math.floor(Math.random() * (gameMapCanvas.height - 2 * WIDTH) + (WIDTH / 1.5));
        let randomShape = Math.floor(Math.random() * 2);
        if (randomShape == 0) {
            characterArray.push(new Circle(x, y));
        }
        else if (randomShape == 1) {
            characterArray.push(new Square(x, y));
        }
    }

}


// Animates next frame for all characters.
function animationFrame() {
    requestAnimationFrame(animationFrame);
    gmc.clearRect(0, 0, gameMapCanvas.width, gameMapCanvas.height);

    for (let i = 0; i < characterArray.length; i++) {
        characterArray[i].update();
    }
}

startNextRound();
animationFrame();