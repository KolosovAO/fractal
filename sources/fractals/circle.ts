import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";

interface Config {
    points: number;
    iterations: number;
}

type DrawObject = {
    p1?: Point;
    p2?: Point;
    clear?: true;
};

export class CircleFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 1,
            points: 360,
            iterations: 20
        }
    }

    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config.points, this.config.iterations);
    }

    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({ p1, p2, clear }: DrawObject) {
        if (clear) {
            this.ctx.stroke();
            this.clear();
            this.ctx.beginPath();
        }
        if (p1 && p2) {
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
        }
    }
}

function* sequence(width: number, height: number, points: number, iterations: number): IterableIterator<DrawObject> {
    const center = {
        x: width / 2,
        y: height / 2
    }
    const radius = height / 2 - 40;

    const getDot = (index: number): Point => {
        const percent = (index % points) / points;
        return {
            x: center.x + Math.cos(2 * Math.PI * percent) * radius,
            y: center.y + Math.sin(2 * Math.PI * percent) * radius
        }
    }

    let coef = 2;

    while (iterations--) {
        yield {
            clear: true
        }
        for (let i = 1; i < points; i++) {
            yield {
                p1: getDot(i),
                p2: getDot(i * coef)
            }
        }
        coef++;
    }
}
