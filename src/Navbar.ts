import { HasHtmlElement, CssAnimation, CssAnimationEvent } from "./Exporter";

export class Navbar implements HasHtmlElement {
    public elem: HTMLElement;
    private cssAnimation: CssAnimation;

    constructor() {
        this.elem = document.getElementById("navbar") as HTMLElement;
        this.cssAnimation = new CssAnimation(this.elem);
    }

    public toggle() {
        this.elem.hidden ? this.show() : this.hide();
    }

    public show() {
        if (this.elem.hidden) {
            this.elem.addEventListener("animationend", () => { this.cssAnimation.removeAll() }, { once: true });
            this.elem.hidden = false;
            this.cssAnimation.start(CssAnimationEvent.FadeIn);
        }
    }

    public hide() {
        if (!this.elem.hidden) {
            this.elem.addEventListener("animationend", () => { this.onHideAnimationEnd() }, { once: true });
            this.cssAnimation.start(CssAnimationEvent.FadeOut);
        }
    }
    private onHideAnimationEnd(): void {
        this.elem.hidden = true;
        this.cssAnimation.removeAll();
    }
}