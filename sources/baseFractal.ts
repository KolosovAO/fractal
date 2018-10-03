export abstract class BaseFractal<T = any> {
    public config: any;
    public ctx: CanvasRenderingContext2D;

    private running: boolean;
    private sequence: IterableIterator<T>;

    constructor(ctx, config = {}) {
        this.setConfig(config);
    
        this.ctx = ctx;
        this.ctxGlobals();

        this.draw = this.draw.bind(this);

        this.sequence = this.getSequence();
        this.start();
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
    refresh() {
        this.destroy();
        this.sequence = this.getSequence();
        this.start();
    }
    destroy() {
        this.stop();
        this.sequence = null;
        this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    }
    onCanvasClick(e: MouseEvent) {
        return;
    }

    protected setConfig(config) {
        this.config = {...config,
            width: innerWidth,
            height: innerHeight,
            drawCount: 100
        };
    }

    protected ctxGlobals() {
        return;
    }

    protected abstract getSequence(): IterableIterator<T>;
    protected abstract drawObject(obj): void;

    protected onDrawCircleEnd(): void {
        return;
    }
    protected onDrawCircleStart(): void {
        return;
    }
    private draw() {
        this.onDrawCircleStart();

        let count = this.config.drawCount;
        while (count && this.running) {
            const object = this.sequence.next().value;
            if (!object) { // [TODO] fix it
                this.onDrawCircleEnd();
                this.stop();
                return;
            }
            this.drawObject(object);
            count--;
        }
        
        this.onDrawCircleEnd();

        if (this.running) {
            requestAnimationFrame(this.draw);
        }
    }
}