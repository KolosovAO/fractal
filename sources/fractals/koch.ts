import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";

interface Config {
    iterations: number;
}

interface DrawObject {
    p1?: Point;
    p2?: Point;
    clear?: true;
    iteration?: number;
}

export class KochFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 1,
            iterations: 12
        }
    }
    protected ctxGlobals() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
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

    protected drawObject({p1, p2, clear, iteration}: DrawObject) {
        if (clear) {
            this.ctx.stroke();
            this.clear();
        }

        if (iteration) {
            this.ctx.fillText(iteration + " iteration", 20, 30);
            this.ctx.beginPath();
        }

        if (p1 && p2) {
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
        }
    }
}


function* sequence(width: number, height: number, iterations: number): IterableIterator<DrawObject> {
    const alpha = -Math.PI / 3;

    let lines: Array<{ x1: number; x2: number; y1: number; y2: number }> = [
        {
            x1: width / 3,
            y1: height * 0.675,
            x2: width / 2,
            y2: height * 0.675 - width * Math.sqrt(3) / 6,
        },
        {
            x1: width / 2,
            y1: height * 0.675 - width * Math.sqrt(3) / 6,
            x2: width * 2 / 3,
            y2: height * 0.675
        },
        {
            x1: width * 2 / 3,
            y1: height * 0.675,
            x2: width / 3,
            y2: height * 0.675
        }
    ];

    let iteration = -1;

    while(++iteration < iterations) {
        yield {
            clear: true,
            iteration
        };

        const newLines: Array<{ x1: number; x2: number; y1: number; y2: number }> = [];
        for (let i=0; i<lines.length; i++) {        
            const {x1, y1, x2, y2} = lines[i];

            yield {
                p1: {x: x1, y: y1},
                p2: {x: x2, y: y2},
            };

            const x3 = x1 + (x2 - x1) / 3;
            const y3 = y1 + (y2 - y1) / 3;
        
            const x5 = x1 + (x2 - x1) * 2 / 3;
            const y5 = y1 + (y2 - y1) * 2 / 3;
        
            const x4 = x3 + (x5 - x3) * Math.cos(alpha) - (y5 - y3) * Math.sin(alpha);
            const y4 = y3 + (y5 - y3) * Math.cos(alpha) + (x5 - x3) * Math.sin(alpha);

            newLines.push(
                {
                    x1,
                    y1,
                    x2: x3,
                    y2: y3
                },
                {
                    x1: x3,
                    y1: y3,
                    x2: x4,
                    y2: y4
                },
                {
                    x1: x4,
                    y1: y4,
                    x2: x5,
                    y2: y5
                },
                {
                    x1: x5,
                    y1: y5,
                    x2,
                    y2
                }
            )
        }

        lines = newLines;
    }

}
