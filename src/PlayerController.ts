import { PlayButton, FullscreenButton, OverlayHandler, HasHtmlElement, getElementsOfObjects } from "./Exporter.js";

export class PlayerController {
    private readonly playButtons: PlayButton[];
    private readonly fullscreenButton: FullscreenButton;
    private readonly video: HTMLVideoElement;
    private readonly homeScreenPosterFake: HTMLVideoElement;
    private readonly overlayHandler: OverlayHandler;

    constructor() {
        this.playButtons = [];
        this.playButtons.push(new PlayButton("playVideo01", "../assets/animation-01.mp4"));
        this.playButtons.push(new PlayButton("playVideo02", "../assets/animation-01.mp4"));
        this.fullscreenButton = new FullscreenButton();
        this.video = document.getElementById("mainVideoTarget") as HTMLVideoElement;
        this.homeScreenPosterFake = document.getElementById("homeScreenPosterFake") as HTMLVideoElement;

        this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());
        this.initView();
    }

    private getAllOverlayElements(): HTMLElement[] {
        let overlays: HasHtmlElement[] = [...this.playButtons]; // we need a value copy of playButtons
        overlays.push(this.fullscreenButton);
        return getElementsOfObjects(overlays);
    }

    private initView(): void {
        this.playButtons.forEach(button => { button.initView() });
        this.fullscreenButton.initView();
        this.overlayHandler.repositionOnVideo(this.video);
        
        window.addEventListener("resize", () => { this.overlayHandler.repositionOnVideo(this.video) });
    }

    public startVideo(pathToSource: string): void {
        this.playButtons.forEach(btn => { btn.animateOnClick(); });

        this.video.src = pathToSource;
        this.homeScreenPosterFake.hidden = true;
        this.video.hidden = false;
        this.video.play();
    }
}