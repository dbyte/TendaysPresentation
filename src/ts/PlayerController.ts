import {
    Video, HotspotsScene01, Navbar, OverlayHandler, HasHtmlElement,
    getElementsOfObjects, InfoButton
} from "./Exporter";

export class PlayerController {
    private static readonly COMPONENT_ID = "interactiveContainer";
    private static readonly DEFAULT_VIDEOSOURCE = "animation-01";
    private video: Video;
    private hotspotsScene01: HotspotsScene01;
    private navbar: Navbar;
    private infoButton01: InfoButton;
    private overlayHandler!: OverlayHandler;

    constructor() {
        this.video = Video.create(PlayerController.COMPONENT_ID, PlayerController.DEFAULT_VIDEOSOURCE)
        this.hotspotsScene01 = HotspotsScene01.create(PlayerController.COMPONENT_ID);
        this.navbar = Navbar.create(PlayerController.COMPONENT_ID);
        this.infoButton01 = InfoButton.create(PlayerController.COMPONENT_ID);
    }

    public static create(): PlayerController {
        const instance = new PlayerController();
        return instance;
    }

    public async render(): Promise<void> {
        await Promise.all([
            this.video.render(),
            this.hotspotsScene01.render(),
            this.navbar.render(),
            this.infoButton01.render()
        ]);
        this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());

        console.log(this.constructor.name + " rendered and ready to show().")
    }

    public show(): void {
        this.hotspotsScene01.show();
        this.navbar.show();
        this.overlayHandler.repositionOnVideo(this.video.elem);

        window.addEventListener("resize", () => {
            this.overlayHandler.repositionOnVideo(this.video.elem)
        });
        this.video.elem.addEventListener("click", (event) => {
            this.onClickedVideo(event)
        });
        this.video.elem.addEventListener("ended", () => {
            this.onVideoEnded()
        });
    }

    private getAllOverlayElements(): HTMLElement[] {
        let overlays: HasHtmlElement[] = [...this.hotspotsScene01.playButtons]; // we need a value copy of playButtons
        overlays.push(this.infoButton01, this.navbar);
        return getElementsOfObjects(overlays);
    }

    public startVideo(videoBaseFilename: string): void {
        this.video.switchSource(videoBaseFilename);
        this.hotspotsScene01.hide();
        this.video.play(() => {
            this.navbar.hide();
        })
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