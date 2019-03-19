import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
    points?: number;
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

export class CircleFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 1,
            points: 360
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.points);
    }

    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({a1, a2, clear}) {
        if (clear) {
            this.ctx.stroke();
            this.clear();
            this.ctx.beginPath();
        } else {
            this.ctx.moveTo(a1.x, a1.y);
            this.ctx.lineTo(a2.x, a2.y);
        }
    }
}

function* sequence(width, height, points): IterableIterator<DrawObject> {
    const center = {
        x: width / 2,
        y: height / 2
    }
    const radius = height / 2 - 40;

    const getDot = index => {
        const percent = (index % points) / points;
        return {
            x: center.x + Math.cos(2 * Math.PI * percent) * radius,
            y: center.y + Math.sin(2 * Math.PI * percent) * radius
        }
    }

    let coef = 2;

    while(true) {
        for (let i=1; i<points; i++) {
            yield {
                a1: getDot(i),
                a2: getDot(i * coef)
            }
        }
        coef++;
        yield {
            clear: true
        }
    }
}
