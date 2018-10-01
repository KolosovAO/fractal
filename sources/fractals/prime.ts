const DRAW_TICK = 20;
const VALUE = 5;

export function prime(ctx, {width, height}) {
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