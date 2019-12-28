import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";

interface Config {
    radius: number;
}

interface DrawObject {
    x: number;
    y: number;
}

export class RandomPointFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 400,
            radius: 5
        }
    }
    protected ctxGlobals() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    }

    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config.radius);
    }

    protected drawObject({x, y}) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }
}


function* sequence(width: number, height: number, radius: number): IterableIterator<DrawObject> {
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