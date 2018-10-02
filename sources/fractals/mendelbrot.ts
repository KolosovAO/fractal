import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
    size?: number;
}

interface DrawObject {
    x: number;
    y: number;
    color: string;
}

export class MendelbrotFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected setConfig(config) {
        this.config = {
            ...config,
            drawCount: 20000,
            width: innerWidth,
            height: innerHeight,
            size: 0.2
        }
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.size);
    }

    protected drawObject({x, y, color}) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, this.config.size, this.config.size);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}

const toHex = v => v < 16 ? 0 + v.toString(16) : v.toString(16);
const pallete = Array.from({length: 256}, (_, i) => {
    let r, g, b;

    switch(true) {
        case i < 85:
            r = i * 3;
            g = i * 2;
            b = i;
            break;
        case i < 171:
            r = i - 84;
            g = (i - 84) * 3;
            b = (i - 84) * 2;
            break;
        default:
            r = (i - 170) * 2;
            g = i - 170;
            b = (i - 170) * 3;
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
});

function* sequence(width, height, size): IterableIterator<DrawObject> {
    for (let x=0; x<width; x += size) {
        for(let y=0; y<height; y += size) {
            let i = 0;
            const cx = -2 + x * 4 / width;
            const cy = -2 + y * 4 / height;
            let zx = 0;
            let zy = 0;                        

            do
            {
                const xt = zx * zy;
                zx = zx * zx - zy * zy + cx;
                zy = 2 * xt + cy;
                i++;
            }
            while(i<255 && (zx * zx + zy * zy) < 4);

            const color = pallete[i];
    
            yield {
                x,
                y,
                color
            }
        }
    }
}
