import { FractalType } from "./types";
import { prime } from "./fractals/prime";
import { tFractal } from "./fractals/t";
import { randomFractal } from "./fractals/randomLine";

export function factory(type: FractalType) {
    switch(type) {
        case FractalType.prime:
            return prime;
        case FractalType.randomLine:
            return randomFractal;
        case FractalType.t:
            return tFractal;
    }
}