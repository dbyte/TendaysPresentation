import { Button, CssAnimation, CssAnimationEvent } from "./Exporter";

export class InfoButton extends Button {
    private cssAnimation: CssAnimation;

    constructor() {
        super("infoButton01", "assets/info-button.png");
        this.cssAnimation = new CssAnimation(this.elem);
    }

    public show(): void {
        super.show();
        this.animateIn();
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                //ToDo
                break;
        }
        e.stopPropagation();
    }

    private animateIn(): void {
        this.elem.addEventListener("animationend", (event) => { this.onInAnimationEnd(event) }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.ScaleIn);
    }
    private onInAnimationEnd(event: AnimationEvent): void {
        this.cssAnimation.removeAll();
        event.stopPropagation();
    }
}