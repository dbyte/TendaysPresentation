import { HasHtmlElement } from "./Exporter";

export class Navbar implements HasHtmlElement {
    public elem: HTMLElement;

    constructor() {
        this.elem = document.getElementById("navbar") as HTMLElement;
    }
}