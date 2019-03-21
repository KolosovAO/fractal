import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    step: number;
}

interface DrawObject {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class PrimeFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getConfig(config) {
        return {
            ...config,
            drawCount: 20,
            step: 2
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.step);
    }
    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({x1, y1, x2, y2}) {
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
    }
}

function* sequence(width: number, height: number, value: number): IterableIterator<DrawObject> {
    let x1 = 0;
    let y1 = 0;
    let dirX = value;
    let dirY = value;
    let stroke = true;

    while (true) {
        if (x1 >= width) {
            dirX = -value;
        }
        if (x1 <= 0) {
            dirX = value;
        }
        if (y1 >= height) {
            dirY = -value;
        }
        if (y1 <= 0) {
            dirY = value;
        }

        const x2 = x1 + dirX;
        const y2 = y1 + dirY;

        if (stroke) {
            yield {
                x1,
                y1,
                x2,
                y2
            };
        }

        stroke = !stroke;
        x1 = x2;
        y1 = y2;
    }
}
