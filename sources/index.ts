import { Application } from "./app";

document.addEventListener("DOMContentLoaded", () => {
    const canvas: any = document.querySelector("#app");

    new Application(canvas);
});
