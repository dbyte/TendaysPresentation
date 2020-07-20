import { Player, CssAnimation, CssAnimationEvent } from "./Exporter.js";

export class PlayButton {
    private readonly elemID: string;
    private readonly pathToVideo: string;
    private readonly buttonImageSource: string;
    private cssAnimation: CssAnimation;
    private readonly player: Player;
    private animationEndMethod?: any;

    constructor(elemID: string, pathToVideo: string) {
        this.elemID = elemID;
        this.pathToVideo = pathToVideo;
        this.buttonImageSource = "assets/play-button-grey.svg";
        this.cssAnimation = new CssAnimation(this.getDomElem());
        this.player = new Player();
        this.animationEndMethod = undefined;

        this.initView();
        this.addEventListeners();
    }

    private initView(): void {
        let elem: HTMLVideoElement = this.getDomElem() as HTMLVideoElement;
        elem.src = this.buttonImageSource;
        elem.classList.add("button-player");
    }

    private getDomElem(): HTMLElement | never {
        const elem = document.getElementById(this.elemID);
        if (elem != null) {
            return elem;
        } else {
            const err = new Error("Could not get DOM element by ID.");
            alert(err.message);
            console.error(err.message);
            throw err;
        }
    }

    private addEventListeners(): void {
        const events = ["load", "click", "mouseover", "mouseout"];
        events.map(e => { this.getDomElem().addEventListener(e, this) });
    }

    private removeEventListeners(): void {
        const events = ["load", "click", "mouseover", "mouseout"];
        events.map(e => { this.getDomElem().removeEventListener(e, this) });
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "load":
                this.animateOnLoad();
                break;
            case "click":
                console.log('click event called');
                this.player.start(this.pathToVideo);
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
        this.getDomElem().addEventListener("animationend", this.animationEndMethod = this.onLoadAnimationEnd.bind(this));
        this.cssAnimation.start(CssAnimationEvent.OnDocumentLoaded);
    }
    private onLoadAnimationEnd(e: Event): void {
        console.log('onAnimationEnd called');
        this.cssAnimation.removeAll();
        this.getDomElem().removeEventListener("animationend", this.animationEndMethod);
    }

    private animateOnMouseover(): void {
        console.log('mouseover event called');
        this.getDomElem().addEventListener("animationend", this.animationEndMethod = this.onMouseoverAnimationEnd.bind(this));
        this.cssAnimation.start(CssAnimationEvent.OnMouseOver);
    }
    private onMouseoverAnimationEnd(e: Event): void {
        console.log('onMouseoverAnimationEnd called');
        this.getDomElem().removeEventListener("animationend", this.animationEndMethod);
    }

    private animateOnMouseout(): void {
        console.log('mouseout event called');
        this.getDomElem().addEventListener("animationend", this.animationEndMethod = this.onMouseoutAnimationEnd.bind(this));
        this.cssAnimation.start(CssAnimationEvent.OnMouseOut);
    }
    private onMouseoutAnimationEnd(e: Event): void {
        console.log('onMouseoutAnimationEnd called');
        this.getDomElem().removeEventListener("animationend", this.animationEndMethod);
    }

    public animateOnClick(): void {
        this.removeEventListeners();
        this.getDomElem().addEventListener("animationend", this.animationEndMethod = this.onClickAnimationEnd.bind(this));
        this.cssAnimation.start(CssAnimationEvent.OnClick)
    }
    private onClickAnimationEnd(e: Event): void {
        console.log('onClickAnimationEnd called');
        const elem = this.getDomElem();
        elem.classList.add('invisible');
        elem.removeEventListener("animationend", this.animationEndMethod);
    }
}