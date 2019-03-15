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
    a1?: Point;
    a2?: Point;
}

export class SpiralFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 50
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

    protected drawObject({a1, a2}) {
        this.ctx.moveTo(a1.x, a1.y);
        this.ctx.lineTo(a2.x, a2.y);
    }
}

function* sequence(width, height): IterableIterator<DrawObject> {
    const x = width / 2;
    const y = height / 2;
    let a1 = {
        x,
        y
    };

    for (let i=0; i<4000; i++) {
        const angle = 0.1 * i;

        const a2 = {
            x: x + (1 + angle) * Math.cos(angle),
            y: y + (1 + angle) * Math.sin(angle)
        }

        yield {
            a1,
            a2
        }
        a1 = a2;
      }
}
