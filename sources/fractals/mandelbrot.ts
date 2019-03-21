import { Fractal, FractalEvent } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    xCoords?: [number, number];
    yCoords?: [number, number];
    hue?: number;
    saturation?: number;
    iterations?: number;
}

interface DrawObject {
    x: number;
    y: number;
    color: string;
}

export class MandelbrotFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    private scale: number = 1;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 5000,
            xCoords: [-1.8, 0.6],
            yCoords: [-1.1, 1.1],
            iterations: 255,
            hue: 220,
            saturation: 0.8
        }
    }

    protected onInit() {
        this.events.fire(FractalEvent.showHelp, ["Use mousewheel for zoom in and zoom out"])
    }
    protected async getSequence() {
        const dots: Int32Array = await this.getMandelbrotRender();
        return sequence(this.config.height, this.config.iterations, this.config.hue, this.config.saturation, dots);
    }

    protected getEvents() {
        return {
            [FractalEvent.zoomIn]: (x: number, y: number) => this._scale(x, y, 5),
            [FractalEvent.zoomOut]: (x: number, y: number) => this._scale(x, y, 0.2)
        }
    }

    protected drawObject({x, y, color}) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, 1, 1);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    private _scale(x: number, y: number, scaleFactor: number) {
        this.scale /= scaleFactor;

        const xLen = this.config.xCoords[1] - this.config.xCoords[0];
        const yLen = this.config.yCoords[1] - this.config.yCoords[0];

        const rX = xLen * x / this.config.width + this.config.xCoords[0];
        const rY = yLen * y / this.config.height + this.config.yCoords[0];

        this.config.xCoords = [rX - this.scale, rX + this.scale];
        this.config.yCoords = [rY - this.scale, rY + this.scale];
        if (scaleFactor > 1) {
            this.config.iterations += 50;
        } else {
            this.config.iterations -= 50;
        }

        this.refresh();
    }
    private async getMandelbrotRender() {
        const id = Date.now();
        this.events.fire(FractalEvent.requestMandelbrot, [{
            id,
            width: this.config.width, 
            height: this.config.height,
            x_start: this.config.xCoords[0],
            x_end: this.config.xCoords[1],
            y_start: this.config.yCoords[0],
            y_end: this.config.yCoords[1],
            max_iterations: this.config.iterations
        }]);

        return new Promise<Int32Array>(res => {
            this.events.on(FractalEvent.responseMandelbrot, (event: any) => {
                if (event.data.id === id) {
                    res(event.data.result);
                }
            }, Date.now(), true);
        })
    }
}

const getPallete = (iterations: number, h: number, s: number) => Array.from({length: iterations}, (_, i) => `hsl(${h},${s*100}%,${(iterations - i) / iterations * 100}%)`);

function* sequence(height: number, iterations: number, hue: number, saturation: number, dots: Int32Array): IterableIterator<DrawObject> {
    const pallete = getPallete(iterations, hue, saturation);

    for (let i=0; i<dots.length; i++) {
        const x = ~~(i / height);
        const y = i % height;
        const color = pallete[dots[i]];
    
        yield {
            x,
            y,
            color
        }
    }
}

/* OLD RENDERER
function* sequence(width, height, iterations, hue, saturation, [xStart, xEnd], [yStart, yEnd]): IterableIterator<DrawObject> {
    const xStep = (xEnd - xStart) / width;
    const yStep = (yEnd - yStart) / height;
    const pallete = getPallete(iterations, hue, saturation);

    // pixels
    let x = -1;
    let y;

    for (let cx=xStart; cx<xEnd; cx += xStep) {
        x++;
        y = 0;

        for(let cy=yStart; cy<yEnd; cy += yStep) {
            let i = 0;

            let zx = 0;
            let zy = 0;                        

            do {
                const xt = zx * zy;
                zx = zx * zx - zy * zy + cx;
                zy = 2 * xt + cy;
                i++;
            } while(i<iterations && (zx * zx + zy * zy) < 4)

            const color = pallete[i];
    
            yield {
                x,
                y,
                color
            }
            y++;
        }
    }
}

*/