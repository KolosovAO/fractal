import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";

interface DrawObject {
    p1: Point;
    p2: Point;
}

export class SpiralFractal extends BaseFractal<DrawObject, {}> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 50
        }
    }
    protected getMode(): "default" | "night" {
        return "night";
    }
    protected async getSequence() {
        return sequence(this.config.width, this.config.height);
    }

    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({ p1, p2 }: DrawObject) {
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
    }
}

function* sequence(width: number, height: number): IterableIterator<DrawObject> {
    const x = width / 2;
    const y = height / 2;
    let p1 = {
        x,
        y
    };

    for (let i = 0; i < 4000; i++) {
        const angle = 0.1 * i;

        const p2 = {
            x: x + (1 + angle) * Math.cos(angle),
            y: y + (1 + angle) * Math.sin(angle)
        }

        yield {
            p1,
            p2
        }
        p1 = p2;
    }
}
