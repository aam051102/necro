const dContainer = document.querySelector("#container");
const dGame = document.querySelector("#game");
const ctx = dGame.getContext("2d", {
    willReadFrequently: true,
});

ctx.mageSmoothingEnabled = true;
ctx.webkitImageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

const FPS = 60;
const DPI = window.devicePixelRatio;
const CANVAS_SCALE = DPI;

function calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
}

const mouse = {
    x: 0,
    y: 0,
    lmb: false,
    rmb: false,
};

const keyInput = {};

dContainer.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX * CANVAS_SCALE;
    mouse.y = e.clientY * CANVAS_SCALE;
});

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
        lmb = true;
    }

    if (e.button === 2) {
        rmb = true;
    }
});

document.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        lmb = false;
    }

    if (e.button === 2) {
        rmb = false;
    }
});

document.addEventListener("keydown", (e) => {
    keyInput[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keyInput[e.key] = false;
});

class GameObject {
    x = 0;
    y = 0;

    update = () => {};

    draw = () => {
        drawCircle(this.x, this.y, 10);
    };
}

class Player extends GameObject {
    x = 50;
    y = 60;
    movementSpeed = 3;
    angle = 0;
    isAttacking = false;
    attackCooldown = 0;
    attackCooldownDefault = 8;
    attackRadius = 10;

    update = () => {
        // TODO: Attack on mouse click.

        // Rotate to look at mouse
        this.angle = calcAngleDegrees(mouse.x - this.x, mouse.y - this.y);

        // Move
        if (keyInput["w"]) {
            this.y -= this.movementSpeed;
        } else if (keyInput["s"]) {
            this.y += this.movementSpeed;
        }

        if (keyInput["a"]) {
            this.x -= this.movementSpeed;
        } else if (keyInput["d"]) {
            this.x += this.movementSpeed;
        }
    };

    draw = () => {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(((this.angle + 45) * Math.PI) / 180);

        drawCircle(0, 0, 40, "#2015e7");
        drawSquare(0, 0, 20, "#ffffff");

        ctx.restore();
    };
}

class Enemy extends GameObject {
    update = () => {
        // TODO: Move towards player
    };

    draw = () => {
        drawCircle(this.x, this.y, 15, "#e72015");
    };
}

class FriendlyEnemy extends GameObject {
    update = () => {
        // TODO: Move around player, but attack enemies.
    };

    draw = () => {
        drawCircle(this.x, this.y, 15, "#20e715");
    };
}

const gameObjects = [];

// Setup game room
gameObjects.push(new Player());

// Render utilities
function drawCircle(x, y, radius, color) {
    let lastFillStyle = ctx.fillStyle;
    ctx.fillStyle = color ?? lastFillStyle;

    ctx.beginPath();
    ctx.arc(x, y, radius / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = lastFillStyle;
}

function drawSquare(x, y, size, color) {
    let lastFillStyle = ctx.fillStyle;
    ctx.fillStyle = color ?? lastFillStyle;

    ctx.fillRect(x - size / 2, y - size / 2, size, size);

    ctx.fillStyle = lastFillStyle;
}

// Resize
function resizeGame() {
    dGame.setAttribute("width", dContainer.clientWidth * CANVAS_SCALE);
    dGame.setAttribute("height", dContainer.clientHeight * CANVAS_SCALE);
}

window.addEventListener("resize", () => {
    resizeGame();
});

resizeGame();

// Game loop
function loop() {
    for (const gameObject of gameObjects) {
        gameObject.update();
    }
}

setInterval(loop, 1000 / FPS);

// Render
function render() {
    // Clear
    ctx.clearRect(0, 0, dGame.width, dGame.height);

    for (const gameObject of gameObjects) {
        gameObject.draw();
    }

    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);
