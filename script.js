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

let circleArray = [];

let colorArray = [
    "#3caea3",
    "#f4c095",
    "#ed553b",
    "#f6d55c"
]

window.addEventListener('mousedown', (event) => {
    getDistance(event.x, event.y);
    
});

function getDistance(mouseX, mouseY) {
    let x = Number(mouseX);
    let y = Number(mouseY);

    let distance = Math.sqrt(Math.abs(Math.pow(x-circleArray[0].x,2)-Math.pow(y-circleArray[0].y,2)));
    if (distance <= 38) {
        console.log("Found!");
        circleArray.length = 1;
        setTimeout(init, 3000)
    }
    else {
        console.log("Miss!");
    }
}

function Circle(x, y, color) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.radius = RADIUS;
    this.color = color || colorArray[Math.floor(Math.random() * colorArray.length)];

    this.draw = function(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    this.update = function(){
        if (this.x+this.radius > canvas.width || this.x-this.radius < 0){
            this.dx *= -1;
        }
        if (this.y+this.radius > canvas.height || this.y-this.radius < 0){
            this.dy *= -1;
        }
        this.x += this.dx;
        this.y += this.dy;
        
        this.draw();
    }
}

function init(){
    circleArray = [];
    colorArray = [
    "#3caea3",
    "#f4c095",
    "#ed553b",
    "#f6d55c"
    ]

    let randomColorArrayIndex = Math.floor(Math.random() * colorArray.length);
    let chosenColor = colorArray.splice(randomColorArrayIndex, 1);

    for (let i = 0; i < 200; i++) {
        let x = Math.floor(Math.random()*(canvas.width - 2 * RADIUS + 1) + RADIUS);
        let y = Math.floor(Math.random()*(canvas.height - 2 * RADIUS + 1) + RADIUS);
        if (i == 0) {
            circleArray.push(new Circle(x, y, chosenColor));
        }
        else {
            circleArray.push(new Circle(x, y));

        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }    
}

init();
animate();