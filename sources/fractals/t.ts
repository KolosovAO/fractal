export function tFractal(ctx, {width, height}) {
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