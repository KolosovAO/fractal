import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";
import { getPrimesMap } from "../utils/get-primes-map";

type NumberType = "&" | "|" | "^";
type TransformFn = (a: number, b: number) => number;

interface Config {
    type: NumberType;
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

interface DrawObject {
    x: number;
    y: number;
    w: number;
    colorArray: Uint8ClampedArray;
}

const TYPE_TO_FN_MAP: Record<NumberType, TransformFn> = {
    "&": (x, y) => x & y,
    "|": (x, y) => x | y,
    "^": (x, y) => x ^ y,
};

export class PrimeNumberFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    public getConfigHints() {
        return {
            type: ["&", "|", "^"]
        };
    }

    protected getOwnConfig() {
        return {
            drawCount: 1,
            type: "^",
            red: 0,
            green: 255,
            blue: 255,
            alpha: 255
        } as const;
    }

    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config);
    }

    protected drawObject({x, y, w, colorArray}) {
        const imageData = new ImageData(colorArray, w);
        this.ctx.putImageData(imageData, x, y);
    }
}

const WIDTH_STEP = 8;

function* sequence(width: number, height: number, {red, green, blue, alpha, type}: Config): IterableIterator<DrawObject> {
    let x = 0;
    const primesMap = getPrimesMap(width * height);
    const transformFN = TYPE_TO_FN_MAP[type] || TYPE_TO_FN_MAP["&"];

    while (x < width) {
        const w = Math.min(WIDTH_STEP, width - x);
        const colorArray = new Uint8ClampedArray(w * height * 4);
        for (let i = 0; i <= colorArray.length; i += 4) {
            const xCoord = (i / 4) % w + x;
            const yCoord = ~~(i / 4 / w);

            if (primesMap[transformFN(xCoord, yCoord)]) {
                colorArray[i] = red;
                colorArray[i + 1] = green;
                colorArray[i + 2] = blue;
                colorArray[i + 3] = alpha;
            }
        }
        yield {x, y: 0, w, colorArray};

        x += WIDTH_STEP;
    }
}
