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
    size: number;
}

export class TFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected setConfig(config) {
        this.config = {
            ...config,
            drawCount: 400,
            width: innerWidth,
            height: innerHeight
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height);
    }

    protected ctxGlobals() {
        this.ctx.strokeStyle = "rgba(0,0,0,0.2)";
        this.ctx.lineWidth = 8;
    }
    protected onDrawCircleStart() {
        this.ctx.beginPath();
    }
    protected onDrawCircleEnd() {
        this.ctx.stroke();
    }

    protected drawObject({x, y, size}) {
        this.ctx.rect(x, y, size, size);
    }
}

function* sequence(width, height): IterableIterator<DrawObject> {
    let size = 4;
    while(true) {
        for (let x=0; x<width; x+=size) {
            for (let y=0; y<height; y+=size) {
                yield {
                    x, 
                    y,
                    size
                };
            }
        }
        size += 4;
    }
}