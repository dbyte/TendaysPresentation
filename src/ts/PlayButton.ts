import { Button } from "./Button";
import { CssAnimationService, CssAnimationClass } from "./CssAnimationService";

export class PlayButton extends Button {
  private readonly videoFileBasename: string;
  private cssAnimation?: CssAnimationService;
  public onClickCallback?: CallableFunction;

  constructor(elemID: string, pathToVideo: string, parentElemId: string) {
    super(elemID, "assets/play-button-grey.svg", parentElemId);
    this.videoFileBasename = pathToVideo;
  }

  public static create(elemID: string, pathToVideo: string, parentElemId: string): PlayButton {
    const instance = new PlayButton(elemID, pathToVideo, parentElemId);
    return instance;
  }

  public dispose(): void {
    super.dispose();
    this.onClickCallback = undefined;
  }

  public async render(): Promise<void> {
    await super.render();
    if (this.elem) this.cssAnimation = new CssAnimationService(this.elem);
  }

  public show(): void {
    super.show();
    this.animateIn();
  }

  // Called JS-internally by the added listeners!
  public handleEvent(e: Event): void {
    switch (e.type) {
      case "click":
        if (this.onClickCallback) this.onClickCallback(this.videoFileBasename);
        break;
      case "mouseover":
        this.animateOnMouseover();
        break;
      case "mouseout":
        this.animateOnMouseout();
        break;
      default:
        break;
    }
    e.stopPropagation();
  }

  private animateIn(): void {
    this.cssAnimation?.start(CssAnimationClass.ScaleIn);
  }

  private animateOnMouseover(): void {
    this.cssAnimation?.start(CssAnimationClass.OnMouseOver);
  }

  private animateOnMouseout(): void {
    this.cssAnimation?.start(CssAnimationClass.OnMouseOut);
  }

  public hide(): void {
    this.removeEventListeners();
    this.cssAnimation?.start(
      CssAnimationClass.ScaleOut, { callbackOnEnd: super.hide.bind(this), removeClassOnEnd: true }
    );
  }
}
