import { Component } from "./Component";
import { LoadingSpinner } from "./LoadingSpinner";
import { HotspotsScene01 } from "./HotspotsScene01";

export class Video extends Component {
  public elem?: HTMLVideoElement;
  private baseFilename: string;
  private loadingSpinner: LoadingSpinner;
  public hotspotComponent: HotspotsScene01;

  private static readonly BASE_DIR = "assets/";
  private static readonly SMALLRES_FRAGMENT = "-small";
  private static readonly MEDIUMRES_FRAGMENT = "-medium";
  private static readonly LARGE_FRAGMENT = "-large";
  private static readonly FILE_SUFFIX = ".mp4";

  public constructor(
    parentElemId: string,
    baseFilename: string,
    hotspotComponent: HotspotsScene01
  ) {
    super("video-component", parentElemId);

    // 'elem' also resides in superclass, but here we need to cast to HTMLVideoElement:
    this.elem = super.elem as HTMLVideoElement;

    this.baseFilename = baseFilename;
    this.loadingSpinner = LoadingSpinner.create("interactiveContainer");
    this.hotspotComponent = hotspotComponent;
  }

  public static create(
    parentElemId: string,
    baseFilename: string,
    hotspotComponent: HotspotsScene01
  ): Video {
    const instance = new Video(parentElemId, baseFilename, hotspotComponent);
    return instance;
  }

  public async render(): Promise<void> {
    // Set up my own component first!
    await super.render();
    // Now my children
    Promise.all([
      await this.loadingSpinner.render(),
      await this.hotspotComponent.render()
    ]);
  }

  public dispose(): void {
    super.dispose();
    this.elem = undefined;
    this.loadingSpinner.dispose();
    this.hotspotComponent.dispose();
  }

  public show(): void {
    super.setHidden(false);
    this.hotspotComponent.show();
  }
  public hide(): void {
    this.loadingSpinner.hide();
    this.hotspotComponent.hide();
    super.setHidden(true);
  }

  public switchSource(baseFilename: string): void {
    this.baseFilename = baseFilename;
    const relativePath = this.getRelativePath();
    const absolutePathToNewSource = new URL(relativePath, document.baseURI).href;

    /* Only switch source if not yet set (which will reduce
    flicker when user wants to play same video as previous time) */
    if (this.elem?.src !== absolutePathToNewSource) {
      if (this.elem) this.elem.src = relativePath;
      console.log("Video source is now ".concat(relativePath));
    }
  }

  public play(callback: CallableFunction): void {
    this.loadingSpinner.show();
    this.hotspotComponent.hide();

    this.elem?.play().then(() => {
      this.loadingSpinner.hide();
      callback();
    });
  }

  public jumpToStart(): void {
    this.elem?.pause();
    if (this.elem) this.elem.currentTime = 0;
    this.hotspotComponent.show();
  }

  public getRelativePath(): string {
    return Video.BASE_DIR.concat(this.getFinalFilename());
  }

  private getFinalFilename(): string {
    return this.baseFilename.concat(
      this.getCurrentResolutionFilenameFragment().concat(Video.FILE_SUFFIX)
    );
  }

  private getCurrentResolutionFilenameFragment(): string {
    // iPhoneX landscape max:
    if (window.matchMedia("(max-width: 812px)").matches) {
      return Video.SMALLRES_FRAGMENT;
    }

    // iPad Pro landscape max:
    if (window.matchMedia("(max-width: 1366px)").matches) {
      return Video.MEDIUMRES_FRAGMENT;
    }

    return Video.LARGE_FRAGMENT;
  }
}
