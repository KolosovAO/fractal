import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
    iterations?: number;
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

export class LeviFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected setConfig(config) {
        this.config = {
            ...config,
            drawCount: 50,
            width: innerWidth,
            height: innerHeight,
            iterations: 20
        }
    }

    protected ctxGlobals() {
        this.ctx.font = "24px Roboto";
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.iterations);
    }

    protected onDrawCircleStart() {
        this.ctx.beginPath();
    }
    protected onDrawCircleEnd() {
        this.ctx.stroke();
    }

    protected drawObject({a1, a2, clear, iteration}) {
        if (clear) {
            this.ctx.stroke();
            this.ctx.clearRect(0, 0, this.config.width, this.config.height);
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

    let iteration = 0;

    while (++iteration < iterations) {
        const newPairs = [];
        
        yield {
            clear: true,
            iteration
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