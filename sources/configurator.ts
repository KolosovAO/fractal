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

        this.events.on(FractalEvent.showConfig, (config: Record<string, any>, hints: Record<string, undefined | string[]>) => this.show(config, hints));
    }
    isOpened() {
        return this.opened;
    }

    show(config: Record<string, any>, hints: Record<string, undefined | string[]> = {}) {
        if (this.opened) {
            return;
        }
        this.opened = true;
        const inputs = [];

        const configurator = this.configurator = document.createElement("div");
        configurator.className = "configurator";

        const header = document.createElement("div");
        header.className = "configurator__header";
        header.textContent = "Configuration";

        configurator.appendChild(header);

        for (const key in config) {
            if (key === "width" || key === "height" || config[key] instanceof Object) {
                continue;
            }

            const wrapper = document.createElement("div");
            wrapper.className = "property";
            const label = document.createElement("div");
            label.className = "property__name";
            label.textContent = key;
            wrapper.appendChild(label);

            const input = hints[key]
                ? document.createElement("select")
                : document.createElement("input");
            input.id = key;
            input.value = config[key];
            inputs.push(input);

            if (hints[key]) {
                for (const hint of hints[key]) {
                    const option = document.createElement("option");
                    option.value = hint;
                    option.textContent = hint;
                    option.selected = config[key] === hint;
                    input.appendChild(option);
                }
                wrapper.appendChild(input);
            } else {
                wrapper.appendChild(input);
            }

            configurator.appendChild(wrapper);
        }

        this.inputs = inputs;

        const buttonsBlock = document.createElement("div");
        buttonsBlock.className = "buttons";

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
            config[input.id] = +input.value || input.value;
        }

        return config;
    }

}