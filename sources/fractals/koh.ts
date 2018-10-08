import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
}

interface DrawObject {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    clear?: boolean;
    iteration?: number;
}

export class KohFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 2000,
            width: innerWidth,
            height: innerHeight
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height);
    }
    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({x1, y1, x2, y2, clear, iteration}) {
        if (clear) {
            this.ctx.stroke();
            this.ctx.clearRect(0, 0, this.config.width, this.config.height);
            this.ctx.fillText(iteration + " iteration", 20, 30);
            this.ctx.beginPath();
        } else {
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
        }
    }
}

const SQRT_3 = Math.sqrt(3);

function* sequence(width, height): IterableIterator<DrawObject> {
    const sX = width / 4;
    const sY = height * 3 / 4;
    const len = width / 3;

    let lines = [
        {
            x1: sX,
            y1: sY,
            x2: sX + len,
            y2: sY
        },
        {
            x1: sX,
            y1: sY,
            x2: sX + len / 2,
            y2: sY - SQRT_3 / 2 * len
        },
        {
            x1: sX + len / 2,
            y1: sY - SQRT_3 / 2 * len,
            x2: sX + len,
            y2: sY
        }
    ];
    
    let iteration = 0;

    while(true) {
        const newLines = [];
        
        yield {
            clear: true,
            iteration
        }
        iteration++;

        for (let i=0; i<lines.length; i++) {
            yield lines[i];
            const {x1, y1, x2, y2} = lines[i];
            
            const xLen = (x2 - x1) / 3;
            const yLen = (y2 - y1) / 3;

            newLines.push(
                {
                    x1,
                    y1,
                    x2: x1 + xLen,
                    y2: y1 + yLen
                },
                // {
                //     x1: x1 + xLen,
                //     y1: y1 + yLen,
                //     x2: x1 + 1.5 * xLen,
                //     y2: y1 + yLen + xLen * SQRT_3 / 2 * yk
                // },
                // {
                //     x1: x1 + 1.5 * xLen,
                //     y1: y1 + yLen + xLen * SQRT_3 / 2 * yk,
                //     x2: x1 + 2 * xLen,
                //     y2: y1 + 2 * yLen
                // },
                {
                    x1: x1 + 2 * xLen,
                    y1: y1 + 2 * yLen,
                    x2,
                    y2
                }
            )
        }
        if (iteration === 9) {
            return;
        }

        lines = newLines;
    }

}
