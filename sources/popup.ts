export class Popup {
    public container: HTMLElement;

    public onRefresh;
    public onResume;
    public onNext;

    private control: HTMLElement;

    constructor(container?: HTMLElement) {
        this.container = container;

        const control = document.createElement("div");
        control.className = "control";

        control.innerHTML = `
            <div id="resume">resume</div>
            <div id="refresh">refresh</div>
            <div id="next">next fractal</div>
        `.trim();

        control.onclick = e => {
            const id = (e.target as HTMLElement).id;

            switch(id) {
                case "refresh":
                    this.onRefresh();
                    this.hide();
                    break;
                case "resume":
                    this.onResume();
                    this.hide();
                    break;
                case "next":
                    this.onNext();
                    this.hide();
                    break;
            }
        }

        this.control = control;
    }

    show() {
        this.container.appendChild(this.control);
    }

    hide() {
        this.container.removeChild(this.control);
    }
}