import { FractalType } from "./types";
import { factory } from "./fractalFactory";
import {Popup} from "./popup";
import { Application } from "./app";

document.addEventListener("DOMContentLoaded", () => {
    const canvas: any = document.querySelector("#app");

    const app = new Application(canvas);
});
