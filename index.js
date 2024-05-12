const dContainer = document.querySelector("#container");
const dGame = document.querySelector("#game");
const dBuffer = document.querySelector("#buffer");
const ctx = dBuffer.getContext("2d", {
    willReadFrequently: true,
});
const ctxFinal = dGame.getContext("2d");

ctx.mageSmoothingEnabled = true;
ctx.webkitImageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";
ctxFinal.imageSmoothingEnabled = true;
ctxFinal.webkitImageSmoothingEnabled = true;
ctxFinal.imageSmoothingQuality = "high";

const FPS = 60;
const DPI = window.devicePixelRatio;
const CANVAS_SCALE = DPI;

function calcAngleDegrees(x, y) {
    return (Math.atan2(y, x) * 180) / Math.PI;
}

const mouse = {
    x: 0,
    y: 0,
};

dContainer.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX * CANVAS_SCALE;
    mouse.y = e.clientY * CANVAS_SCALE;
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
    angle = 0;
    isAttacking = false;
    attackCooldown = 0;
    attackCooldownDefault = 8;
    attackRadius = 10;

    update = () => {
        // TODO: Attack on mouse click.
        this.angle = calcAngleDegrees(mouse.x - this.x, mouse.y - this.y);

        // TODO: MOVEMENT
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
