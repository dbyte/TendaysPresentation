import { Button, App } from "./Exporter";

export class HomeButton extends Button {
    constructor() {
        super("goHome", "assets/reload-button.svg");
    }

    public static create(): HomeButton {
        const instance = new HomeButton();
        return instance;
    }

    // public async render(): Promise<void> {
    //     await super.render("home-button");
    // }

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