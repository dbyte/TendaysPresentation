import { Button } from "./Exporter";

export class InfoButton extends Button {
    constructor() {
        super("infoButton01", "assets/info-button.svg");
    }

    public initView(): void {
        super.initView();
        this.elem.classList.add("player-navigation");
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                console.log('click event called');
                //ToDo
                break;
        }
    }
}