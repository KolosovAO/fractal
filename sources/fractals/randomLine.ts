import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
    pointSize?: number;
    edges?: number;
}

interface DrawObject {
    x: number;
    y: number;
}

export class RandomLineFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 400,
            edges: 3,
            pointSize: 0.2,
            width: innerWidth,
            height: innerHeight
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.edges);
    }

    protected ctxGlobals() {
        this.ctx.fillStyle = "#000";
    }
    protected drawObject({x, y}) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.config.pointSize, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }
}

function random(value) {
    return Math.floor(Math.random() * value);
}

function* sequence(width, height, count): IterableIterator<DrawObject> {
    const points = [];
    for (let i=0; i<count; i++) {
        const point = {
            x: random(width),
            y: random(height)
        }
        yield point;
        points.push(point);
    }

    let active = points[random(count)];

    while(true) {
        const target = points[random(count)];

        const x = (target.x + active.x) / 2;
        const y = (target.y + active.y) / 2;
        
        active = {x, y};
        yield active;
    }
}