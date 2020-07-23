import { HasHtmlElement, CssAnimation, CssAnimationEvent } from "./Exporter";

export class LoadingSpinner implements HasHtmlElement {
    public readonly elem: HTMLElement;
    private readonly cssAnimation: CssAnimation;

    constructor() {
        this.elem = document.getElementById("loadingSpinner") as HTMLElement;
        this.cssAnimation = new CssAnimation(this.elem);
    }

    public show() {
        this.elem.hidden = false;
        this.cssAnimation.start(CssAnimationEvent.ScaleIn);
    }

    public hide() {
        this.cssAnimation.start(CssAnimationEvent.OnClick);
        this.elem.addEventListener(
            "animationend",
            () => { this.elem.hidden = true; },
            { once: true });
    }
}