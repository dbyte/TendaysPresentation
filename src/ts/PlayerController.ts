import { Video } from "./Video";
import { HotspotsScene01 } from "./HotspotsScene01";
import { InfoButton } from "./InfoButton";
import { OverlayHandler } from "./OverlayHandler";
import { Navbar } from "./Navbar";
import { HasHtmlElement, getElementsOfObjects, IS_CLIENT_SAFARI } from "./Utilities";

export class PlayerController {
  private static readonly DEFAULT_VIDEOSOURCE = "animation-01";
  private video: Video;
  private navbar: Navbar;
  private infoButton01: InfoButton;
  private overlayHandler!: OverlayHandler;

  constructor() {
    const COMPONENT_ID = "interactiveContainer";

    this.video = Video.create(
      COMPONENT_ID,
      PlayerController.DEFAULT_VIDEOSOURCE,
      HotspotsScene01.create(COMPONENT_ID, this.startVideo.bind(this))
    );
    this.navbar = Navbar.create(COMPONENT_ID, this.goHome.bind(this));
    this.infoButton01 = InfoButton.create(COMPONENT_ID);
  }

  public static create(): PlayerController {
    const instance = new PlayerController();
    return instance;
  }

  public async render(): Promise<void> {
    await Promise.all([
      this.video.render(),
      this.navbar.render(),
      this.infoButton01.render(),
    ]);

    this.overlayHandler = new OverlayHandler(this.getAllOverlayElements());
  }

  public show(): void {
    if (!this.video.elem) throw new TypeError("Video element is undefined.");

    this.video.show();
    this.navbar.show();
    this.overlayHandler.repositionOnVideo(this.video.elem);

    window.addEventListener("resize", () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.overlayHandler.repositionOnVideo(this.video.elem!);
    });

    this.video.elem.addEventListener("click", event => {
      this.onClickedVideo(event);
    });

    this.video.elem.addEventListener("ended", () => {
      this.onVideoEnded();
    });
  }

  private getAllOverlayElements(): HTMLElement[] {
    // We need a value copy of playButtons
    const overlays: HasHtmlElement[] = [
      this.navbar, this.infoButton01, ...this.video.hotspotComponent.getChildren()
    ];
    return getElementsOfObjects(overlays);
  }

  public startVideo(videoBaseFilename: string): void {
    this.video.switchSource(videoBaseFilename);
    this.video.play(() => {
      this.navbar.hide();
    });
  }

  private onVideoEnded(): void {
    if (IS_CLIENT_SAFARI && this.video.elem) {
      // Workaround for Safari Client, which sometimes shows white frame at end.
      this.video.elem.currentTime = this.video.elem.duration;
    }

    this.navbar.show();
    this.infoButton01.show();
  }

  private onClickedVideo(event: Event): void {
    if (event.type === "click") {
      event.preventDefault();
      this.navbar.toggleShowHide();
    }
    event.stopPropagation();
  }

  public goHome(): void {
    this.video.jumpToStart();
    this.infoButton01.hide();
  }
}
