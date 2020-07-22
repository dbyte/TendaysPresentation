import { PlayButton, FullscreenButton, HomeButton, OverlayHandler, HasHtmlElement, getElementsOfObjects } from "./Exporter";

export class PlayerController {
    private readonly video: HTMLVideoElement;
    private readonly playButtons: PlayButton[];
    private readonly fullscreenButton: FullscreenButton;
    private readonly homeButton: HomeButton;
    private readonly overlayHandler: OverlayHandler;

    constructor() {
        this.video = document.getElementById("mainVideoTarget") as HTMLVideoElement;
        this.playButtons = [];
        this.playButtons.push(new PlayButton("playVideo01", "../assets/animation-01.mp4"));
        this.playButtons.push(new PlayButton("playVideo02", "../assets/animation-02.mp4"));
        this.playButtons.push(new PlayButton("playVideo03", "../assets/animation-03.mp4"));
        this.fullscreenButton = new FullscreenButton();
        this.homeButton = new HomeButton();

        this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());
    }

    public initView(): void {
        this.playButtons.forEach(button => { button.initView() });
        this.fullscreenButton.initView();
        this.homeButton.initView();
        this.overlayHandler.repositionOnVideo(this.video);

        window.addEventListener("resize", () => { this.overlayHandler.repositionOnVideo(this.video) });
    }

    private getAllOverlayElements(): HTMLElement[] {
        let overlays: HasHtmlElement[] = [...this.playButtons]; // we need a value copy of playButtons
        overlays.push(this.fullscreenButton, this.homeButton);
        return getElementsOfObjects(overlays);
    }

    public startVideo(relativePathToSource: string): void {
        this.switchVideoSource(relativePathToSource);
        this.playButtons.forEach(btn => { btn.animateOnClick(); });
        this.video.play();
    }

    public goHome() {
        this.video.pause();
        this.video.currentTime = 0;

        // ----> TODO encapsulate this block.
        // TODO switch button events on/off in THIS class, not in the Button itself
        this.playButtons.forEach(button => { button.removeEventListeners() });
        this.playButtons.forEach(button => { button.addEventListeners() });

        this.playButtons.forEach(button => { button.initView() });
        this.fullscreenButton.initView();
        this.homeButton.initView();
        // <----
    }

    private switchVideoSource(relativePathToNewSource: string): void {
        const absolutePathToNewSource = new URL(relativePathToNewSource, document.baseURI).href;

        /* Only switch source if not yet set (which will reduce
        flicker when user wants to play same video as previous time) */
        if (this.video.src !== absolutePathToNewSource) {
            this.video.src = relativePathToNewSource;
        }
    }
}