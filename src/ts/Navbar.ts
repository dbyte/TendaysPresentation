import { HasHtmlElement, CssAnimation, CssAnimationEvent, FullscreenButton,
    HomeButton, ComponentService } from "./Exporter";

export class Navbar implements HasHtmlElement {
    private readonly COMPONENT_ID = "main-navigation-component";
    private readonly parentElem: HTMLElement;

    public elem!: HTMLElement;
    private fullscreenButton!: FullscreenButton;
    private homeButton!: HomeButton;
    private cssAnimation?: CssAnimation;

    constructor(parentElem: HTMLElement) {
        this.parentElem = parentElem;
        // this.fullscreenButton = FullscreenButton.create();
        // this.homeButton = HomeButton.create();
    }

    public static create(parentElemID: string): Navbar {
        const instance = new Navbar(document.getElementById(parentElemID)!);
        return instance;
    }

    public async render(): Promise<void> {
        // Set up my own component first!
        await ComponentService.instance.loadView(this.COMPONENT_ID, this.parentElem);
        this.elem = document.getElementById(this.COMPONENT_ID) as HTMLElement
        this.elem.hidden = true
        this.cssAnimation = new CssAnimation(this.elem);
        
        // Now my children (their order matters for horiz. alignment, so no Promise.all!)
        this.fullscreenButton = FullscreenButton.create(this.COMPONENT_ID);
        this.homeButton = HomeButton.create(this.COMPONENT_ID);
        await this.fullscreenButton.render("fullscreen-button-component");
        await this.homeButton.render("home-button-component");
    }

    public dispose(): void {
        ComponentService.instance.removeView(this.elem);
        this.fullscreenButton.dispose();
        this.homeButton.dispose();
    }

    public toggleShowHide(): void {
        this.elem.hidden ? this.show() : this.hide();
    }

    public show(): void {
        if (this.elem.hidden) {
            this.elem.addEventListener("animationend", () => { this.cssAnimation?.removeAll() }, { once: true });
            this.elem.hidden = false;
            this.cssAnimation?.start(CssAnimationEvent.FadeIn);
            this.fullscreenButton.show();
            this.homeButton.show();
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