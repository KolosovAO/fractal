export function xFractal(ctx: CanvasRenderingContext2D, {width, height}) {
    let sizeX = width;
    let sizeY = height;

    let points = [
        {
            x: sizeX / 2,
            y: sizeY / 2
        }
    ];

    const drawX = point => {
        ctx.moveTo(point.x - sizeX / 2, point.y);
        ctx.lineTo(point.x + sizeX / 2, point.y);

        ctx.moveTo(point.x, point.y - sizeY / 2);
        ctx.lineTo(point.x, point.y + sizeY / 2);
    }
    const getNewPoints = points => points.reduce((arr, point) => {
        arr.push(
            {
                x: point.x + sizeX / 4,
                y: point.y + sizeY / 4
            },
            {
                x: point.x - sizeX / 4,
                y: point.y - sizeY / 4,
            },
            {
                x: point.x + sizeX / 4,
                y: point.y - sizeY / 4
            },
            // {
            //     x: point.x - sizeX / 4,
            //     y: point.y + sizeY / 4
            // }
        );
        return arr;
    }, []);

    ctx.lineWidth = 0.2;
    let alpha = 1;
    const draw = () => {
        ctx.beginPath();
        ctx.globalAlpha = alpha;
        points.forEach(drawX);
        ctx.stroke();

        points = getNewPoints(points);
        sizeX /= 2;
        sizeY /= 2;
        alpha *= 0.95;

        if (sizeX > 1) {
            requestAnimationFrame(draw);
        }
    }
    draw();
}