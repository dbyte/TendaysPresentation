import {
    VideoModel, PlayButton, FullscreenButton, HomeButton, OverlayHandler, HasHtmlElement, getElementsOfObjects,
    LoadingSpinner, InfoButton} from "./Exporter";

export class PlayerController {
    private static readonly DEFAULT_VIDEOSOURCE = "animation-01";
    private readonly video: HTMLVideoElement;
    private readonly playButtons: PlayButton[];
    private readonly fullscreenButton: FullscreenButton;
    private readonly homeButton: HomeButton;
    private readonly infoButton01: InfoButton;
    private readonly loadingSpinner: LoadingSpinner;
    private readonly overlayHandler: OverlayHandler;

    constructor() {
        this.video = document.getElementById("mainVideoTarget") as HTMLVideoElement;
        this.playButtons = [];
        this.playButtons.push(new PlayButton("playVideo01", PlayerController.DEFAULT_VIDEOSOURCE));
        this.playButtons.push(new PlayButton("playVideo02", "animation-02"));
        this.playButtons.push(new PlayButton("playVideo03", "animation-03"));
        this.fullscreenButton = new FullscreenButton();
        this.homeButton = new HomeButton();
        this.infoButton01 = new InfoButton();
        this.loadingSpinner = new LoadingSpinner();
        this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());
    }

    public initView(): void {
        this.switchVideoSource(PlayerController.DEFAULT_VIDEOSOURCE);
        this.playButtons.forEach(button => { button.initView() });
        this.fullscreenButton.initView();
        this.homeButton.initView();
        this.overlayHandler.repositionOnVideo(this.video);

        window.addEventListener("resize", () => { this.overlayHandler.repositionOnVideo(this.video) });
        this.video.addEventListener("ended", () => { this.onVideoEnded() });
        
        // Hide address bar on mobiles, https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
        window.scrollTo(0, 1);
    }

    private getAllOverlayElements(): HTMLElement[] {
        let overlays: HasHtmlElement[] = [...this.playButtons]; // we need a value copy of playButtons
        overlays.push(this.fullscreenButton, this.homeButton, this.infoButton01);
        return getElementsOfObjects(overlays);
    }

    public startVideo(videoBaseFilename: string): void {
        this.switchVideoSource(videoBaseFilename);
        this.playButtons.forEach(btn => { btn.animateOnClick(); });
        this.loadingSpinner.show();
        this.video.play().then(() => this.loadingSpinner.hide());
    }

    private onVideoEnded(): void {
        console.log("onVideoEnded called");
        this.infoButton01.initView();
    }

    private switchVideoSource(videoBaseFilename: string): void {
        const videoModel = new VideoModel(videoBaseFilename);
        const relativePath = videoModel.getRelativePath();
        const absolutePathToNewSource = new URL(relativePath, document.baseURI).href;

        /* Only switch source if not yet set (which will reduce
        flicker when user wants to play same video as previous time) */
        if (this.video.src !== absolutePathToNewSource) {
            this.video.src = relativePath;
            console.log("Video source is now ".concat(relativePath));
        }
    }

    public goHome() {
        this.video.pause();
        this.video.currentTime = 0;

        this.playButtons.forEach(button => { button.initView() });
        this.fullscreenButton.initView();
        this.homeButton.initView();
        this.infoButton01.elem.hidden = true;
    }
}