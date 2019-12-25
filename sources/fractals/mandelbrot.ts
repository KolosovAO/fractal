import { Fractal, FractalEvent } from "../types";
import { BaseFractal } from "../baseFractal";

type Coord = [number, number];

interface Config {
    xCoords: Coord;
    yCoords: Coord;
    iterations: number;
}

interface DrawObject {
    x: number;
    y: number;
    w: number;
    colorArray: Uint8ClampedArray;
}

export class MandelbrotFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    private scaleFactor = 1;

    protected getOwnConfig() {
        return {
            drawCount: 4,
            xCoords: [-1.9, 0.7] as Coord,
            yCoords: [-1.2, 1.2] as Coord,
            iterations: 100,
        };
    }

    protected onInit() {
        this.events.fire(FractalEvent.showHelp, ["Use mousewheel for zoom in and zoom out"])
    }
    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config);
    }

    protected getEvents() {
        return {
            [FractalEvent.zoomIn]: (x: number, y: number) => this.scale(x, y, 5),
            [FractalEvent.zoomOut]: (x: number, y: number) => this.scale(x, y, 0.2)
        }
    }

    protected drawObject({x, y, w, colorArray}) {
        const imageData = new ImageData(colorArray, w);
        this.ctx.putImageData(imageData, x, y);
    }

    private scale(x: number, y: number, scaleFactor: number) {
        this.scaleFactor /= scaleFactor;

        const xLen = this.config.xCoords[1] - this.config.xCoords[0];
        const yLen = this.config.yCoords[1] - this.config.yCoords[0];

        const rX = xLen * x / this.config.width + this.config.xCoords[0];
        const rY = yLen * y / this.config.height + this.config.yCoords[0];

        this.config.xCoords = [rX - this.scaleFactor, rX + this.scaleFactor];
        this.config.yCoords = [rY - this.scaleFactor, rY + this.scaleFactor];
        if (scaleFactor > 1) {
            this.config.iterations += 50;
        } else {
            this.config.iterations -= 50;
        }

        this.refresh();
    }
}

type RGBA = [number, number, number, number];

const MAX_ITER_COLORS: RGBA = [0, 0, 0, 255];
const COLORS: RGBA[] = [
    [66, 30, 15, 255],
    [25, 7, 26, 255],
    [9, 1, 47, 255],
    [4, 4, 73, 255],
    [0, 7, 100, 255],
    [12, 44, 138, 255],
    [24, 82, 177, 255],
    [57, 125, 209, 255],
    [134, 181, 229, 255],
    [211, 236, 248, 255],
    [241, 233, 191, 255],
    [248, 201, 95, 255],
    [255, 170, 0, 255],
    [204, 128, 0, 255],
    [153, 87, 0, 255],
    [106, 52, 3, 255],
];

const WIDTH_STEP = 8;

function* sequence(width: number, height: number, {iterations, xCoords:[xStart, xEnd], yCoords:[yStart, yEnd]}: Config): IterableIterator<DrawObject> {
    const xStep = (xEnd - xStart) / width;
    const yStep = (yEnd - yStart) / height;

    let x = 0;

    while (x < width) {
        const w = Math.min(WIDTH_STEP, width - x);
        const colorArray = new Uint8ClampedArray(w * height * 4);

        for (let i = 0; i <= colorArray.length; i += 4) {
            const xCoord = (i / 4) % w + x;
            const yCoord = ~~(i / 4 / w);

            const cx = xStart + xStep * xCoord;
            const cy = yStart + yStep * yCoord;

            let iter = 0;
            let zx = 0;
            let zy = 0;
 
            do {
                const xt = zx * zy;
                zx = zx * zx - zy * zy + cx;
                zy = 2 * xt + cy;
                iter++;
            } while(iter < iterations && (zx * zx + zy * zy) < 4)

            const [r, g, b, a] = iter === iterations
                ? MAX_ITER_COLORS
                : COLORS[iter % 16];
            colorArray[i] = r;
            colorArray[i + 1] = g;
            colorArray[i + 2] = b;
            colorArray[i + 3] = a;
        }

        yield {x, y: 0, w, colorArray};

        x += WIDTH_STEP;
    }
}