import { Component } from "./Component";
import { LoadingSpinner } from "./LoadingSpinner";
import { HotspotsScene01 } from "./HotspotsScene01";
import { CssAnimation, CssAnimationEvent } from "./Utilities";

export class Video extends Component {
  public elem?: HTMLVideoElement;
  private baseFilename: string;
  private loadingSpinner: LoadingSpinner;
  public hotspotComponent: HotspotsScene01;
  private cssAnimation?: CssAnimation;

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
    const COMPONENT_ID = "video-component";

    const loadingSpinner = LoadingSpinner.create("interactiveContainer");

    super(COMPONENT_ID, parentElemId, [hotspotComponent, loadingSpinner]);

    // 'elem' also resides in superclass, but here we need to cast to HTMLVideoElement:
    this.elem = super.elem as HTMLVideoElement;

    this.baseFilename = baseFilename;

    /* We handle some behaviour of these children separately
    in this class, so keep a ref on each of them. */
    this.loadingSpinner = loadingSpinner;
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
    if (this.elem) this.cssAnimation = new CssAnimation(this.elem);
  }

  public show(): void {
    this.elem?.addEventListener(
      "animationend",
      () => { this.cssAnimation?.removeAll(); },
      { once: true }
    );

    this.setHidden(false);
    this.cssAnimation?.start(CssAnimationEvent.FadeIn);
    this.hotspotComponent.show();
  }

  public hide(): void {
    this.children?.forEach(child => child.hide());
    this.setHidden(true);
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
    if (this.elem) this.elem.currentTime = 0;
    if (!this.elem?.paused) this.elem?.pause();
    this.elem?.load();
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
