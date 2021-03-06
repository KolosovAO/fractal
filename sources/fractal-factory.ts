import { FractalType } from "./types";
import { PrimeFractal } from "./fractals/prime";
import { TFractal } from "./fractals/t";
import { SerpinskiFractal } from "./fractals/serpinski";
import { XFractal } from "./fractals/x";
import { MandelbrotFractal } from "./fractals/mandelbrot";
import { LeviFractal } from "./fractals/levi";
import { DragonFractal } from "./fractals/dragon";
import { KochFractal } from "./fractals/koch";
import { CircleFractal } from "./fractals/circle";
import { PlaneFractal } from "./fractals/plane";
import { SpiralFractal } from "./fractals/spiral";
import { RandomPointFractal } from "./fractals/random";
import { Universe } from "./fractals/universe";
import { TreeFractal } from "./fractals/tree";
import { PythagorasTree } from "./fractals/pythagoras-tree";
import { PrimeNumberFractal } from "./fractals/prime-number";

export function factory(type: FractalType, ctx: CanvasRenderingContext2D, config: any) {
    switch (type) {
        case FractalType.prime:
            return new PrimeFractal(ctx, config);
        case FractalType.serpinski:
            return new SerpinskiFractal(ctx, config);
        case FractalType.t:
            return new TFractal(ctx, config);
        case FractalType.x:
            return new XFractal(ctx, config);
        case FractalType.mandelbrot:
            return new MandelbrotFractal(ctx, config);
        case FractalType.levi:
            return new LeviFractal(ctx, config);
        case FractalType.dragon:
            return new DragonFractal(ctx, config);
        case FractalType.koch:
            return new KochFractal(ctx, config);
        case FractalType.circle:
            return new CircleFractal(ctx, config);
        case FractalType.plane:
            return new PlaneFractal(ctx, config);
        case FractalType.spiral:
            return new SpiralFractal(ctx, config);
        case FractalType.randomPoint:
            return new RandomPointFractal(ctx, config);
        case FractalType.universe:
            return new Universe(ctx, config);
        case FractalType.tree:
            return new TreeFractal(ctx, config);
        case FractalType.pythagorasTree:
            return new PythagorasTree(ctx, config);
        case FractalType.primeNumber:
            return new PrimeNumberFractal(ctx, config);
    }
}