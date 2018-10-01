import { FractalType } from "./types";
import { PrimeFractal } from "./fractals/prime";
import { TFractal } from "./fractals/tFractal";
import { RandomLineFractal } from "./fractals/randomLine";
import { XFractal } from "./fractals/xFractal";

export function factory(type: FractalType, ctx: CanvasRenderingContext2D, config: any) {
    switch(type) {
        case FractalType.prime:
            return new PrimeFractal(ctx, config);
        case FractalType.randomLine:
            return new RandomLineFractal(ctx, config);
        case FractalType.t:
            return new TFractal(ctx, config);
        case FractalType.x:
            return new XFractal(ctx, config);
    }
}