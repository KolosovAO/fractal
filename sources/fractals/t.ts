import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";

interface Config {
    pattern: string;
}

interface DrawObject {
    x: number;
    y: number;
    size: number;
}

export class TFractal extends BaseFractal<DrawObject, Config> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 2000,
            pattern: "0110,1001,1001,0110"
        }
    }

    protected async getSequence() {
        const size = this.config.pattern.split(",").length;
        return sequence(this.config.width, this.config.height, size);
    }

    protected ctxGlobals() {
        this.ctx.fillStyle = "rgba(0,0,0,0.3)";
    }
    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({ x, y, size }: DrawObject) {
        const pattern = this.config.pattern.split(",");
        for (let i = 0; i < pattern.length; i++) {
            for (let j = 0; j < pattern[i].length; j++) {
                if (pattern[i][j] === "1") {
                    this.ctx.fillRect(x + size * i, y + size * j, size, size);
                }
            }
        }
    }
}

function* sequence(width: number, height: number, size: number): IterableIterator<DrawObject> {
    const baseSize = size;
    while (size < height) {
        for (let x = 0; x < width; x += size) {
            for (let y = 0; y < height; y += size) {
                yield {
                    x,
                    y,
                    size: size / baseSize
                };
            }
        }
        size *= 2;
    }
}