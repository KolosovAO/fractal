import { LeviFractal } from "./levi";

interface Point {
    x: number;
    y: number;
}

export class DragonFractal extends LeviFractal {
    protected async getSequence() {
        return sequence(this.config.width, this.config.height, this.config.iterations);
    }
}

function* sequence(width: number, height: number, iterations: number) {
    const radian45 = 45 * Math.PI / 180;

    const cosA = Math.cos(radian45);
    const sinA = Math.sin(radian45);

    let pairs: [Point, Point, number][] = [
        [
            {
                x: width / 3,
                y: height / 4
            },
            {
                x: width * 2 / 3,
                y: height / 4
            },
            1
        ]
    ];

    let iteration = -1;

    while (++iteration < iterations) {
        const newPairs: [Point, Point, number][] = [];
        
        yield {
            clear: true,
            iteration: iteration + 1
        }

        for (let i=0; i<pairs.length; i++) {
            const [p1, p2, k] = pairs[i];

            yield {
                p1,
                p2
            }

            const {x: x1, y: y1} = p1;
            const {x: x2, y: y2} = p2;

            const xDif = x2 - x1;
            const yDif = y2 - y1;

            const p3 = {
                x: cosA * (xDif * cosA - yDif * sinA*k) + x1,
                y: cosA * (xDif * sinA*k + yDif * cosA) + y1
            };

            newPairs.push([p1, p3, 1], [p3, p2, -1]);
        }
        
        pairs = newPairs;
    }
}