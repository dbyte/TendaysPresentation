import { Button, App } from "./Exporter";

export class HomeButton extends Button {
    constructor(parentElem: HTMLElement) {
        super("home-button-component", "assets/reload-button.svg", parentElem);
    }

    public static create(parentElemID: string): HomeButton {
        const instance = new HomeButton(document.getElementById(parentElemID)!);
        return instance;
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                App.instance.controller?.goHome();
                break;
        }
        e.stopPropagation();
    }
}