import { HasHtmlElement } from "./Exporter";
import { CssAnimationEvent } from "./Utilities";

export class Navbar implements HasHtmlElement {
    public elem: HTMLElement;

    constructor() {
        this.elem = document.getElementById("navbar") as HTMLElement;
    }

    public hide() {
        this.elem.classList.add(CssAnimationEvent.ScaleOut);
    }
}