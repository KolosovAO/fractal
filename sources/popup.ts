export class Popup {
    public container: HTMLElement;

    public onRefresh;
    public onStop;
    public onDestroy;
    public onStart;
    public onNext;

    private control: HTMLElement;

    constructor(container?: HTMLElement) {
        this.container = container;

        const control = document.createElement("div");
        control.className = "control";

        control.innerHTML = `
            <div id="refresh">refresh</div>
            <div id="stop">stop</div>
            <div id="start">start</div>
            <div id="destroy">destroy</div>
            <div id="next">next fractal</div>
        `.trim();

        control.onclick = e => {
            const id = (e.target as HTMLElement).id;

            switch(id) {
                case "refresh":
                    this.onRefresh();
                    break;
                case "stop":
                    this.onStop();
                    break;
                case "start":
                    this.onStart();
                    break;
                case "destroy":
                    this.onDestroy();
                    break;
                case "next":
                    this.onNext();
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