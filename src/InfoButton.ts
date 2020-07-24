import { Button, CssAnimation, CssAnimationEvent } from "./Exporter";

export class InfoButton extends Button {
    private cssAnimation: CssAnimation;

    constructor() {
        super("infoButton01", "assets/info-button.png");
        this.cssAnimation = new CssAnimation(this.elem);
    }

    public initView(): void {
        super.initView();
        this.elem.classList.add("button-info");
        this.animateIn();
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                console.log('click event called');
                //ToDo
                break;
        }
        e.stopPropagation();
    }

    private animateIn(): void {
        console.log('animateIn event called');
        this.elem.addEventListener("animationend", (event) => { this.onInAnimationEnd(event) }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.ScaleIn);
    }
    private onInAnimationEnd(event: AnimationEvent): void {
        console.log('onInAnimationEnd called');
        this.cssAnimation.removeAll();
        event.stopPropagation();
    }
}