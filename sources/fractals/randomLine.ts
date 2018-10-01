const LENGTH = 3;
const SEQUENCE_LENGTH = 1000;
const POINT_SIZE = 0.2;

function rollCube(length) {
    return Math.floor(Math.random() * length);
}

export function randomFractal(ctx, {width, height}) {
    const createPoint = () => ({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    });

    const points = (Array(LENGTH) as any).fill(0).map(_ => createPoint());

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

