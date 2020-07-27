import {
    Video, PlayButton, FullscreenButton, HomeButton, Navbar, OverlayHandler, HasHtmlElement,
    getElementsOfObjects, LoadingSpinner, InfoButton} from "./Exporter";

export class PlayerController {
    private static readonly DEFAULT_VIDEOSOURCE = "animation-01";
    private readonly video: Video;
    private readonly playButtons: PlayButton[];
    private readonly fullscreenButton: FullscreenButton;
    private readonly homeButton: HomeButton;
    private readonly infoButton01: InfoButton;
    private readonly loadingSpinner: LoadingSpinner;
    private readonly navbar: Navbar;
    private readonly overlayHandler: OverlayHandler;

    constructor() {
        this.video = new Video(PlayerController.DEFAULT_VIDEOSOURCE);
        this.playButtons = [];
        this.playButtons.push(new PlayButton("playVideo01", PlayerController.DEFAULT_VIDEOSOURCE));
        this.playButtons.push(new PlayButton("playVideo02", "animation-02"));
        this.playButtons.push(new PlayButton("playVideo03", "animation-03"));
        this.fullscreenButton = new FullscreenButton();
        this.homeButton = new HomeButton();
        this.infoButton01 = new InfoButton();
        this.loadingSpinner = new LoadingSpinner();
        this.navbar = new Navbar();
        this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());
    }

    public initView(): void {
        // Hide address bar on mobiles, https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
        //window.scrollTo(0, 1);

        this.playButtons.forEach(button => { button.initView() });
        this.fullscreenButton.initView();
        this.homeButton.initView();
        this.navbar.show();
        this.overlayHandler.repositionOnVideo(this.video.elem);

        window.addEventListener("resize", () => { this.overlayHandler.repositionOnVideo(this.video.elem) });
        this.video.elem.addEventListener("click", (event) => { this.onClickedVideo(event) });
        this.video.elem.addEventListener("ended", () => { this.onVideoEnded() });
    }

    private getAllOverlayElements(): HTMLElement[] {
        let overlays: HasHtmlElement[] = [...this.playButtons]; // we need a value copy of playButtons
        overlays.push(this.infoButton01, this.navbar);
        return getElementsOfObjects(overlays);
    }

    public startVideo(videoBaseFilename: string): void {
        this.video.switchSource(videoBaseFilename);
        this.playButtons.forEach(btn => { btn.animateOnClick(); });
        this.loadingSpinner.show();
        this.video.elem.play().then(() => { 
            this.loadingSpinner.hide();
            this.navbar.hide();
         });
    }

    private onVideoEnded(): void {
        console.log("onVideoEnded called");
        this.navbar.show();
        this.infoButton01.initView();
    }

    private onClickedVideo(event: Event) {
        if (event.type == "click") {
            event.preventDefault();
            this.navbar.toggle();
        }
        event.stopPropagation();
    }

    public goHome() {
        this.video.jumpToStart();
        this.playButtons.forEach(button => { button.initView() });
        this.fullscreenButton.initView();
        this.homeButton.initView();
        this.infoButton01.elem.hidden = true;
    }
}