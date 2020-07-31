import { HasHtmlElement, ComponentService } from "./Exporter";

export abstract class Button implements HasHtmlElement {
    protected elemID: string;
    public elem!: HTMLElement;
    protected buttonImageSource: string;

    constructor(elemID: string, buttonImageSource: string) {
        this.elemID = elemID;
        this.buttonImageSource = buttonImageSource;
    }

    public async render(viewName?: string): Promise<void> {
        if (viewName) await ComponentService.instance.loadView(viewName);
        this.elem = document.getElementById(this.elemID) as HTMLElement;
        this.elem.hidden = true;
        const imageElem = this.elem as HTMLImageElement;
        imageElem.src = this.buttonImageSource;
    }

    public show(): void {
        /* Overlay elements should initially have the 'hidden' selector in their
        HTML as they may have wrong positions/sizes when entering the page.
        As soon as the page got loaded and we've rearranged things, we can
        switch them on. */
        this.elem.hidden = false;
        this.removeEventListeners();
        this.addEventListeners();
    }

    public dispose(): void {
        this.removeEventListeners();
    }

    protected addEventListeners(): void {
        const events = ["click", "mouseover", "mouseout"];
        events.map(e => { this.elem.addEventListener(e, this) });
    }

    protected removeEventListeners(): void {
        const events = ["click", "mouseover", "mouseout"];
        events.map(e => { this.elem.removeEventListener(e, this) });
    }

    public abstract handleEvent(e: Event): void;
}