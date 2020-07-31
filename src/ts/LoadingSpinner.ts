import { HasHtmlElement, CssAnimation, CssAnimationEvent, ComponentService } from "./Exporter";

export class LoadingSpinner implements HasHtmlElement {
    private readonly COMPONENT_ID = "loadingspinner-component";
    private readonly parentElemId: string;
    public elem!: HTMLElement;
    private cssAnimation?: CssAnimation;

    constructor(parentElemId: string) {
        this.parentElemId = parentElemId;
    }

    public static create(parentElemId: string): LoadingSpinner {
        const instance = new LoadingSpinner(parentElemId);
        return instance;
    }

    public async render(): Promise<void> {
        const parentElem = document.getElementById(this.parentElemId);
        if (!parentElem) new Error(`Unable to find DOM element with id '${this.parentElemId}'`);

        await ComponentService.instance.loadView(this.COMPONENT_ID, parentElem!);
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