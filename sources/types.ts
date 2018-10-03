export enum FractalType {
    dragon = "dragon",
    levi = "levi",
    mendelbrot = "mendelbrot",
    randomLine = "random",
    line = "line",
    t = "t",
    prime = "prime",
    x = "x"
}


export interface Fractal {
    ctx: CanvasRenderingContext2D;
    config: {[key: string]: any};
    start(): void;
    stop(): void;
    refresh(): void;
    destroy(): void;
    onCanvasClick(e): void;
}