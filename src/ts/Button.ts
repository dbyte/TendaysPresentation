import { Component } from "./Exporter";

export abstract class Button extends Component<Button> {
    protected buttonImageSource: string;

    constructor(componentId: string, buttonImageSource: string, parentElemId: string) {
        super(componentId, parentElemId)
        this.buttonImageSource = buttonImageSource;
    }

    public async render(skipLoading?: "skipLoading"): Promise<void> {
        await super.render(skipLoading);
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

    public hide() {
        this.elem.hidden = true;
    }

    public dispose(): void {
        this.removeEventListeners();
        super.dispose();
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