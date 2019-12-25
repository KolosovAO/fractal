import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    depth: number;
}

interface Point {
    x: number;
    y: number;
}

interface DrawObject {
    points: Point[];
    fill: string;
}

export class PythagorasTree extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getMode(): "night" | "default" {
        return "night";
    }
    protected getOwnConfig() {
        return {
            drawCount: 10,
            depth: 13
        }
    }
    protected async getSequence() {
        const size = this.config.width * .1;
        return sequence(this.config.width, this.config.height, size, this.config.depth);
    }

    protected drawObject({points: [init, ...other], fill}) {
        this.ctx.beginPath();
        this.ctx.moveTo(init.x, init.y);
        for (const {x, y} of other) {
            this.ctx.lineTo(x, y);

            this.ctx.fillStyle = fill;
            this.ctx.fill();
        }
        this.ctx.closePath();
    }
}

const Point = (x: number, y: number) => ({x, y});
const depthToColor = (depth: number, total: number) => `hsl(${~~(depth / total * 360)},40%,60%)`;

function* sequence(width: number, height: number, size: number, totalDepth: number): IterableIterator<DrawObject> {
    let depth = 1;

    const initX1 = (width - size) / 2;
    const initX2 = initX1 + size;
    let points = [
        [initX1, height * .85, initX2, height * .85]
    ];

    while (depth < totalDepth) {
        const newPoints = [];
        for (const [x1, y1, x2, y2] of points) {
            const dx = x2 - x1;
            const dy = y1 - y2;
        
            const x3 = x2 - dy;
            const y3 = y2 - dx;
            const x4 = x1 - dy;
            const y4 = y1 - dx;
            const x5 = x4 + 0.5 * (dx - dy);
            const y5 = y4 - 0.5 * (dx + dy);

            yield {
                points: [Point(x1, y1), Point(x2, y2), Point(x3, y3), Point(x4, y4)],
                fill: depthToColor(depth * 2, totalDepth * 2)
            }

            yield {
                points: [Point(x3, y3), Point(x4, y4), Point(x5, y5)],
                fill: depthToColor(depth * 2 + 1, totalDepth * 2)
            }

            newPoints.push([x4, y4, x5, y5], [x5, y5, x3, y3]);
        }
        depth++;

        points = newPoints;
    }
}