import { Popup } from "./popup";
import { FractalType, Fractal, FractalEventSystem, FractalEvent } from "./types";
import { factory } from "./fractalFactory";
import { EventSystem } from "./events";
import { Configurator } from "./configurator";

export class Application {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public events: FractalEventSystem;

    public popup: Popup;
    public configurator: Configurator;

    public fractal: Fractal;
    public fractalTitle: HTMLElement;
    public fractalHelperMessage: HTMLElement;
    public fractalHelperMessageTimeout: number;

    private fractalTypes: FractalType[];
    private index: number;

    private width: number;
    private height: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.events = new EventSystem<FractalEvent>();

        const width = window.innerWidth;
        const height = window.innerHeight;
    
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        this.width = canvas.width = width;
        this.height = canvas.height = height;

        this.popup = new Popup(document.body, this.events);
        this.configurator = new Configurator(document.body, this.events);

        this.fractalTitle = document.createElement("div");
        this.fractalTitle.className = "fractal-title";
        document.body.appendChild(this.fractalTitle);
        this.fractalHelperMessage = document.createElement("div");
        this.fractalHelperMessage.className = "fractal-helper-message";

        this.index = 0;
        this.fractalTypes = Object.keys(FractalType) as FractalType[];
        this.initHandlers();

        this.nextFractal();
    }

    nextFractal() {
        if (this.fractalHelperMessageTimeout) {
            clearTimeout(this.fractalHelperMessageTimeout);
            this.fractalHelperMessageTimeout = null;
        }
        const index = this.index % this.fractalTypes.length;
        if (this.fractal) {
            this.fractal.destroy();
        }
        const type = this.fractalTypes[index];

        this.fractal = factory(FractalType[type], this.ctx, {
            width: this.width,
            height: this.height,
            events: this.events
        });
        this.fractalTitle.textContent = type;
        this.index++;
    }

    private initHandlers() {
        this.events.on(FractalEvent.refresh, () => this.fractal.refresh());
        this.events.on(FractalEvent.resume, () => this.fractal.start());
        this.events.on(FractalEvent.next, () => this.nextFractal());
        this.events.on(FractalEvent.requestConfig, () => {
            this.events.fire(FractalEvent.showConfig, [this.fractal.config]);
        });
        this.events.on(FractalEvent.download, () => {
            const img = this.canvas.toDataURL("impage/png");
            const a = document.createElement("a");
            a.href = img;
            a.download = "fractal_" + Date.now() % 2**8 + ".png";
            window.location.href = img;
            a.click();
            this.fractal.start();
        });

        this.events.on(FractalEvent.updateConfig, config => {
            this.fractal.updateConfig(config);
        });

        this.events.on(FractalEvent.showHelp, (msg: string, delay: number = 3000) => {
            if (this.fractalHelperMessageTimeout) {
                clearTimeout(this.fractalHelperMessageTimeout);
            }
            this.fractalHelperMessage.textContent = msg;
            document.body.appendChild(this.fractalHelperMessage);
            this.fractalHelperMessageTimeout = setTimeout(() => {
                document.body.removeChild(this.fractalHelperMessage);
                this.fractalHelperMessageTimeout = null;
            }, delay);
        });

        this.canvas.addEventListener("click", (e: MouseEvent) => this.showMenu(e));
        this.canvas.addEventListener("mousewheel", (e: MouseWheelEvent) => {
            if (e.deltaY < 0) {
                this.events.fire(FractalEvent.zoomIn, [e.pageX, e.pageY]);
            } else {
                this.events.fire(FractalEvent.zoomOut, [e.pageX, e.pageY]);
            }
        });
        this.canvas.addEventListener("contextmenu", (e: MouseEvent) => {
            e.preventDefault();
            this.showMenu(e);
        });
    }

    private showMenu(e) {
        if (this.configurator.isOpened()) {
            return;
        }
        this.fractal.stop();
        this.events.fire(FractalEvent.showPopup);
        this.events.fire(FractalEvent.click, [e]);
    }
}