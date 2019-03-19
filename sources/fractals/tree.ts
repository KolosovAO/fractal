import { Fractal } from "../types";
import { BaseFractal } from "../baseFractal";

interface Config {
    drawCount?: number;
    width?: number;
    height?: number;
    angle?: number;
}

interface DrawObject {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    lineWidth: number;
    angle?: number;
}

export class TreeFractal extends BaseFractal<DrawObject> implements Fractal {
    public config: Config;

    protected getConfig(config) {
        return {
            ...config,
            drawCount: 1,
            angle: 60
        }
    }

    protected getMode(): "default" | "night" {
        return "night";
    }

    protected getSequence() {
        return sequence(this.config.width, this.config.height, this.config.angle);
    }

    protected onDrawStart() {
        this.ctx.beginPath();
    }
    protected onDrawEnd() {
        this.ctx.stroke();
    }

    protected drawObject({x1, x2, y1, y2, lineWidth}) {
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
    }
}

function* sequence(width, height, angle): IterableIterator<DrawObject> {
    let dist = height * 0.6;
    let lineWidth = 15;

   angle = Math.PI * angle / 180;

    let lines = [
        {
            x1: width / 2,
            y1: height,
            x2: width / 2,
            y2: height - dist,
            angle: Math.PI / 2,
            lineWidth
        }
    ];

    while(dist > 1) {
        dist /= 1.8;
        lineWidth /= 1.4;
        const newLines = [];
        for (const line of lines) {
            yield line;

            newLines.push(
                {
                    x1: line.x2,
                    y1: line.y2,
                    x2: line.x2 + dist * Math.cos(line.angle + angle),
                    y2: line.y2 + dist * Math.sin(line.angle + angle),
                    lineWidth,
                    angle: line.angle + angle
                },
                {
                    x1: line.x2,
                    y1: line.y2,
                    x2: line.x2 + dist * Math.cos(line.angle - angle),
                    y2: line.y2 + dist * Math.sin(line.angle - angle),
                    lineWidth,
                    angle: line.angle - angle
                } 
            )
        }

        lines = newLines;
    }
}
