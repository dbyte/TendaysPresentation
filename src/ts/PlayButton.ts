import { Button } from "./Button";
import { CssAnimation, CssAnimationEvent } from "./Utilities";
import { App } from "./App";

export class PlayButton extends Button {
  private readonly videoFileBasename: string;
  private cssAnimation?: CssAnimation;

  constructor(elemID: string, pathToVideo: string, parentElemId: string) {
    super(elemID, "assets/play-button-grey.svg", parentElemId);
    this.videoFileBasename = pathToVideo;
  }

  public static create(elemID: string, pathToVideo: string, parentElemId: string): PlayButton {
    const instance = new PlayButton(elemID, pathToVideo, parentElemId);
    return instance;
  }

  public async render(): Promise<void> {
    super.render("skipLoading");
    if (this.elem) this.cssAnimation = new CssAnimation(this.elem);
  }

  public show(): void {
    super.show();
    this.animateIn();
  }

  // Called JS-internally by the added listeners!
  public handleEvent(e: Event): void {
    switch (e.type) {
      case "click":
        App.instance.controller?.startVideo(this.videoFileBasename);
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
    this.elem?.addEventListener("animationend", () => { this.onInAnimationEnd(); }, { once: true });
    this.cssAnimation?.start(CssAnimationEvent.ScaleIn);
  }
  private onInAnimationEnd(): void {
    this.cssAnimation?.removeAll();
  }

  private animateOnMouseover(): void {
    this.elem?.addEventListener(
      "animationend", () => { this.onMouseoverAnimationEnd(); }, { once: true }
    );
    this.cssAnimation?.start(CssAnimationEvent.OnMouseOver);
  }
  private onMouseoverAnimationEnd(): void {
    // TODO
  }

  private animateOnMouseout(): void {
    this.elem?.addEventListener(
      "animationend", () => { this.onMouseoutAnimationEnd(); }, { once: true }
    );
    this.cssAnimation?.start(CssAnimationEvent.OnMouseOut);
  }
  private onMouseoutAnimationEnd(): void {
    // TODO
  }

  public hide(): void {
    this.removeEventListeners();
    this.elem?.addEventListener(
      "animationend", () => { this.onHideAnimationEnd(); }, { once: true }
    );
    this.cssAnimation?.start(CssAnimationEvent.ScaleOut);
  }
  private onHideAnimationEnd(): void {
    super.hide();
  }
}
