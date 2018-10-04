import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
}

interface DrawObject {
    x: number;
    y: number;
    width: number;
}

export class LineFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 600,
            width: innerWidth,
            height: innerHeight
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height);
    }
    protected ctxGlobals() {
        this.ctx.lineWidth = 4;
    }
    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({x, y, width}) {
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width, y);
    }
}

function* sequence(width, height): IterableIterator<DrawObject> {
    const init = {width, x: 0, y: 0};
    yield init;

    let prev = [init];

    while(true) {
        const next = [];

        for (let i=0; i<prev.length; i++) {
            const {x, y, width: width} = prev[i];
            
            if (y > height) {
                return;
            }
            const w = width / 3;

            const o1 = {
                x,
                y: y + 32,
                width: w * 1.45
            }
            yield o1;

            const o2 = {
                x: x + w * 1.55,
                y: y + 32,
                width: w * 1.45
            };

            yield o2;

            next.push(o1, o2);
        }

        prev = next;
    }
}
