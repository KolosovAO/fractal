import { Fractal } from "../types";

export interface TFractalConfig {
    drawCount?: number;
    width?: number;
    height?: number;
}

interface DrawObject {
    x: number;
    y: number;
    size: number;
}

export class TFractal implements Fractal {
    public config: TFractalConfig;
    public ctx: CanvasRenderingContext2D;

    private running: boolean;
    private sequence: IterableIterator<DrawObject>;

    constructor(ctx, config = {}) {
        this.config = {
            ...config, 
            drawCount: 400,
            width: innerWidth,
            height: innerHeight
        }
        this.ctx = ctx;
        this.ctxGlobals();

        this.draw = this.draw.bind(this);

        this.sequence = sequence(this.config.width, this.config.height);
        this.start();
    }
    start() {
        if (this.running || !this.sequence) {
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
        this.sequence = sequence(this.config.width, this.config.height);
        this.start();
    }
    destroy() {
        this.stop();
        this.sequence = null;
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    }
    private ctxGlobals() {
        this.ctx.strokeStyle = "rgba(0,0,0,0.2)";
    }
    private draw() {
        let count = this.config.drawCount;
        while (count && this.running) {
            const {x, y, size} = this.sequence.next().value;
            this.ctx.rect(x, y, size, size);
            count--;
        }
        this.ctx.stroke();
        if (this.running) {
            requestAnimationFrame(this.draw);
        }
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