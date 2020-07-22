import { HasHtmlElement } from "./Exporter";

export abstract class Button implements HasHtmlElement {
    protected elemID: string;
    public elem: HTMLElement;
    protected buttonImageSource: string;

    constructor(elemID: string, buttonImageSource: string) {
        this.elemID = elemID;
        this.buttonImageSource = buttonImageSource;
        this.elem = document.getElementById(this.elemID) as HTMLElement;

        this.addEventListeners();
    }

    protected abstract addEventListeners(): void;
    public abstract handleEvent(e: Event): void;
    public abstract initView(): void;
}