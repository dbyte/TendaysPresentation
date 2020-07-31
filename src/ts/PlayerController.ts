import {
    ComponentService, Video, PlayButton, Navbar, OverlayHandler,
    HasHtmlElement, getElementsOfObjects, LoadingSpinner, InfoButton
} from "./Exporter";

export class PlayerController {
    private static readonly COMPONENT_ID = "interactiveContainer";
    private static readonly DEFAULT_VIDEOSOURCE = "animation-01";
    private video!: Video;
    private playButtons: PlayButton[];
    private infoButton01: InfoButton;
    private loadingSpinner: LoadingSpinner;
    private navbar: Navbar;
    private overlayHandler!: OverlayHandler;

    constructor() {
        this.loadingSpinner = LoadingSpinner.create(PlayerController.COMPONENT_ID);
        this.navbar = Navbar.create("interactiveContainer");
        this.playButtons = [];
        this.playButtons.push(PlayButton.create("playVideo01", PlayerController.DEFAULT_VIDEOSOURCE, PlayerController.COMPONENT_ID));
        this.playButtons.push(PlayButton.create("playVideo02", "animation-02", PlayerController.COMPONENT_ID));
        this.playButtons.push(PlayButton.create("playVideo03", "animation-03", PlayerController.COMPONENT_ID));
        this.infoButton01 = new InfoButton(PlayerController.COMPONENT_ID);
    }

    public static create(): PlayerController {
        const instance = new PlayerController();
        return instance;
    }

    public async render(): Promise<void> {
        this.video = new Video(PlayerController.DEFAULT_VIDEOSOURCE);
        await Promise.all([
            await ComponentService.instance.loadView("hotspots-scene-01-component", document.getElementById(PlayerController.COMPONENT_ID)!),
            this.playButtons.forEach(button => { button.render() }),
            this.navbar.render(),
            this.loadingSpinner.render(),
            this.infoButton01.render()
        ]);
        this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());
        
        console.log(this.constructor.name + " rendered and ready to show()." )
    }

    public show(): void {
        this.playButtons.forEach(button => { button.show() });
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

    private onClickedVideo(event: Event): void {
        if (event.type == "click") {
            event.preventDefault();
            this.navbar.toggleShowHide();
        }
        event.stopPropagation();
    }

    public goHome(): void {
        this.video.jumpToStart();
        this.playButtons.forEach(button => { button.show() });
        this.infoButton01.elem.hidden = true;
    }
}