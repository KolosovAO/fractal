import { EventSystem } from "./events";

export enum FractalType {
    mandelbrot = "mandelbrot",
    tree = "tree",
    pythagorasTree = "pythagorasTree",
    plane = "plane",
    koch = "koh",
    circle = "circle",
    t = "t",
    dragon = "dragon",
    levi = "levi",
    spiral = "spiral",
    midPoint = "midPoint",
    universe = "universe",
    randomPoint = "randomPoint",
    serpinski = "serpinski",
    prime = "prime",
    x = "x"
}


export interface Fractal {
    ctx: CanvasRenderingContext2D;
    config: {[key: string]: any};
    events: FractalEventSystem;
    start(): void;
    stop(): void;
    refresh(): void;
    destroy(): void;
    updateConfig(config: any): void;
}

export enum FractalEvent {
    click = "click",
    zoomIn = "zoomIn",
    zoomOut = "zoomOut",

    showPopup = "showPopup",
    showHelp = "showHelp",

    requestConfig = "requestConfig",
    updateConfig = "updateConfig",

    hidePopup = "hidePopup",

    showConfig = "showConfig",
    refresh = "refresh",
    resume = "resume",
    next = "next",
    download = "download"
}

export interface FractalEventSystem extends EventSystem<FractalEvent> {}