import { FractalType } from "./types";
import { PrimeFractal } from "./fractals/prime";
import { TFractal } from "./fractals/tFractal";
import { RandomLineFractal } from "./fractals/randomLine";
import { XFractal } from "./fractals/xFractal";

export function factory(type: FractalType) {
    switch(type) {
        case FractalType.prime:
            return PrimeFractal;
        case FractalType.randomLine:
            return RandomLineFractal;
        case FractalType.t:
            return TFractal;
        case FractalType.x:
            return XFractal;
    }
}