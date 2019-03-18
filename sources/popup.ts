import { FractalEventSystem, FractalEvent } from "./types";
import { greaterThanZero } from "./helpers";

export class Popup {
    public container: HTMLElement;
    public events: FractalEventSystem; 

    private control: HTMLElement;
    private opened: boolean;

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

            switch(id) {
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
    }
    isOpened() {
        return this.opened;
    }
    show(x: number, y: number) {
        if (!this.opened) {
            this.container.appendChild(this.control);
            this.opened = true;
        }
        const rect = this.control.getBoundingClientRect();
        x = Math.min(greaterThanZero(x - rect.width / 2), window.innerWidth - rect.width);
        y = Math.min(greaterThanZero(y - rect.height / 2), window.innerHeight - rect.height);
        this.control.style.left = x + "px";
        this.control.style.top = y + "px";
    }

    hide() {
        if (!this.opened) {
            return;
        }

        this.opened = false;
        this.container.removeChild(this.control);
        this.events.fire(FractalEvent.hidePopup);
    }
}