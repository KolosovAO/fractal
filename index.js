document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("#app");

    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");

    // randomFractal(ctx, w, h);
    simple(ctx, w, h);
    // tFractal(ctx, w, h); bad
});




const LENGTH = 3;
const SEQUENCE_LENGTH = 1000;
const POINT_SIZE = 0.2;
function randomFractal(ctx, width, height) {
    const createPoint = () => ({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    });

    const points = Array.from({length: LENGTH}, _ => createPoint());

    const drawPoint = ({x, y}) => {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, POINT_SIZE, 0, 2 * Math.PI, true);
        ctx.fill();
    }
    const getNextTarget = () => points[rollCube(LENGTH)];
    points.forEach(drawPoint);

    let active = points[rollCube(LENGTH)];

    let drawStack = [];
    const addToDrawStack = (count) => {
        const nextTarget = getNextTarget();

        const x = (nextTarget.x + active.x) / 2;
        const y = (nextTarget.y + active.y) / 2;

        active = {x, y};
        drawStack.push(active);
        if (count !== 0) {
            addToDrawStack(count - 1);
        }
    }

    const draw = () => {
        addToDrawStack(SEQUENCE_LENGTH);

        drawStack.forEach(drawPoint);
        drawStack = [];

        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}

function rollCube(length) {
    return Math.floor(Math.random() * length);
}



const DRAW_TICK = 20;
const VALUE = 10;

function simple(ctx, width, height) {
    const movablePoint = {
        x: 0,
        y: 0,
        dirX: VALUE,
        dirY: VALUE,
        stroke: true
    }

    const move = () => {
        const {x, y} = movablePoint;

        if (x >= width) {
            movablePoint.dirX = -VALUE;
        }
        if (x <= 0) {
            movablePoint.dirX = VALUE;
        }
        if (y >= height) {
            movablePoint.dirY = -VALUE;
        }
        if (y <= 0) {
            movablePoint.dirY = VALUE;
        }
        ctx.beginPath();
        ctx.moveTo(x, y);

        movablePoint.x += movablePoint.dirX;
        movablePoint.y += movablePoint.dirY;

        if (movablePoint.stroke) {
            ctx.lineTo(movablePoint.x, movablePoint.y);
            ctx.stroke();
        }
        movablePoint.stroke = !movablePoint.stroke;
    }    
    const draw = () => {
        let count = 0;
        while (count < DRAW_TICK) {
            move();
            count++;
        }
        requestAnimationFrame(draw);
    }
    draw();
}


function tFractal(ctx, width, height) {
    let size = 4;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.fillStyle = '#FFF';

    const draw = () => {
        for (let i=0; i<width; i+=size) {
            for (let j=0; j<height; j+=size) {
                ctx.rect(i, j, size, size);
            }
        }
        ctx.fill();
        ctx.stroke();
        size += 4;
        if (size < height) {
            requestAnimationFrame(draw);
        }
    }
    draw();
}