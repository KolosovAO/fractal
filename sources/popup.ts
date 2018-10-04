import { FractalEventSystem, FractalEvent } from "./types";

export class Popup {
    public container: HTMLElement;
    public events: FractalEventSystem; 

    private control: HTMLElement;
    private opened: boolean;

    constructor(container: HTMLElement, events: FractalEventSystem) {
        this.container = container;
        this.events = events;
        this.events.on(FractalEvent.showPopup, () => this.show());

        const control = document.createElement("div");
        control.className = "control";

        control.innerHTML = `
            <div id="show-config">show config</div>
            <div id="resume">resume</div>
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
            }
        }

        this.control = control;
    }

    show() {
        if (this.opened) {
            return;
        }
        this.opened = true;
        this.container.appendChild(this.control);
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