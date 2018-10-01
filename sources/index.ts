import { FractalType } from "./types";
import { factory } from "./fractalFactory";
import {Popup} from "./popup";

let fractal;

document.addEventListener("DOMContentLoaded", () => {
    const canvas: any = document.querySelector("#app");

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    let index = 0;

    const fractals = Object.keys(FractalType).map(type => factory(FractalType[type] as any, ctx, {width, height}));

    const popup = new Popup(document.body);

    fractal = fractals[0];
    fractal.start();

    popup.onDestroy = () => fractal.destroy();
    popup.onRefresh = () => fractal.refresh();
    popup.onStart = () => fractal.start();
    popup.onStop = () => fractal.stop();
    popup.onNext = () => {
        index++;
        fractal.destroy();
        fractal = fractals[index % fractals.length];
        fractal.start();
    };
    
    canvas.addEventListener("click", () => {
        popup.show();
    });

});
