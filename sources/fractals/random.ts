import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
    radius?: number;
}

interface DrawObject {
    x: number;
    y: number;
}

export class RandomPointFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 400,
            width: innerWidth,
            height: innerHeight,
            radius: 5
        }
    }
    protected ctxGlobals() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.radius);
    }

    protected drawObject({x, y}) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }
}


function* sequence(width, height, radius): IterableIterator<DrawObject> {
    let x = width / 2;
    let y = height / 2;

    yield {
        x,
        y
    }

    while(true) {
        const percent = Math.random();

        const newX = x + Math.cos(2 * Math.PI * percent) * radius;
        const newY = y + Math.sin(2 * Math.PI * percent) * radius;

        if (newX > width || newY > height || newX < 0 || newY < 0) {
            continue;
        }
        
        x = newX;
        y = newY;

        yield {
            x,
            y
        }
    }
}