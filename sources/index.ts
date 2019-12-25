import { Application } from "./app";
import "./styles/index.scss";

document.addEventListener("DOMContentLoaded", () => {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    document.body.appendChild(canvas);

    new Application(canvas);
});
