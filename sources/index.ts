import { FractalType } from "./types";
import { factory } from "./fractalFactory";

document.addEventListener("DOMContentLoaded", () => {
    const canvas: any = document.querySelector("#app");

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    const type = FractalType.x;

    factory(type)(ctx, {width, height});
});
