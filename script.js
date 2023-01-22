/**
 * I'm hooked
 * https://www.youtube.com/watch?v=yq2au9EfeRQ&list=PLpPnRKq7eNW3We9VdCfx9fprhqXHwTPXL&index=3
 */


// canvas size setup
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// draw on canvas
const c = canvas.getContext('2d'); // draw a 2d shape

/**
// draw rect
c.fillStyle = "rgba(225, 0, 0, 0.1)";
c.fillRect(100, 100, 100, 100);

// draw line
c.beginPath(); // start drawing something from here
c.moveTo(50, 300); // tp to
c.lineTo(300,100); // draw to
c.lineTo(300,400);
c.strokeStyle = "blue";
c.stroke(); // brush down

// draw arc/circle
for (let i = 0; i < 5; i++){
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let r = Math.round(Math.random() * 225);
    let g = Math.round(Math.random() * 225);
    let b = Math.round(Math.random() * 225);
    let color = `rgb(${r},${g},${b})`;
    c.beginPath();
    c.arc(x, y, 30, 0, Math.PI * 2, false);
    c.strokeStyle = color;
    c.stroke();
}

*/

const DISTANCE_PX = 100;
const MAX_RADIUS = 40;

let clickArray = [];
let avoidArray = [];


let mouse = {
    x: undefined,
    y: undefined
}


let colorArray = [
    "#003840",
    "#005A5B",
    "#007369",
    "#008C72",
    "#02A676"
]

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    avoidArray[0] = mouse;
});

window.addEventListener('mousedown', (event) => {
    new Click(event.x, event.y)
    console.log("clickArray", clickArray);
    console.log("avoidArray", avoidArray);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

function Click(x, y) {
    this.x = x;
    this.y = y;
    clickArray.push(this);
    avoidArray.push(this);

}


function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

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


        // interactivity

        if (mouse.x-this.x < DISTANCE_PX && mouse.x - this.x > -DISTANCE_PX && mouse.y-this.y < DISTANCE_PX && mouse.y - this.y > -DISTANCE_PX) {
            if (this.radius < MAX_RADIUS){
                this.radius += 1.5;
            }

        } else if (this.radius > this.minRadius){
                this.radius -= 1;
        }

        this.draw();
    }
}

let circleArray = [];

function init(){
    circleArray = [];
    avoidArray = [[mouse.x,mouse.y]];

    for (let i = 0; i < 400; i++) {
        let radius = Math.random() * 5 + 2;
        let x = canvas.width/2;
        let y = canvas.height/2;
        let dx =(Math.random()-0.5) * 2;
        let dy =(Math.random()-0.5) * 2;
        circleArray.push(new Circle(x,y, dx, dy, radius));
        
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