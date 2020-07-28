import {
    SceneLoader, Video, PlayButton, FullscreenButton, HomeButton, Navbar, OverlayHandler,
    HasHtmlElement, getElementsOfObjects, LoadingSpinner, InfoButton
} from "./Exporter";

export class PlayerController {
    private static readonly DEFAULT_VIDEOSOURCE = "animation-01";
    private video!: Video;
    private playButtons!: PlayButton[];
    private fullscreenButton!: FullscreenButton;
    private homeButton!: HomeButton;
    private infoButton01!: InfoButton;
    private loadingSpinner!: LoadingSpinner;
    private navbar!: Navbar;
    private overlayHandler!: OverlayHandler;

    constructor() { }

    public async bindView() {
        this.video = new Video(PlayerController.DEFAULT_VIDEOSOURCE);
        await Promise.all([
            this.bindPlayButtonViews(), 
            this.bindNavbarView(),
            this.bindSpinnerView()
        ]);
        this.infoButton01 = new InfoButton();
        this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());
    }

    private async bindPlayButtonViews() {
        await new SceneLoader().load("hotspots-scene-01");
        this.playButtons = [];
        this.playButtons.push(new PlayButton("playVideo01", PlayerController.DEFAULT_VIDEOSOURCE));
        this.playButtons.push(new PlayButton("playVideo02", "animation-02"));
        this.playButtons.push(new PlayButton("playVideo03", "animation-03"));
    }

    private async bindNavbarView() {
        await new SceneLoader().load("main-navigation");
        this.navbar = new Navbar();
        this.fullscreenButton = new FullscreenButton();
        this.homeButton = new HomeButton();
    }

    private async bindSpinnerView() {
        await new SceneLoader().load("loading-spinner");
        this.loadingSpinner = new LoadingSpinner();
    }

    public show(): void {
        // Hide address bar on mobiles, https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
        //window.scrollTo(0, 1);

        this.playButtons.forEach(button => { button.show() });
        this.fullscreenButton.show();
        this.homeButton.show();
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
        this.loadingSpinner.show();
        this.playButtons.forEach(btn => { btn.hide() });
        this.video.elem.play().then(() => {
            this.loadingSpinner.hide();
            this.navbar.hide();
        });
    }

    private onVideoEnded(): void {
        console.log("onVideoEnded called");
        this.navbar.show();
        this.infoButton01.show();
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
        this.playButtons.forEach(button => { button.show() });
        this.fullscreenButton.show();
        this.homeButton.show();
        this.infoButton01.elem.hidden = true;
    }
}