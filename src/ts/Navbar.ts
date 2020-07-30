import { HasHtmlElement, CssAnimation, CssAnimationEvent, FullscreenButton, HomeButton, ComponentService } from "./Exporter";

export class Navbar implements HasHtmlElement {
    public elem!: HTMLElement;
    private fullscreenButton!: FullscreenButton;
    private homeButton!: HomeButton;
    private cssAnimation?: CssAnimation;

    constructor() {}

    public static create(): Navbar {
        const instance = new Navbar();
        return instance;
    }

    public async render(): Promise<void> {
        await ComponentService.instance.loadView("main-navigation");
        this.elem = document.getElementById("navbar") as HTMLElement;
        this.fullscreenButton = new FullscreenButton();
        this.homeButton = new HomeButton();
        this.cssAnimation = new CssAnimation(this.elem);
    }

    public dispose(): void {
        ComponentService.instance.removeView("main-navigation");
        this.fullscreenButton?.dispose();
        this.homeButton?.dispose();
    }

    public toggleShowHide(): void {
        this.elem.hidden ? this.show() : this.hide();
    }

    public show(): void {
        if (this.elem.hidden) {
            this.elem.addEventListener("animationend", () => { this.cssAnimation?.removeAll() }, { once: true });
            this.elem.hidden = false;
            this.cssAnimation?.start(CssAnimationEvent.FadeIn);
            this.fullscreenButton?.show();
            this.homeButton?.show();
        }
    }

    public hide(): void {
        if (!this.elem.hidden) {
            this.elem.addEventListener("animationend", () => { this.onHideAnimationEnd() }, { once: true });
            this.cssAnimation?.start(CssAnimationEvent.FadeOut);
        }
    }
    private onHideAnimationEnd(): void {
        this.elem.hidden = true;
        this.cssAnimation?.removeAll();
        this.fullscreenButton.elem.hidden = true;
        this.homeButton.elem.hidden = true;
    }
}