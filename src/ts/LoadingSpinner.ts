import { HasHtmlElement, CssAnimation, CssAnimationEvent, ComponentService } from "./Exporter";

export class LoadingSpinner implements HasHtmlElement {
    private readonly COMPONENT_ID = "loadingspinner-component";
    private readonly parentElem: HTMLElement;
    public elem!: HTMLElement;
    private cssAnimation?: CssAnimation;

    constructor(parentElem: HTMLElement) {
        this.parentElem = parentElem;
    }

    public static create(parentElemID: string): LoadingSpinner {
        const instance = new LoadingSpinner(document.getElementById(parentElemID)!);
        return instance;
    }

    public async render(): Promise<void> {
        await ComponentService.instance.loadView(this.COMPONENT_ID, this.parentElem);
        this.elem = document.getElementById(this.COMPONENT_ID) as HTMLElement;
        this.cssAnimation = new CssAnimation(this.elem);
    }

    public dispose(): void {
        ComponentService.instance.removeView(this.elem);
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