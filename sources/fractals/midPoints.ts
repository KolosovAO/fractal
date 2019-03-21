import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    roughness: number;
}

interface DrawObject {
    x: number;
    y: number;
}

export class MidPointFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getConfig(config) {
        return {
            ...config,
            drawCount: 1,
            roughness: 0.8
        }
    }
    
    protected ctxGlobals() {
        this.ctx.fillStyle = "#000";
    }

    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config.roughness);
    }

    protected drawObject({x, y}) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }
}

function* sequence(width, height, roughness): IterableIterator<DrawObject> {
    const len = 2 ** ~~Math.log2(width) + 1;

    const rh = (d) => -.5 * d + Math.random() * d;
    const points = [];

    points[0] = rh(height);
    points[len - 1] = rh(height);

    yield {
        x: 0,
        y: points[0] + height / 2
    }

    yield {
        x: len,
        y: points[len] + height / 2
    }

    let dist = len >> 1;

    while(dist >= 1) {
        for (let i=dist; i<len; i += 2 * dist) {
            points[i] = (points[i-dist] + points[i+dist]) / 2 + rh(dist * roughness);
            yield {
                x: i,
                y: points[i] + height / 2
            }
        }
        
        dist >>= 1;
    }
}
