const dContainer = document.querySelector("#container");
const dGame = document.querySelector("#game");
const dBuffer = document.querySelector("#buffer");
const ctx = dBuffer.getContext("2d", {
    willReadFrequently: true,
});
const ctxFinal = dGame.getContext("2d");

ctx.mageSmoothingEnabled = true;
ctx.webkitImageSmoothingEnabled = true;
ctxFinal.imageSmoothingEnabled = true;
ctxFinal.webkitImageSmoothingEnabled = true;

const FPS = 60;
const DPI = window.devicePixelRatio;
const CANVAS_SCALE = DPI;

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
    angle = 0;
    isAttacking = false;
    attackCooldown = 0;
    attackCooldownDefault = 8;
    attackRadius = 10;

    update = () => {
        // TODO: Rotate towards mouse.
        // TODO: Attack on mouse click.
    };

    draw = () => {
        drawCircle(this.x, this.y, 20, "#20e715");
    };
}

class Enemy extends GameObject {
    update = () => {
        // TODO: Move towards player
    };

    draw = () => {
        drawCircle(this.x, this.y, 10);
    };
}

class FriendlyEnemy extends GameObject {
    update = () => {};

    draw = () => {
        drawCircle(this.x, this.y, 10);
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
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = lastFillStyle;
}

// Resize
function resizeGame() {
    dGame.setAttribute("width", dContainer.clientWidth * CANVAS_SCALE);
    dGame.setAttribute("height", dContainer.clientHeight * CANVAS_SCALE);

    dBuffer.setAttribute("width", dContainer.clientWidth * CANVAS_SCALE);
    dBuffer.setAttribute("height", dContainer.clientHeight * CANVAS_SCALE);
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
    ctx.clearRect(0, 0, dBuffer.width, dBuffer.height);

    for (const gameObject of gameObjects) {
        gameObject.draw();
    }

    // Swap buffers
    ctxFinal.putImageData(
        ctx.getImageData(0, 0, dBuffer.width, dBuffer.height),
        0,
        0
    );

    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);
