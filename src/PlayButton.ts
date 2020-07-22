import { CssAnimation, CssAnimationEvent, HasHtmlElement, App } from "./Exporter.js";

export class PlayButton implements HasHtmlElement {
    private readonly elemID: string;
    public readonly elem: HTMLVideoElement;
    private readonly pathToVideo: string;
    private readonly buttonImageSource: string;
    private cssAnimation: CssAnimation;
    private animationEndMethod?: any;

    constructor(elemID: string, pathToVideo: string) {
        this.elemID = elemID;
        this.elem = document.getElementById(this.elemID) as HTMLVideoElement;
        this.pathToVideo = pathToVideo;
        this.buttonImageSource = "assets/play-button-grey.svg";
        this.cssAnimation = new CssAnimation(this.elem);
        this.animationEndMethod = undefined;

        this.addEventListeners();
    }

    public initView(): void {
        this.elem.src = this.buttonImageSource;
        this.elem.classList.add("button-player");

        /* Overlay elements should have the 'hidden' selector in their HTML
        as they may have wrong positions/sizes when entering the page.
        As soon as the page got loaded and we've rearranged things, we can
        switch them on. */
        this.elem.hidden = false;
    }

    private addEventListeners(): void {
        const events = ["load", "click", "mouseover", "mouseout"];
        events.map(e => { this.elem.addEventListener(e, this) });
    }

    private removeEventListeners(): void {
        const events = ["load", "click", "mouseover", "mouseout"];
        events.map(e => { this.elem.removeEventListener(e, this) });
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "load":
                this.animateOnLoad();
                break;
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

    private animateOnLoad(): void {
        console.log('load event called');
        this.elem.addEventListener("animationend", this.animationEndMethod = this.onLoadAnimationEnd.bind(this));
        this.cssAnimation.start(CssAnimationEvent.OnDocumentLoaded);
    }
    private onLoadAnimationEnd(e: Event): void {
        console.log('onAnimationEnd called');
        this.cssAnimation.removeAll();
        this.elem.removeEventListener("animationend", this.animationEndMethod);
    }

    private animateOnMouseover(): void {
        console.log('mouseover event called');
        this.elem.addEventListener("animationend", this.animationEndMethod = this.onMouseoverAnimationEnd.bind(this));
        this.cssAnimation.start(CssAnimationEvent.OnMouseOver);
    }
    private onMouseoverAnimationEnd(e: Event): void {
        console.log('onMouseoverAnimationEnd called');
        this.elem.removeEventListener("animationend", this.animationEndMethod);
    }

    private animateOnMouseout(): void {
        console.log('mouseout event called');
        this.elem.addEventListener("animationend", this.animationEndMethod = this.onMouseoutAnimationEnd.bind(this));
        this.cssAnimation.start(CssAnimationEvent.OnMouseOut);
    }
    private onMouseoutAnimationEnd(e: Event): void {
        console.log('onMouseoutAnimationEnd called');
        this.elem.removeEventListener("animationend", this.animationEndMethod);
    }

    public animateOnClick(): void {
        this.removeEventListeners();
        this.elem.addEventListener("animationend", this.animationEndMethod = this.onClickAnimationEnd.bind(this));
        this.cssAnimation.start(CssAnimationEvent.OnClick)
    }
    private onClickAnimationEnd(e: Event): void {
        console.log('onClickAnimationEnd called');
        this.elem.classList.add('invisible');
        this.elem.removeEventListener("animationend", this.animationEndMethod);
    }
}