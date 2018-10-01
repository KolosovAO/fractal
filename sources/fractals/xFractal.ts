import { Fractal } from "../types";

export interface XFractalConfig {
    drawCount?: number;
    width?: number;
    height?: number;
}

interface DrawObject {
    x: number;
    y: number;
    sizeX: number;
    sizeY: number;
}

export class XFractal implements Fractal {
    public config: XFractalConfig;
    public ctx: CanvasRenderingContext2D;

    private running: boolean;
    private sequence: IterableIterator<DrawObject>;

    constructor(ctx, config = {}) {
        this.config = {
            ...config, 
            drawCount: 40,
            width: innerWidth,
            height: innerHeight
        }
        this.ctx = ctx;
        this.ctxGlobals();

        this.draw = this.draw.bind(this);

        this.sequence = sequence(this.config.width, this.config.height);
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
        this.sequence = sequence(this.config.width, this.config.height);
        this.start();
    }
    destroy() {
        this.stop();
        this.sequence = null;
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    }
    private ctxGlobals() {
        this.ctx.lineWidth = 0.2;
    }
    private draw() {
        let count = this.config.drawCount;
        this.ctx.beginPath();
        while (count) {
            const point = this.sequence.next().value;
            this.drawX(point);
            count--;
        }
        this.ctx.stroke();
        if (this.running) {
            requestAnimationFrame(this.draw);
        }
    }
    private drawX({x, y, sizeX, sizeY}) {
        this.ctx.moveTo(x - sizeX / 2, y);
        this.ctx.lineTo(x + sizeX / 2, y);

        this.ctx.moveTo(x, y - sizeY / 2);
        this.ctx.lineTo(x, y + sizeY / 2);
    }
}

function* sequence(width, height): IterableIterator<DrawObject> {
    let sizeX = width;
    let sizeY = height;
    let points: DrawObject[] = [
        {
            x: sizeX / 2,
            y: sizeY / 2,
            sizeX,
            sizeY
        }
    ];
    while (true) {
        for (let i=0; i<points.length; i++) {
            yield points[i];
        }
        sizeX /= 2;
        sizeY /= 2;

        points = points.reduce((arr, point) => {
            arr.push(
                {
                    x: point.x + sizeX / 2,
                    y: point.y + sizeY / 2,
                    sizeX,
                    sizeY
                },
                {
                    x: point.x - sizeX / 2,
                    y: point.y - sizeY / 2,
                    sizeX,
                    sizeY
                },
                {
                    x: point.x + sizeX / 2,
                    y: point.y - sizeY / 2,
                    sizeX,
                    sizeY
                },
                // {
                //     x: point.x - sizeX / 2,
                //     y: point.y + sizeY / 2
                // }
            );
            return arr;
        }, []);
    }
}