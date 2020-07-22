import { Button, App } from "./Exporter";

export class HomeButton extends Button {
    constructor() {
        super("goHome", "assets/reload-button.svg");
    }

    public initView(): void {
        const imageElem = this.elem as HTMLImageElement;
        imageElem.src = this.buttonImageSource;
        this.elem.classList.add("player-navigation");

        /* Overlay elements should have the 'hidden' selector in their HTML
        as they may have wrong positions/sizes when entering the page.
        As soon as the page got loaded and we've rearranged things, we can
        switch them on. */
        this.elem.hidden = false;
    }

    protected addEventListeners(): void {
        const events = ["click"];
        events.map(e => { this.elem.addEventListener(e, this) });
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                console.log('click event called');
                App.instance.controller?.goHome();
                break;
        }
    }
}