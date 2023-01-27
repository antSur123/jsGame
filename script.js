/**
 * https://www.youtube.com/watch?v=yq2au9EfeRQ&list=PLpPnRKq7eNW3We9VdCfx9fprhqXHwTPXL&index=3
 */

// canvas size setup
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// draw on canvas
const c = canvas.getContext('2d');
const RADIUS = 35;
const WIDTH = 65;
const HEIGHT = WIDTH;
let chosenShape;

window.addEventListener('mousedown', (event) => {
    if (shapeArray.length > 1) {
        clickDetection(event.x, event.y);
    }
});

function clickDetection(mouseX, mouseY) {
    let x = Number(mouseX);
    let y = Number(mouseY);
    console.log(chosenShape.type);
    console.log("char", chosenShape.x, chosenShape.y);
    console.log("mouse", x, y);
    console.log(chosenShape.color);
    
    if (chosenShape.type == "Square") {
        let isWithinX =  x > chosenShape.x && x < chosenShape.x + WIDTH;
        let isWithinY = y > chosenShape.y && y < chosenShape.y + HEIGHT;
        isWithinX && isWithinY ? foundWantedCharacter() : foundWrongCharacter();
    }

    else if (chosenShape.type == "Circle") {
        let distance = Math.sqrt(Math.abs(Math.pow(x-chosenShape.x,2)-Math.pow(y-chosenShape.y,2)));
        distance <= 38 ? foundWantedCharacter() : foundWrongCharacter();
    }
}

function foundWantedCharacter(){
    console.log("Found!");
    shapeArray.length = 1;
    setTimeout(init, 3000);
}

function foundWrongCharacter(){
    console.log("Miss!");

}

class Shape {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.type = this.constructor.name;
        this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];
        this.update = () => {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx *= -1;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy *= -1;
            }

            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        };
    }
}

class Circle extends Shape {
    constructor(x, y, color) {
        super(x, y, color);
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, RADIUS, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
    }
}

class Square extends Shape {
    constructor(x, y, color) {
        super(x, y, color);
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, WIDTH, HEIGHT);
        c.strokeRect(this.x, this.y, WIDTH, HEIGHT);
    }
}

function init() {
    shapeArray = [];
    colorArray = [
    "#3caea3",
    "#f4c095",
    "#ed553b",
    "#f6d55c"
    ];

    console.log(colorArray);

    let randomColorArrayIndex = Math.floor(Math.random() * colorArray.length);
    let chosenColor = colorArray.splice(randomColorArrayIndex, 1)[0];
    
    for (let i = 0; i < 10; i++) {
        let x = Math.floor(Math.random() * (canvas.width - 2 * WIDTH + 1) + WIDTH);
        let y = Math.floor(Math.random() * (canvas.height - 2 * WIDTH + 1) + WIDTH);
        let randomShape = Math.floor(Math.random() * 2);
        if (randomShape == 0) {
            shapeArray.push(new Circle(x, y));
        }
        else if (randomShape == 1) {
            shapeArray.push(new Square(x, y));
        } 
        chosenShape = shapeArray[0];
    }

    console.log(chosenShape.color);
    chosenShape.color = chosenColor;
    console.log(chosenShape.color);
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < shapeArray.length; i++) {
        shapeArray[i].update();
    }    
}

init();
animate();