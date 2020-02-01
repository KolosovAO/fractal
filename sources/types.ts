import { EventSystem } from "./utils/events";

export enum FractalType {
    mandelbrot = "mandelbrot",
    primeNumber = "primeNumber",
    tree = "tree",
    pythagorasTree = "pythagorasTree",
    plane = "plane",
    koch = "koh",
    circle = "circle",
    t = "t",
    dragon = "dragon",
    levi = "levi",
    spiral = "spiral",
    universe = "universe",
    randomPoint = "randomPoint",
    serpinski = "serpinski",
    prime = "prime",
    x = "x",
}


export interface Fractal {
    ctx: CanvasRenderingContext2D;
    config: { [key: string]: any };
    events: FractalEventSystem;
    start(): void;
    stop(): void;
    refresh(): void;
    destroy(): void;
    updateConfig(config: any): void;
    getConfigHints(): Record<string, string[] | undefined>;
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

export const enum KeyCode {
    ESC = 27,
    ARROW_LEFT = 37,
    ARROW_RIGHT = 39,
}

export type FractalEventSystem = EventSystem<FractalEvent>