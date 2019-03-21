import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {}

interface DrawObject {
    x: number;
    y: number;
    radius: number;
    color: number;
    ring: number;
}

export class Universe extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getConfig(config) {
        return {
            ...config,
            drawCount: 100
        }
    }
    protected getMode(): "night" | "default" {
        return "night";
    }
    protected async getSequence() {
        return sequence(this.config.width, this.config.height);
    }

    protected drawObject({x, y, radius, color}) {
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(${color}, ${color}, ${color}, 0.5)`;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }
}


function rand(min: number, max: number): number {
    return min + Math.round(Math.random() * (max - min));
}

function* sequence(width: number, height: number): IterableIterator<DrawObject> {
    const main = {
        x: width / 2,
        y: height / 2,
        radius: 40,
        ring: 100,
        color: 255
    }

    yield main;

    let objs = [main];

    while (objs.length < 10000) {
        const newObjs = [];

        for (let i=0; i<objs.length; i++) {
            const {x, y, radius, color, ring} = objs[i];
            const sattelites = rand(1, 8);

            for (let j=0; j<sattelites; j++) {
                const percent = (j + 1) / sattelites;
                const o = {
                    x: x + Math.cos(2 * Math.PI * percent) * ring,
                    y: y + Math.sin(2 * Math.PI * percent) * ring,
                    radius: rand(radius / 6, radius),
                    color: Math.round(color / (1 + Math.random() * 0.3)),
                    ring: Math.round(color / (1 + Math.random()))
                }
                if (o.x > width || o.x < 0 || o.y > height || o.y < 0) {
                    continue;
                }
                newObjs.push(o);
                yield o;
            }
        }

        objs = newObjs;
    }

}