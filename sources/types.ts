export enum FractalType {
    randomLine = "random",
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
}