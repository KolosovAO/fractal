import { LeviFractal } from "./levi";

export class DragonFractal extends LeviFractal {
    getSequence() {
        return sequence(this.config.width, this.config.height, this.config.iterations);
    }
}

function* sequence(width, height, iterations) {
    const radian45 = 45 * Math.PI / 180;

    const cosA = Math.cos(radian45);
    const sinA = Math.sin(radian45);

    let pairs: any = [
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
    ]

    let iteration = -1;

    while (++iteration < iterations) {
        const newPairs = [];
        
        yield {
            clear: true,
            iteration: iteration + 1
        }

        for (let i=0; i<pairs.length; i++) {
            const [a1, a2, k] = pairs[i];

            yield {
                a1,
                a2
            }

            const {x: x1, y: y1} = a1;
            const {x: x2, y: y2} = a2;

            const xDif = x2 - x1;
            const yDif = y2 - y1;

            const a3 = {
                x: cosA * (xDif * cosA - yDif * sinA*k) + x1,
                y: cosA * (xDif * sinA*k + yDif * cosA) + y1
            };

            newPairs.push([a1,a3,1], [a3,a2,-1]);
        }
        
        pairs = newPairs;
    }
}