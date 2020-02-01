import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";

interface Config {
    roughness: number;
}

interface DrawObject {
    x: number;
    y: number;
    color: string;
}

export class PlaneFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 250,
            roughness: 1.2
        }
    }
    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config.roughness);
    }

    protected drawObject({ x, y, color }: DrawObject) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
        this.ctx.fill();
    }
}

function* sequence(width: number, height: number, roughness: number): IterableIterator<DrawObject> {
    const h = 2 ** ~~Math.log2(height) + 1;
    const m: number[][] = Array.from({ length: h }, () => Array.from({ length: h }));

    const deltaX = (width - h) / 2;
    const deltaY = (height - h) / 2;

    const rand = (v: number) => -.5 * v + Math.random() * v;
    const av = (...args: number[]) => args.reduce((s, v) => s + v) / args.length;
    const color = (v: number) => `hsl(${Math.floor(v + 180)},50%,50%)`;

    m[0][0] = rand(360);
    m[0][h - 1] = rand(360);
    m[h - 1][0] = rand(360);
    m[h - 1][h - 1] = rand(360);

    yield {
        x: deltaX,
        y: deltaY,
        color: color(m[0][0])
    }
    yield {
        x: deltaX,
        y: h - 1 + deltaY,
        color: color(m[0][h - 1])
    }
    yield {
        x: h - 1 + deltaX,
        y: deltaY,
        color: color(m[h - 1][0])
    }
    yield {
        x: h - 1 + deltaX,
        y: h - 1 + deltaY,
        color: color(m[h - 1][h - 1])
    }

    let dist = h >> 1;

    function* square(m: number[][]) {
        for (let i = dist; i < h; i += 2 * dist) {
            for (let j = dist; j < h; j += 2 * dist) {
                m[i][j] = av(m[i - dist][j - dist], m[i - dist][j + dist], m[i + dist][j - dist], m[i + dist][j + dist]) + rand(360) / h * dist * roughness;
                yield {
                    x: i + deltaX,
                    y: j + deltaY,
                    color: color(m[i][j])
                }
            }
        }
    }
    function* rhomb(m: number[][]) {
        for (let i = 0; i < h; i += dist) {
            for (let j = 0; j < h; j += dist) {
                if (m[i][j]) {
                    continue;
                }
                const points: number[] = [];
                if (m[i - dist]) {
                    points.push(m[i - dist][j]);
                }
                if (m[i + dist]) {
                    points.push(m[i + dist][j]);
                }
                if (m[i][j - dist]) {
                    points.push(m[i][j - dist]);
                }
                if (m[i][j + dist]) {
                    points.push(m[i][j + dist]);
                }
                m[i][j] = av(...points) + rand(360) / h * dist * roughness;
                yield {
                    x: i + deltaX,
                    y: j + deltaY,
                    color: color(m[i][j])
                }
            }
        }
    }

    while (dist >= 1) {
        const squareIterator = square(m);
        for (const o of squareIterator) {
            yield o;
        }
        const rhombIterator = rhomb(m);
        for (const o of rhombIterator) {
            yield o;
        }
        dist >>= 1;
    }
}
