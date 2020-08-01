import {
    Video, HotspotsScene01, Navbar, OverlayHandler, HasHtmlElement,
    getElementsOfObjects, LoadingSpinner, InfoButton
} from "./Exporter";

export class PlayerController {
    private static readonly COMPONENT_ID = "interactiveContainer";
    private static readonly DEFAULT_VIDEOSOURCE = "animation-01";
    private video!: Video;
    private hotspotsScene01: HotspotsScene01;
    private infoButton01: InfoButton;
    private loadingSpinner: LoadingSpinner;
    private navbar: Navbar;
    private overlayHandler!: OverlayHandler;

    constructor() {
        this.loadingSpinner = LoadingSpinner.create(PlayerController.COMPONENT_ID);
        this.navbar = Navbar.create(PlayerController.COMPONENT_ID);
        this.hotspotsScene01 = HotspotsScene01.create(PlayerController.COMPONENT_ID);
        this.infoButton01 = InfoButton.create(PlayerController.COMPONENT_ID);
    }

    public static create(): PlayerController {
        const instance = new PlayerController();
        return instance;
    }

    public async render(): Promise<void> {
        this.video = new Video(PlayerController.DEFAULT_VIDEOSOURCE);
        await Promise.all([
            this.hotspotsScene01.render(),
            this.navbar.render(),
            this.loadingSpinner.render(),
            this.infoButton01.render()
        ]);
        this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());
        
        console.log(this.constructor.name + " rendered and ready to show()." )
    }

    public show(): void {
        this.hotspotsScene01.show();
        this.navbar.show();
        this.overlayHandler.repositionOnVideo(this.video.elem);

        window.addEventListener("resize", () => { this.overlayHandler.repositionOnVideo(this.video.elem) });
        this.video.elem.addEventListener("click", (event) => { this.onClickedVideo(event) });
        this.video.elem.addEventListener("ended", () => { this.onVideoEnded() });
    }

    public hide() {
        new Error("Method not yet implemented.")
    }

    private getAllOverlayElements(): HTMLElement[] {
        let overlays: HasHtmlElement[] = [...this.hotspotsScene01.playButtons]; // we need a value copy of playButtons
        overlays.push(this.infoButton01, this.navbar);
        return getElementsOfObjects(overlays);
    }

    public startVideo(videoBaseFilename: string): void {
        this.video.switchSource(videoBaseFilename);
        this.loadingSpinner.show();
        this.hotspotsScene01.hide();
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
        this.hotspotsScene01.show();
        this.infoButton01.hide();
    }
}