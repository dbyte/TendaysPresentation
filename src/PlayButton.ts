import { Button, CssAnimation, CssAnimationEvent, App } from "./Exporter";

export class PlayButton extends Button {
    private readonly pathToVideo: string;
    private cssAnimation: CssAnimation;

    constructor(elemID: string, pathToVideo: string) {
        super(elemID, "assets/play-button-grey.svg");
        this.pathToVideo = pathToVideo;
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
                console.log('click event called');
                App.instance.controller?.startVideo(this.pathToVideo);
                break;
            case "mouseover":
                this.animateOnMouseover();
                break;
            case "mouseout":
                this.animateOnMouseout();
                break;
        }
    }

    private animateIn(): void {
        console.log('animateIn event called');
        this.elem.addEventListener("animationend", () => { this.onInAnimationEnd() }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.ScaleIn);
    }
    private onInAnimationEnd(): void {
        console.log('onInAnimationEnd called');
        this.cssAnimation.removeAll();
    }

    private animateOnMouseover(): void {
        console.log('mouseover event called');
        this.elem.addEventListener("animationend", () => { this.onMouseoverAnimationEnd() }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.OnMouseOver);
    }
    private onMouseoverAnimationEnd(): void {
        console.log('onMouseoverAnimationEnd called');
    }

    private animateOnMouseout(): void {
        console.log('mouseout event called');
        this.elem.addEventListener("animationend", () => { this.onMouseoutAnimationEnd() }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.OnMouseOut);
    }
    private onMouseoutAnimationEnd(): void {
        console.log('onMouseoutAnimationEnd called');
    }

    public animateOnClick(): void {
        this.removeEventListeners();
        this.elem.addEventListener("animationend", () => { this.onClickAnimationEnd() }, { once: true });
        this.cssAnimation.start(CssAnimationEvent.OnClick)
    }
    private onClickAnimationEnd(): void {
        console.log('onClickAnimationEnd called');
        this.elem.hidden = true;
    }
}