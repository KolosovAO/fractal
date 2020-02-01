import { FractalEventSystem, FractalEvent } from "../types";

export class Popup {
    public container: HTMLElement;
    public events: FractalEventSystem;

    private control: HTMLElement;
    private opened: boolean;

    private lastX: number;
    private lastY: number;

    constructor(container: HTMLElement, events: FractalEventSystem) {
        this.container = container;
        this.events = events;
        this.events.on(FractalEvent.showPopup, (x: number, y: number) => this.show(x, y));

        const control = document.createElement("div");
        control.className = "control";

        control.innerHTML = `
            <div id="show-config">show config</div>
            <div id="resume">resume</div>
            <div id="download">download</div>
            <div id="refresh">refresh</div>
            <div id="next">next fractal</div>
        `.trim();

        control.onclick = e => {
            const id = (e.target as HTMLElement).id;

            switch (id) {
                case "refresh":
                    this.events.fire(FractalEvent.refresh);
                    this.hide();
                    break;
                case "resume":
                    this.events.fire(FractalEvent.resume);
                    this.hide();
                    break;
                case "next":
                    this.events.fire(FractalEvent.next);
                    this.hide();
                    break;
                case "show-config":
                    this.events.fire(FractalEvent.requestConfig);
                    this.hide();
                    break;
                case "download":
                    this.events.fire(FractalEvent.download);
                    this.hide();
                    break;
            }
        }

        this.control = control;
        this.container.appendChild(this.control);
    }
    public isOpened() {
        return this.opened;
    }
    public show(x: number, y: number) {
        if (!this.opened) {
            this.control.classList.add("control__show");
            this.opened = true;
        }
        if (this.lastX) {
            const diff = ((this.lastX - x) ** 2 + (this.lastY - y) ** 2) ** .5;
            if (diff < 100) {
                return;
            }
        }
        this.lastX = x;
        this.lastY = y;
        const rect = this.control.getBoundingClientRect();
        x = Math.min(Math.max(0, (x - rect.width / 2)), window.innerWidth - rect.width);
        y = Math.min(Math.max(0, (y - rect.height / 2)), window.innerHeight - rect.height);
        this.control.style.left = x + "px";
        this.control.style.top = y + "px";
    }

    public hide() {
        if (!this.opened) {
            return;
        }

        this.opened = false;
        this.control.classList.remove("control__show");
        this.events.fire(FractalEvent.hidePopup);
    }
}