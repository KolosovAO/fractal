import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
    xCoords?: [number, number];
    yCoords?: [number, number];
}

interface DrawObject {
    x: number;
    y: number;
    color: string;
}

export class MendelbrotFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    private scale: number = 1;

    protected setConfig(config) {
        this.config = {
            ...config,
            drawCount: 20000,
            width: innerWidth,
            height: innerHeight,
            xCoords: [-1.7, 0.5],
            yCoords: [-1.2, 1.2]
        }
    }

    onCanvasClick(e) {
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

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.xCoords, this.config.yCoords);
    }

    protected drawObject({x, y, color}) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, 1, 1);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}

const toHex = v => v < 16 ? 0 + v.toString(16) : v.toString(16);
const pallete = Array.from({length: 768}, (_, i) => {
    let r, g, b;

    switch(true) {
        case i < 256:
            r = i;
            g = (i / 2) | 0;
            b = (i / 3) | 0;
            break;
        case i < 512:
            i = i % 256;

            r = (i / 2) | 0;
            g = i;
            b = (i / 3) | 0;
            break;
        default:
            i = i % 256;

            r = (i / 3) | 0;
            g = (i / 2) | 0;
            b = i;
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
});

function* sequence(width, height, [xStart, xEnd], [yStart, yEnd]): IterableIterator<DrawObject> {
    const xStep = (xEnd - xStart) / width;
    const yStep = (yEnd - yStart) / height;

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
            } while(i<765 && (zx * zx + zy * zy) < 4)

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
