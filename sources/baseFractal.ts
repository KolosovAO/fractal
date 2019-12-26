import { FractalEventSystem, FractalEvent } from "./types";

interface DefaultConfig {
    width: number;
    height: number;
    drawCount: number;
}

const DEFAULT_DRAW_COUNT = 100;

export abstract class BaseFractal<T, U extends {}> {
    public config: U & DefaultConfig;
    public events: FractalEventSystem;
    public ctx: CanvasRenderingContext2D;

    private running: boolean;
    private sequence: IterableIterator<T>;

    constructor(ctx: CanvasRenderingContext2D, configWithEvents: DefaultConfig & {events: FractalEventSystem}) {
        const {events, ...config} = configWithEvents;
        this.events = events;

        this.config = {
            drawCount: DEFAULT_DRAW_COUNT,
            ...config,
            ...this.getOwnConfig()
        }
    
        this.ctx = ctx;
        this.ctxDefaults();
        this.ctxGlobals();

        this.attachEvents();

        this.clear();
        this.init();
    }
    getConfigHints(): Record<string, string[] | undefined> {
        return {};
    }
    start() {
        if (this.running || !this.sequence) {
            return;
        }
        this.running = true;
        requestAnimationFrame(this.draw);
    }
    stop() {
        this.running = false;
    }
    async refresh() {
        this.sequence = await this.getSequence();
        this.stop();
        this.clear();
        this.onRefresh();
        this.start();
    }
    destroy() {
        this.stop();
        this.sequence = null;
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
        this.destroyEvents();
    }
    updateConfig(config: U) {
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
    protected getOwnConfig(): U & Partial<DefaultConfig> {
        return {} as U;
    }
    protected getEvents() {
        return {};
    }

    protected ctxGlobals() {
        return;
    }

    protected abstract async getSequence(): Promise<IterableIterator<T>>;
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
    private draw = () => {
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
    private async init() {
        this.sequence = await this.getSequence();
        this.onInit();
        this.start();
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
