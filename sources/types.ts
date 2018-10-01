export enum FractalType {
    randomLine,
    t,
    prime,
    x
}


export interface Fractal {
    ctx: CanvasRenderingContext2D;
    config: {[key: string]: any};
    start(): void;
    stop(): void;
    refresh(): void;
    destroy(): void;
}