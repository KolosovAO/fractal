import { FractalEventSystem, FractalEvent } from "./types";

export class Configurator {
    public container: HTMLElement;
    public events: FractalEventSystem;

    private inputs: HTMLInputElement[];
    private configurator: HTMLElement;

    private opened: boolean;

    constructor(container: HTMLElement, events: FractalEventSystem) {
        this.container = container;
        this.events = events;

        this.inputs = [];

        this.events.on(FractalEvent.showConfig, config => this.show(config));
    }
    isOpened() {
        return this.opened;
    }

    show(config) {
        if (this.opened) {
            return;
        }
        this.opened = true;
        const inputs = [];

        const configurator = this.configurator = document.createElement("div");
        configurator.className = "configurator";

        for (const key in config) {
            if (config[key] instanceof Object) {
                continue;
            }
            const wrapper = document.createElement("div");
            wrapper.className = "property-wrapper";
            
            const label = document.createElement("div");
            label.className = "property-name";
            label.textContent = key;

            const input = document.createElement("input");
            input.id = key;
            input.value = config[key];
            inputs.push(input);

            wrapper.appendChild(label);
            wrapper.appendChild(input);

            configurator.appendChild(wrapper);
        }

        this.inputs = inputs;

        const buttonsBlock = document.createElement("div");
        buttonsBlock.className = "buttons-block";

        const update = document.createElement("button");
        update.textContent = "update";
        update.onclick = () => {
            this.events.fire(FractalEvent.updateConfig, [this.getConfig()]);
            this.hide();
        };
        const close = document.createElement("button");
        close.onclick = () => {
            this.events.fire(FractalEvent.resume);
            this.hide();
        };
        close.textContent = "close";

        buttonsBlock.appendChild(update);
        buttonsBlock.appendChild(close);

        configurator.appendChild(buttonsBlock);

        this.container.appendChild(configurator);
    }
    hide() {
        this.opened = false;
        this.inputs = [];
        this.container.removeChild(this.configurator);
    }

    private getConfig() {
        const config = {};
        for (const input of this.inputs) {
            config[input.id] = +input.value;
        }

        return config;
    }

}