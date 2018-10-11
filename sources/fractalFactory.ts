import { FractalType } from "./types";
import { PrimeFractal } from "./fractals/prime";
import { TFractal } from "./fractals/tFractal";
import { RandomLineFractal } from "./fractals/randomLine";
import { XFractal } from "./fractals/xFractal";
import { MendelbrotFractal } from "./fractals/mendelbrot";
import { LineFractal } from "./fractals/line";
import { LeviFractal } from "./fractals/levi";
import { DragonFractal } from "./fractals/dragon";
import { KochFractal } from "./fractals/koch";
import { CircleFractal } from "./fractals/circle";
import { MidPointFractal } from "./fractals/midPoints";
import { PlaneFractal } from "./fractals/plane";
import { SpiralFractal } from "./fractals/spiral";
import { RandomPointFractal } from "./fractals/random";
import { Universe } from "./fractals/universe";

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
        case FractalType.mendelbrot:
            return new MendelbrotFractal(ctx, config);
        case FractalType.line:
            return new LineFractal(ctx, config);
        case FractalType.levi:
            return new LeviFractal(ctx, config);
        case FractalType.dragon:
            return new DragonFractal(ctx, config);
        case FractalType.koch:
            return new KochFractal(ctx, config);
        case FractalType.circle:
            return new CircleFractal(ctx, config);
        case FractalType.midPoint:
            return new MidPointFractal(ctx, config);
        case FractalType.plane:
            return new PlaneFractal(ctx, config);
        case FractalType.spiral:
            return new SpiralFractal(ctx, config);
        case FractalType.randomPoint:
            return new RandomPointFractal(ctx, config);
        case FractalType.universe:
            return new Universe(ctx, config);
    }
}