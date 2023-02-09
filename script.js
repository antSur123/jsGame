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
const START_CHARACTERS = 50;
const CHARACTER_MULTIPLIER = 10;
const START_TIME_SEC = 5;
const TIME_BONUS_SEC = 3;
const TIME_PENALTY_SEC = 1;
const NEXT_ROUND_START_DELAY_MS = 2000;
const BORDER_WIDTH = 2;
const SIDEPANEL_OFFSET = BORDER_WIDTH + sidePanelCanvas.width;
const MOVE_PATTERNS = [
	"Horizontal",
	"None",
	"Random",
	"Vertical"
];

let wantedCharacter;
let timeLeft;
let timer;
let timeBonusText;
let score;
let gameMapItems = [];
let timePenaltyTextArray = [];
let isWantedCharacterFound = false;


// Constructor for Circles.
class Circle {
	constructor(x, y, dx, dy, canvas, color) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.type = this.constructor.name;
		this.color = color;
		this.canvas = canvas;


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
	constructor(x, y, dx, dy, canvas, color) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.type = this.constructor.name;
		this.color = color;
		this.canvas = canvas;


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
	constructor(x, y, text, fontSize, color, canvas) {
		this.x = x;
		this.y = y;
		this.text = text;
		this.fontSize = fontSize;
		this.color = color;
		this.canvas = canvas;
		this.shouldDisplay = false;
		this.width = this.canvas.measureText(this.text).width;


		// Updates text's info.
		this.update = () => {
			this.width = this.canvas.measureText(this.text).width;

			if (this.canvas == spc) {
				this.x = (sidePanelCanvas.width - this.width) / 2;
			}

			if (this.shouldDisplay) {
				this.draw();
			}
		};


		// Draws text.
		this.draw = () => {
			this.canvas.fillStyle = this.color;
			this.canvas.font = `${this.fontSize}px Arial`;
			this.canvas.fillText(this.text, this.x, this.y);
		};
	}
}


// Checks if player clicks.
window.addEventListener('mousedown', (event) => {
	if (gameMapItems.length > 1) {
		clickDetection(event.x, event.y);
	}
});


// Runs foundWantedCharacter() if clicked on the wanted char, and runs foundWrongCharacter() if not. Only works within the gmc.
function clickDetection(mouseX, mouseY) {
	if (mouseX > SIDEPANEL_OFFSET) {
		let charX = wantedCharacter.x + SIDEPANEL_OFFSET;
		let charY = wantedCharacter.y;

		if (wantedCharacter.type == "Square") {
			let isWithinX = mouseX > charX - 1 && mouseX < charX + WIDTH + 1;
			let isWithinY = mouseY > charY - 1 && mouseY < charY + HEIGHT + 1;
			isWithinX && isWithinY ? foundWantedCharacter() : foundWrongCharacter(mouseX, mouseY);
		}
		else if (wantedCharacter.type == "Circle") {
			let clickDistance = Math.sqrt(Math.abs(Math.pow(mouseX - charX, 2) - Math.pow(mouseY - charY, 2)));
			clickDistance <= RADIUS ? foundWantedCharacter() : foundWrongCharacter(mouseX, mouseY);
		}
	}
}


// Wins the round and starts the next one after 3000 ticks.
function foundWantedCharacter() {
	console.log(`Found! + ${TIME_BONUS_SEC} sec`);

	isWantedCharacterFound = true;
	gameMapItems.length = 1;
	wantedCharacter.dx = 0;
	wantedCharacter.dy = 0;

	++score;
	scoreText.text = `${score}`;

	// Adds 2 second, only up to fifty.
	for (let i = 0; i < TIME_BONUS_SEC; i++) {
		if (timeLeft <= 49) {
			++timeLeft;
		}
	}
	timer.text = `${timeLeft}s`;

	// Displays recieved time bonus.
	if (wantedCharacter.type == "Square") {
		timeBonusText.x = wantedCharacter.x - timeBonusText.width / 3;
		timeBonusText.y = wantedCharacter.y - 20;
	}
	else if (wantedCharacter.type == "Circle") {
		timeBonusText.x = wantedCharacter.x - timeBonusText.width / 2;
		timeBonusText.y = wantedCharacter.y - RADIUS - 20;
	}
	timeBonusText.shouldDisplay = true;

	// Adjusts coordinates if text is overflowing.
	if (timeBonusText.y < 30) {
		timeBonusText.y = 40;
	}
	if (timeBonusText.x + SIDEPANEL_OFFSET < timeBonusText.width / 2) {
		timeBonusText.x = timeBonusText.width / 2 - SIDEPANEL_OFFSET + 10;
	}
	if (timeBonusText.x > gameMapCanvas.width - timeBonusText.width) {
		timeBonusText.x = gameMapCanvas.width - timeBonusText.width - 10;
	}

	// Cleans up.
	setTimeout(() => {
		timeBonusText.shouldDisplay = false;
	}, NEXT_ROUND_START_DELAY_MS);

	clearTimeout(countdown);
	setTimeout(startNextRound, NEXT_ROUND_START_DELAY_MS);
}


// Punishes the player for clicking on the wrong char.
function foundWrongCharacter(mouseX, mouseY) {
	console.log("Miss! -1 sec");

	let timePenaltyText = new Text(0, 0, `-${TIME_PENALTY_SEC} seconds`, 30, "red", gmc);
	timePenaltyTextArray.push(timePenaltyText);

	// Updates time.
	if (timeLeft > 0) {
		timeLeft -= TIME_PENALTY_SEC;
	}

	timer.text = `${timeLeft}s`;


	// Displays recieved time bonus.
	timePenaltyText.x = mouseX - SIDEPANEL_OFFSET - timeBonusText.width / 2;
	timePenaltyText.y = mouseY - 10;
	timePenaltyText.shouldDisplay = true;

	// Adjusts coordinates if text is overflowing.
	if (timePenaltyText.y < 30) {
		timePenaltyText.y = 40;
	}
	if (timePenaltyText.x + SIDEPANEL_OFFSET < timePenaltyText.width / 2) {
		timePenaltyText.x = timePenaltyText.width / 2 - SIDEPANEL_OFFSET + 10;
	}
	if (timePenaltyText.x > gameMapCanvas.width - timePenaltyText.width) {
		timePenaltyText.x = gameMapCanvas.width - timePenaltyText.width - 10;
	}

	// Cleans up.
	setTimeout(() => {
		timePenaltyText = null;
		timePenaltyTextArray.shift();
	}, 1000);
}


// Counts down the timer. If it reaches 0 it ends the game.
function countdown() {
	if (!isWantedCharacterFound) {
		if (timeLeft > 0) {
			--timeLeft;
		}
		timer.text = `${timeLeft}s`;

		if (timeLeft <= 0) {
			console.log("Time's up!");
			endGame();
		}
		else if (timeLeft > 0) {
			setTimeout(countdown, 1000);
		}
	}
}

// Ends game and opens menu after 3 sec.
function endGame() {
	console.log("Game Over!");
	gameMapItems.length = 1;
	setTimeout(() => {
		openMenu("gameOver");
	}, 3000);
}


// Perepares and starts next round. 
function startNextRound() {
	let charactersToGenerate = START_CHARACTERS + CHARACTER_MULTIPLIER * score;
	isWantedCharacterFound = false;
	timePenaltyTextArray = [];
	gameMapItems = [];
	let colorArray = [
		"#3caea3",
		"#f4c095",
		"#ed553b",
		"#f6d55c"
	];

	// Limits ammount of characters.
	if (charactersToGenerate > 400) {
		charactersToGenerate = 400;
	}

	// Chosess the unique color the wanted char will have, and excluted it for all other chars.
	let randomColorArrayIndex = Math.floor(Math.random() * colorArray.length);
	let chosenColor = colorArray.splice(randomColorArrayIndex, 1)[0];
	let chosenMovePattern = MOVE_PATTERNS[Math.floor(Math.random() * MOVE_PATTERNS.length)];

	console.log(chosenMovePattern, charactersToGenerate);
	generateCharacters(charactersToGenerate, colorArray, chosenMovePattern);

	// Recolors the wanted character.
	wantedCharacter = gameMapItems[0];
	wantedCharacter.color = chosenColor;

	// Starts countdown.
	setTimeout(countdown, 1000)
}


// Generates characters based on stats.
function generateCharacters(ammount, colors, movePattern) {
	let dx = 0;
	let dy = 0;

	// Changes move pattern.
	if (movePattern == "Horizontal") {
		dx = Math.random() < 0.5 ? -0.5 : 0.5;
	}
	else if (movePattern == "Vertical") {
		dy = Math.random() < 0.5 ? -0.5 : 0.5;
	}

	// Generates ammount of characters.
	for (let i = 0; i < ammount; i++) {
		if (movePattern == "Random") {
			dx = Math.random() < 0.5 ? -0.5 : 0.5;
			dy = Math.random() < 0.5 ? -0.5 : 0.5;
		}

		// Generates stats for new character.
		let x = Math.floor(Math.random() * (gameMapCanvas.width - 2 * WIDTH) + (WIDTH / 1.5));
		let y = Math.floor(Math.random() * (gameMapCanvas.height - 2 * HEIGHT) + (HEIGHT / 1.5));
		let color = colors[Math.floor(Math.random() * colors.length)];
		let randomShape = Math.floor(Math.random() * 2);

		if (randomShape == 0) {
			gameMapItems.push(new Circle(x, y, dx, dy, gmc, color));
		}
		else if (randomShape == 1) {
			gameMapItems.push(new Square(x, y, dx, dy, gmc, color));
		}
	}
}


// Initializes new game.
function gameInit() {
	// Hides menu.
	document.getElementById('menu').style.display = "none";
	document.getElementById('side-panel').style.borderRight = `${BORDER_WIDTH}px solid black`;

	// Sets initial 
	score = 0;
	timeLeft = START_TIME_SEC;
	timer = new Text(0, 100, `${timeLeft}s`, 60, "red", spc);
	timeBonusText = new Text(0, 0, `+${TIME_BONUS_SEC} seconds`, 30, "green", gmc);
	scoreText = new Text(0, sidePanelCanvas.height - 50, `${score}`, 50, "white", spc);
	timer.shouldDisplay = true;
	scoreText.shouldDisplay = true;

	// Updates the width of the texts.
	timeBonusText.draw();

	startNextRound();
	animationFrame();
}


// Animates next frame for all characters.
function animationFrame() {
	requestAnimationFrame(animationFrame);
	gmc.clearRect(0, 0, gameMapCanvas.width, gameMapCanvas.height);
	spc.clearRect(0, 0, gameMapCanvas.width, gameMapCanvas.height);

	// Updates side panel.
	timer.update();
	scoreText.update();
	wantedCharacter.draw(spc);

	// Updates game map.
	for (let i = 0; i < gameMapItems.length; i++) {
		gameMapItems[i].update();
	}
	for (let i = 0; i < timePenaltyTextArray.length; i++) {
		timePenaltyTextArray[i].update();
	}

	timeBonusText.update();
}


// Opens different menu windows.
function openMenu(menuType) {
	// Prepares a new menu window.
	document.getElementById('menu').style.display = "flex";
	document.getElementById('main-menu').style.display = "none";
	document.getElementById('game-over-menu').style.display = "none";
	document.getElementById('instructions-menu').style.display = "none";
	document.getElementById('title').style.marginBottom = "0px";

	// Displays the right menu window.
	switch (menuType) {
		case "main":
			document.getElementById('main-menu').style.display = "flex";
			document.getElementById('title').style.marginBottom = "50px";
			break;

		case "gameOver":
			document.getElementById('score-display').innerHTML = `Your score was: ${score}`
			document.getElementById('game-over-menu').style.display = "flex";
			break;

		case "instructions":
			document.getElementById('instructions-menu').style.display = "flex";
			document.getElementById('instructions-message').style.marginBottom = "0px";
			break;
	}
}


// Shows starts menu at start.
openMenu("main");