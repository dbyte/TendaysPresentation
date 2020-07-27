import { Button, CssAnimation, CssAnimationEvent, App } from "./Exporter";

export class PlayButton extends Button {
    private readonly videoFileBasename: string;
    private cssAnimation: CssAnimation;

    constructor(elemID: string, pathToVideo: string) {
        super(elemID, "assets/play-button-grey.svg");
        this.videoFileBasename = pathToVideo;
        this.cssAnimation = new CssAnimation(this.elem);
    }

    public initView(): void {
        super.initView();

        this.elem.classList.add("button-player");
        this.animateIn();
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                App.instance.controller?.startVideo(this.videoFileBasename);
                break;
            case "mouseover":
                this.animateOnMouseover();
                break;
            case "mouseout":
                this.animateOnMouseout();
                break;
        }
        e.stopPropagation();
    }

    private animateIn(): void {
        this.elem.addEventListener("animationend", () => { this.onInAnimationEnd() }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.ScaleIn);
    }
    private onInAnimationEnd(): void {
        this.cssAnimation.removeAll();
    }

    private animateOnMouseover(): void {
        this.elem.addEventListener("animationend", () => { this.onMouseoverAnimationEnd() }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.OnMouseOver);
    }
    private onMouseoverAnimationEnd(): void {
        // TODO
    }

    private animateOnMouseout(): void {
        this.elem.addEventListener("animationend", () => { this.onMouseoutAnimationEnd() }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.OnMouseOut);
    }
    private onMouseoutAnimationEnd(): void {
        // TODO
    }

    public animateOnClick(): void {
        this.removeEventListeners();
        this.elem.addEventListener("animationend", () => { this.onClickAnimationEnd() }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.ScaleOut)
    }
    private onClickAnimationEnd(): void {
        this.elem.hidden = true;
    }
}