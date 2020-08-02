import { LoadingSpinner } from "./LoadingSpinner";
import { Component } from "./ComponentService";

export class Video extends Component<Video> {
  public elem: HTMLVideoElement;
  private baseFilename: string;
  private loadingSpinner: LoadingSpinner;
  private static readonly BASE_DIR = "assets/";
  private static readonly SMALLRES_FRAGMENT = "-small";
  private static readonly MEDIUMRES_FRAGMENT = "-medium";
  private static readonly LARGE_FRAGMENT = "-large";
  private static readonly FILE_SUFFIX = ".mp4";

  public constructor(parentElemId: string, baseFilename: string) {
    super("video-component", parentElemId);

    // 'elem' also resides in superclass, but here we need to cast to HTMLVideoElement:
    this.elem = super.elem as HTMLVideoElement;

    this.baseFilename = baseFilename;
    this.loadingSpinner = LoadingSpinner.create("interactiveContainer");
  }

  public static create(parentElemId: string, baseFilename: string): Video {
    const instance = new Video(parentElemId, baseFilename);
    return instance;
  }

  public async render(): Promise<void> {
    // Set up my own component first!
    await super.render();
    // Now my children
    await this.loadingSpinner.render();
  }

  public dispose(): void {
    super.dispose();
    this.loadingSpinner.dispose();
  }

  public show(): void {
    this.elem.hidden = false;
  }
  public hide(): void {
    this.loadingSpinner.hide();
    this.elem.hidden = true;
  }

  public switchSource(baseFilename: string): void {
    this.baseFilename = baseFilename;
    const relativePath = this.getRelativePath();
    const absolutePathToNewSource = new URL(relativePath, document.baseURI).href;

    /* Only switch source if not yet set (which will reduce
    flicker when user wants to play same video as previous time) */
    if (this.elem.src !== absolutePathToNewSource) {
      this.elem.src = relativePath;
      console.log("Video source is now ".concat(relativePath));
    }
  }

  public play(callback: CallableFunction): void {
    this.loadingSpinner.show();
    this.elem.play().then(() => {
      this.loadingSpinner.hide();
      callback();
    });
  }

  public jumpToStart(): void {
    this.elem.pause();
    this.elem.currentTime = 0;
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
