import { Fractal } from "../types";

export interface TFractalConfig {
    drawCount?: number;
    width?: number;
    height?: number;
    pointSize?: number;
    edges?: number;
}

interface DrawObject {
    x: number;
    y: number;
}

export class RandomLineFractal implements Fractal {
    public config: TFractalConfig;
    public ctx: CanvasRenderingContext2D;

    private running: boolean;
    private sequence: IterableIterator<DrawObject>;

    constructor(ctx, config = {}) {
        this.config = {
            ...config, 
            drawCount: 400,
            edges: 3,
            pointSize: 0.2,
            width: innerWidth,
            height: innerHeight
        }
        this.ctx = ctx;
        this.ctxGlobals();

        this.draw = this.draw.bind(this);

        this.sequence = sequence(this.config.width, this.config.height, this.config.edges);
    }
    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        requestAnimationFrame(this.draw);
    }
    stop() {
        this.running = false;
    }
    refresh() {
        this.destroy();
        this.sequence = sequence(this.config.width, this.config.height, this.config.edges);
        this.start();
    }
    destroy() {
        this.stop();
        this.sequence = null;
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    }
    private ctxGlobals() {
        this.ctx.fillStyle = "#000";
    }
    private draw() {
        let count = this.config.drawCount;
        while (count) {
            const {x, y} = this.sequence.next().value;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.config.pointSize, 0, 2 * Math.PI, true);
            this.ctx.fill();
            count--;
        }
        if (this.running) {
            requestAnimationFrame(this.draw);
        }
    }
}

function random(value) {
    return Math.floor(Math.random() * value);
}

function* sequence(width, height, count): IterableIterator<DrawObject> {
    const points = [];
    for (let i=0; i<count; i++) {
        const point = {
            x: random(width),
            y: random(height)
        }
        yield point;
        points.push(point);
    }

    let active = points[random(count)];

    while(true) {
        const target = points[random(count)];

        const x = (target.x + active.x) / 2;
        const y = (target.y + active.y) / 2;
        
        active = {x, y};
        yield active;
    }
}