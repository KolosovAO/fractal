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
    a1?: Point;
    a2?: Point;
}

export class LeviFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getConfig(config) {
        return {
            ...config,
            drawCount: 50,
            iterations: 20
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.iterations);
    }

    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({a1, a2, clear, iteration}) {
        if (clear) {
            this.ctx.stroke();
            this.clear();
            this.ctx.fillText(iteration + " iteration", 20, 30);
            this.ctx.beginPath();
        } else {
            this.ctx.moveTo(a1.x, a1.y);
            this.ctx.lineTo(a2.x, a2.y);
        }
    }
}

function* sequence(width, height, iterations): IterableIterator<DrawObject> {
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
            const [a1, a2] = pairs[i];

            yield {
                a1,
                a2
            }

            const {x: x1, y: y1} = a1;
            const {x: x2, y: y2} = a2;

            const xDif = x2 - x1;
            const yDif = y2 - y1;

            const a3 = {
                x: cosA * (xDif * cosA - yDif * sinA) + x1,
                y: cosA * (xDif * sinA + yDif * cosA) + y1
            };

            newPairs.push([a1,a3], [a3,a2]);
        }
        
        pairs = newPairs;
    }
}
