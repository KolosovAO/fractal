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
}

export class KochFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 1,
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

    protected drawObject({x1, y1, x2, y2, clear}) {
        if (clear) {
            this.ctx.stroke();
            this.ctx.clearRect(0, 0, this.config.width, this.config.height);
            this.ctx.beginPath();
        } else {
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
        }
    }
}


function* sequence(width, height): IterableIterator<DrawObject> {
    const alpha = -Math.PI / 3;

    let lines = [
        {
            x1: width / 6,
            y1: height * 3 / 4,
            x2: width * 5 / 6,
            y2: height * 3 / 4
        },
    ];

    while(true) {
        yield {
            clear: true
        }

        const newLines = [];
        for (let i=0; i<lines.length; i++) {
            yield lines[i];
        
            const {x1, y1, x2, y2} = lines[i];

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
