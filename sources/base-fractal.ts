import { FractalEventSystem, FractalEvent, Fractal } from "./types";
import { objectKeys } from "./ts-utils/object-keys";

interface DefaultConfig {
    width: number;
    height: number;
    drawCount: number;
}

const DEFAULT_DRAW_COUNT = 100;

export abstract class BaseFractal<T, U extends {}> implements Fractal {
    public config: U & DefaultConfig;
    public events: FractalEventSystem;
    public ctx: CanvasRenderingContext2D;

    private running: boolean;
    private sequence: IterableIterator<T> | null;

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

    public getConfigHints(): Record<string, string[] | undefined> {
        return {};
    }

    public start(): void {
        if (this.running || !this.sequence) {
            return;
        }
        this.running = true;
        requestAnimationFrame(this.startDrawLoop);
    }
    public stop(): void {
        this.running = false;
    }
    public async refresh(): Promise<void> {
        this.sequence = await this.getSequence();
        this.stop();
        this.clear();
        this.onRefresh();
        this.start();
    }
    public destroy(): void {
        this.stop();
        this.sequence = null;
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
        this.destroyEvents();
    }
    public updateConfig(config: U): void {
        this.config = {...this.config, ...config};
        this.refresh();
    }
    public clear(): void {
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
    protected getEvents(): Partial<Record<FractalEvent, (...args) => void>> {
        return {};
    }

    protected ctxGlobals(): void {
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
    private startDrawLoop = (): void => {
        this.onDrawStart();

        let count = this.config.drawCount;
        while (count && this.running) {
            const object = this.sequence!.next().value;
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
            requestAnimationFrame(this.startDrawLoop);
        }
    }
    private async init(): Promise<void> {
        this.sequence = await this.getSequence();
        this.onInit();
        this.start();
    }
    private ctxDefaults(): void {
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
    private attachEvents(): void {
        const events = this.getEvents();

        objectKeys(events).forEach(name => {
            this.events.on(name, events[name], this);
        });
    }
    private destroyEvents(): void {
        const events = this.getEvents();

        objectKeys(events).forEach(name => {
            this.events.detach(name, this);
        });
    }
}
