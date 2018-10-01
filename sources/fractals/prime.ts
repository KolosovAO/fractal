import { Fractal } from "../types";

export interface TFractalConfig {
    drawCount?: number;
    width?: number;
    height?: number;
    step?: number;
}

interface DrawObject {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class PrimeFractal implements Fractal {
    public config: TFractalConfig;
    public ctx: CanvasRenderingContext2D;

    private running: boolean;
    private sequence: IterableIterator<DrawObject>;

    constructor(ctx, config = {}) {
        this.config = {
            ...config, 
            drawCount: 20,
            step: 2,
            width: innerWidth,
            height: innerHeight
        }
        this.ctx = ctx;
        this.ctxGlobals();

        this.draw = this.draw.bind(this);

        this.sequence = sequence(this.config.width, this.config.height, this.config.step);
        this.start();
    }
    start() {
        this.running = true;
        requestAnimationFrame(this.draw);
    }
    stop() {
        this.running = false;
    }
    refresh() {
        this.destroy();
        this.sequence = sequence(this.config.width, this.config.height, this.config.step);
        this.start();
    }
    destroy() {
        this.stop();
        this.sequence = null;
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    }
    private ctxGlobals() {
        // add something
    }
    private draw() {
        let count = this.config.drawCount;

        this.ctx.beginPath();
        while (count) {
            const {x1, y1, x2, y2} = this.sequence.next().value;
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            count--;
        }
        this.ctx.stroke();

        if (this.running) {
            requestAnimationFrame(this.draw);
        }
    }
}

function* sequence(width, height, value): IterableIterator<DrawObject> {
    let x1 = 0;
    let y1 = 0;
    let dirX = value;
    let dirY = value;
    let stroke = true;

    while (true) {
        if (x1 >= width) {
            dirX = -value;
        }
        if (x1 <= 0) {
            dirX = value;
        }
        if (y1 >= height) {
            dirY = -value;
        }
        if (y1 <= 0) {
            dirY = value;
        }

        let x2 = x1 + dirX;
        let y2 = y1 + dirY;

        if (stroke) {
            yield {
                x1,
                y1,
                x2,
                y2
            };
        }

        stroke = !stroke;
        x1 = x2;
        y1 = y2;
    }
}
