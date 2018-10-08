import { EventSystem } from "./events";

export enum FractalType {
    koh = "koh",
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
    events: FractalEventSystem;
    start(): void;
    stop(): void;
    refresh(): void;
    destroy(): void;
    updateConfig(config: any): void;
}

export enum FractalEvent {
    click = "click",

    showPopup = "showPopup",

    requestConfig = "requestConfig",
    updateConfig = "updateConfig",

    hidePopup = "hidePopup",

    showConfig = "showConfig",
    refresh = "refresh",
    resume = "resume",
    next = "next"
}

export interface FractalEventSystem extends EventSystem<FractalEvent> {}