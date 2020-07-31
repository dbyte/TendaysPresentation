import { Button, App } from "./Exporter";

export class HomeButton extends Button {
    constructor(parentElemID: string) {
        super("home-button-component", "assets/reload-button.svg", parentElemID);
    }

    public static create(parentElemID: string): HomeButton {
        const instance = new HomeButton(parentElemID);
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