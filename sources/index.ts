import { Application } from "./app";

document.addEventListener("DOMContentLoaded", () => {
    const canvas: HTMLCanvasElement = document.querySelector("#app");

    new Application(canvas);
});
