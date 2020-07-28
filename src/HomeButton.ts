import { Button, App } from "./Exporter";

export class HomeButton extends Button {
    constructor() {
        super("goHome", "assets/reload-button.svg");
    }

    public show(): void {
        super.show();
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