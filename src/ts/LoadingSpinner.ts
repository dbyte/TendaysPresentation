import { HasHtmlElement, CssAnimation, CssAnimationEvent, ComponentService } from "./Exporter";

export class LoadingSpinner implements HasHtmlElement {
    public elem!: HTMLElement;
    private cssAnimation?: CssAnimation;

    constructor() { }

    public static create(): LoadingSpinner {
        const instance = new LoadingSpinner();
        return instance;
    }

    public async render(): Promise<void> {
        await new ComponentService().loadView("loading-spinner");
        this.elem = document.getElementById("loadingSpinner") as HTMLElement;
        this.cssAnimation = new CssAnimation(this.elem);
    }

    public dispose(): void {
        new ComponentService().removeView("loading-spinner");
    }

    public show(): void {
        this.elem.hidden = false;
        this.cssAnimation?.start(CssAnimationEvent.ScaleIn);
    }

    public hide(): void {
        this.cssAnimation?.start(CssAnimationEvent.ScaleOut);
        this.elem.addEventListener(
            "animationend",
            (event) => { this.elem.hidden = true; event.stopPropagation(); },
            { once: true });
    }
}