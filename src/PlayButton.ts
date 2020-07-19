import { Player } from "./Exporter.js";

export class PlayButton {
    private readonly elemID: string;
    private readonly pathToVideo: string;
    private readonly buttonImageSource: string
    private readonly player: Player;
    private animationEndMethod?: any;

    constructor(elemID: string, pathToVideo: string) {
        this.elemID = elemID;
        this.pathToVideo = pathToVideo;
        this.buttonImageSource = "assets/play-button-grey.svg";
        this.player = new Player();
        this.animationEndMethod = undefined;
        this.initDom();
        this.addEventListeners();
    }

    public static get DomClassRegistry(): any {
        const dflt: string[] = ["button-player"];
        return {
            DEFAULT: dflt,
            ON_LOAD: dflt.concat(["onLoadAnimate"]),
            ON_MOUSEOVER: dflt.concat(["onMouseoverAnimate"]),
            ON_MOUSEOUT: dflt.concat(["onMouseoutAnimate"]),
            ON_CLICK: dflt.concat(["onClickAnimate"])
        };
    }

    private initDom(): void {
        let elem: HTMLVideoElement = this.getDomElem() as HTMLVideoElement;
        elem.src = this.buttonImageSource;
    }

    private addEventListeners(): void {
        const events = ["load", "click", "mouseover", "mouseout"];
        events.map(e => { return this.getDomElem()?.addEventListener(e, this) });
    }

    private removeEventListeners(): void {
        const events = ["load", "click", "mouseover", "mouseout"];
        events.map(e => { return this.getDomElem()?.removeEventListener(e, this) });
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "load":
                console.log('load event called');
                this.animateOnLoad();
                break;
            case "click":
                console.log('click event called');
                this.player.start(this.pathToVideo);
                break;
            case "mouseover":
                console.log('mouseover event called');
                this.animateOnMouseover();
                break;
            case "mouseout":
                console.log('mouseout event called');
                this.animateOnMouseout();
                break;
        }
    }

    private getDomElem(): HTMLElement | null {
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

    private setDomClass(classes: string[]): void {
        let elem = this.getDomElem();
        elem?.removeAttribute("class");
        elem?.classList.add(...classes);
    }

    private animateOnLoad(): void {
        this.getDomElem()?.addEventListener("animationend", this.animationEndMethod = this.onLoadAnimationEnd.bind(this));
        this.setDomClass(PlayButton.DomClassRegistry.ON_LOAD);
    }
    private onLoadAnimationEnd(e: Event): void {
        console.log('onAnimationEnd called');
        this.setDomClass(PlayButton.DomClassRegistry.DEFAULT);
        this.getDomElem()?.removeEventListener("animationend", this.animationEndMethod);
    }

    private animateOnMouseover(): void {
        this.getDomElem()?.addEventListener("animationend", this.animationEndMethod = this.onMouseoverAnimationEnd.bind(this));
        this.setDomClass(PlayButton.DomClassRegistry.ON_MOUSEOVER);
    }
    private onMouseoverAnimationEnd(e: Event): void {
        console.log('onMouseoverAnimationEnd called');
        this.getDomElem()?.removeEventListener("animationend", this.animationEndMethod);
    }

    private animateOnMouseout(): void {
        this.getDomElem()?.addEventListener("animationend", this.animationEndMethod = this.onMouseoutAnimationEnd.bind(this));
        this.setDomClass(PlayButton.DomClassRegistry.ON_MOUSEOUT);
    }
    private onMouseoutAnimationEnd(e: Event): void {
        console.log('onMouseoutAnimationEnd called');
        this.getDomElem()?.removeEventListener("animationend", this.animationEndMethod);
    }

    public animateOnClick(): void {
        this.removeEventListeners();
        this.getDomElem()?.addEventListener("animationend", this.animationEndMethod = this.onClickAnimationEnd.bind(this));
        this.setDomClass(PlayButton.DomClassRegistry.ON_CLICK);
    }
    private onClickAnimationEnd(e: Event): void {
        console.log('onClickAnimationEnd called');
        const elem = this.getDomElem();
        elem?.classList.add('invisible');
        elem?.removeEventListener("animationend", this.animationEndMethod);
    }
}