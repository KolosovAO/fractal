import { Fractal } from "../types";
import { BaseFractal } from "../base-fractal";

interface DrawObject {
    x: number;
    y: number;
    sizeX: number;
    sizeY: number;
}

export class XFractal extends BaseFractal<DrawObject, {}> implements Fractal {
    protected getOwnConfig() {
        return {
            drawCount: 40
        }
    }
    
    protected async getSequence() {
        return sequence(this.config.width, this.config.height);
    }

    protected ctxGlobals() {
        this.ctx.lineWidth = 0.2;
    }
    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({x, y, sizeX, sizeY}: DrawObject) {
        this.ctx.moveTo(x - sizeX / 2, y);
        this.ctx.lineTo(x + sizeX / 2, y);

        this.ctx.moveTo(x, y - sizeY / 2);
        this.ctx.lineTo(x, y + sizeY / 2);
    }
}

function* sequence(width: number, height: number): IterableIterator<DrawObject> {
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
        }, [] as DrawObject[]);
    }
}