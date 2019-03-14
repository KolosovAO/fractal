import { Fractal, FractalEvent } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
    xCoords?: [number, number];
    yCoords?: [number, number];
    iterations?: number;
}

interface DrawObject {
    x: number;
    y: number;
    color: string;
}

export class MandelbrotFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    private scale: number = 1;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 20000,
            width: innerWidth,
            height: innerHeight,
            xCoords: [-1.7, 0.5],
            yCoords: [-1.2, 1.2],
            iterations: 255
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.iterations, this.config.xCoords, this.config.yCoords);
    }

    protected getEvents() {
        return {
            [FractalEvent.click]: e => {        
                const scaleFactor = e.which === 1 ? 10 : 0.1;
                const {x, y} = e;
                this.scale /= scaleFactor;
                const xLen = this.config.xCoords[1] - this.config.xCoords[0];
                const yLen = this.config.yCoords[1] - this.config.yCoords[0];
        
                const rX = xLen * x / this.config.width + this.config.xCoords[0];
                const rY = yLen * y / this.config.height + this.config.yCoords[0];
        
                this.config.xCoords = [rX - this.scale, rX + this.scale];
                this.config.yCoords = [rY - this.scale, rY + this.scale];
            }
        }
    }

    protected drawObject({x, y, color}) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, 1, 1);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}

const getPallete = (iterations: number) => Array.from({length: iterations}, (_, i) => `hsl(220,50%,${(iterations - i) / iterations * 100}%)`);

function* sequence(width, height, iterations, [xStart, xEnd], [yStart, yEnd]): IterableIterator<DrawObject> {
    const xStep = (xEnd - xStart) / width;
    const yStep = (yEnd - yStart) / height;
    const pallete = getPallete(iterations);

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
