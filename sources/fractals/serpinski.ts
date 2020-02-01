import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";

interface Config {
    pointSize: number;
    edges: number;
}

export class SerpinskiFractal extends BaseFractal<Point, Config> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 400,
            edges: 3,
            pointSize: 0.2
        }
    }

    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config.edges);
    }

    protected ctxGlobals() {
        this.ctx.fillStyle = "#000";
    }
    protected drawObject({ x, y }: Point) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.config.pointSize, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }
}

function random(value: number): number {
    return Math.floor(Math.random() * value);
}

function* sequence(width: number, height: number, count: number): IterableIterator<Point> {
    const points: Point[] = [];
    for (let i = 0; i < count; i++) {
        const point = {
            x: random(width),
            y: random(height)
        }
        yield point;
        points.push(point);
    }

    let active = points[random(count)];

    while (true) {
        const target = points[random(count)];

        const x = (target.x + active.x) / 2;
        const y = (target.y + active.y) / 2;

        active = { x, y };
        yield active;
    }
}