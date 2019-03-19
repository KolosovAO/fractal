import { FractalEventSystem, FractalEvent } from "./types";

export abstract class BaseFractal<T = any> {
    public config: any;
    public events: FractalEventSystem;
    public ctx: CanvasRenderingContext2D;

    private running: boolean;
    private sequence: IterableIterator<T>;

    constructor(ctx, config) {
        this.events = config.events;
        delete config.events;

        this.config = this.getConfig(config);
    
        this.ctx = ctx;
        this.ctxDefaults();
        this.ctxGlobals();

        this.attachEvents();

        this.draw = this.draw.bind(this);

        this.sequence = this.getSequence();
        this.onInit();
        this.start();
    }
    start() {
        if (this.running || !this.sequence) {
            return;
        }
        this.clear();
        this.running = true;
        requestAnimationFrame(this.draw);
    }
    stop() {
        this.running = false;
    }
    refresh() {
        this.stop();
        this.sequence = this.getSequence();
        this.onRefresh();
        this.start();
    }
    destroy() {
        this.stop();
        this.sequence = null;
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
        this.destroyEvents();
    }
    updateConfig(config) {
        this.config = {...this.config, ...config};
        this.refresh();
    }
    clear() {
        if (this.getMode() === "night") {
            this.ctx.fillStyle = "#000";
            this.ctx.fillRect(0, 0, this.config.width, this.config.height);
        } else {
            this.ctx.clearRect(0, 0, this.config.width, this.config.height);
        }
    }
    protected getMode(): "default" | "night" {
        return "default";
    }
    protected getConfig(config: any): object {
        return {
            ...config,
            width: innerWidth,
            height: innerHeight,
            drawCount: 100
        };
    }
    protected getEvents() {
        return {};
    }

    protected ctxGlobals() {
        return;
    }

    protected abstract getSequence(): IterableIterator<T>;
    protected abstract drawObject(obj: T): void;

    protected onInit(): void {
        return;
    }
    protected onDrawEnd(): void {
        return;
    }
    protected onDrawStart(): void {
        return;
    }
    protected onRefresh(): void {
        return;
    }
    private draw() {
        this.onDrawStart();

        let count = this.config.drawCount;
        while (count && this.running) {
            const object = this.sequence.next().value;
            if (!object) { // [TODO] fix it
                this.onDrawEnd();
                this.stop();
                return;
            }
            this.drawObject(object);
            count--;
        }
        
        this.onDrawEnd();

        if (this.running) {
            requestAnimationFrame(this.draw);
        }
    }
    private ctxDefaults() {
        this.ctx.lineWidth = 1;
        if (this.getMode() === "night") {
            this.ctx.strokeStyle = "#FFF";
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
            this.ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
            this.ctx.fillStyle = "#FFF";
        }

        this.ctx.globalAlpha = 1;

        this.ctx.font = "24px Roboto";
    }
    private attachEvents() {
        const events = this.getEvents();

        for (const name in events) {
            this.events.on(name as FractalEvent, events[name], this);
        }
    }
    private destroyEvents() {
        const events = Object.keys(this.getEvents());

        events.forEach(event => {
            this.events.detach(event as FractalEvent, this);
        });
    }
}