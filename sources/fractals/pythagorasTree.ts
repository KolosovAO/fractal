import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
}

interface Point {
    x: number;
    y: number;
}

interface DrawObject {
    points: Point[];
    fill: string;
}

export class PythagorasTree extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getMode(): "night" | "default" {
        return "night";
    }
    protected getConfig(config) {
        return {
            ...config,
            drawCount: 10
        }
    }
    protected getSequence() {
        return sequence(this.config.width, this.config.height);
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
const depthToColor = (depth, total) => `hsl(${~~(depth / total * 360)},40%,60%)`;

function* sequence(width: number, height: number): IterableIterator<DrawObject> {
    const totalDepth = 13;
    let depth = 1;

    let points = [
        [width * .45, height * .85, width * .55, height * .85]
    ];

    while (depth < totalDepth) {
        const newPoints = [];
        for (const [x1, y1, x2, y2] of points) {
            let dx = x2 - x1;
            let dy = y1 - y2;
        
            let x3 = x2 - dy;
            let y3 = y2 - dx;
            let x4 = x1 - dy;
            let y4 = y1 - dx;
            let x5 = x4 + 0.5 * (dx - dy);
            let y5 = y4 - 0.5 * (dx + dy);

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