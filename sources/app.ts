import { Popup } from "./popup";
import { FractalType, Fractal } from "./types";
import { factory } from "./fractalFactory";

export class Application {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public popup: Popup;

    public fractal: Fractal;

    private fractalTypes: FractalType[];
    private index: number;

    private width: number;
    private height: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        const width = window.innerWidth;
        const height = window.innerHeight;
    
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        this.width = canvas.width = width;
        this.height = canvas.height = height;

        this.popup = new Popup(document.body);

        this.index = 0;
        this.fractalTypes = Object.keys(FractalType) as FractalType[];

        this.nextFractal();

        this.initHandlers();
    }

    nextFractal() {
        const index = this.index % this.fractalTypes.length;
        if (this.fractal) {
            this.fractal.destroy();
        }
        const type = this.fractalTypes[index];

        this.fractal = factory(FractalType[type], this.ctx, {
            width: this.width,
            height: this.height
        });

        this.index++;
    }

    private initHandlers() {
        this.popup.onRefresh = () => this.fractal.refresh();
        this.popup.onResume = () => this.fractal.start();
        this.popup.onNext = () => this.nextFractal();

        this.canvas.addEventListener("click", () => {
            this.fractal.stop();
            this.popup.show();
        });
    }


}