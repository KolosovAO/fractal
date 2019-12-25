import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    iterations: number;
}

interface Point {
    x: number;
    y: number;
}

interface DrawObject {
    iteration?: number;
    clear?: boolean;
    p1?: Point;
    p2?: Point;
}

export class LeviFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 50,
            iterations: 20
        }
    }
    protected ctxGlobals() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    }

    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config.iterations);
    }

    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({p1, p2, clear, iteration}) {
        if (clear) {
            this.ctx.stroke();
            this.clear();
            this.ctx.fillText(iteration + " iteration", 20, 30);
            this.ctx.beginPath();
        } else {
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
        }
    }
}

function* sequence(width: number, height: number, iterations: number): IterableIterator<DrawObject> {
    const radianAngle = 45 * Math.PI / 180;

    const cosA = Math.cos(radianAngle);
    const sinA = Math.sin(radianAngle);

    let pairs = [
        [
            {
                x: width / 3,
                y: height / 4
            },
            {
                x: width * 2 / 3,
                y: height / 4
            }
        ]
    ]

    let iteration = -1;

    while (++iteration < iterations) {
        const newPairs = [];
        
        yield {
            clear: true,
            iteration: iteration + 1
        }

        for (let i=0; i<pairs.length; i++) {
            const [p1, p2] = pairs[i];

            yield {
                p1,
                p2
            }

            const {x: x1, y: y1} = p1;
            const {x: x2, y: y2} = p2;

            const xDif = x2 - x1;
            const yDif = y2 - y1;

            const a3 = {
                x: cosA * (xDif * cosA - yDif * sinA) + x1,
                y: cosA * (xDif * sinA + yDif * cosA) + y1
            };

            newPairs.push([p1,a3], [a3,p2]);
        }
        
        pairs = newPairs;
    }
}
