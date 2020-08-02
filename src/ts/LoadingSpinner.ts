import { Component } from "./Component";
import { CssAnimation, CssAnimationEvent } from "./Utilities";

export class LoadingSpinner extends Component {
  private cssAnimation?: CssAnimation;

  constructor(parentElemId: string) {
    super("loadingspinner-component", parentElemId);
  }

  public static create(parentElemId: string): LoadingSpinner {
    const instance = new LoadingSpinner(parentElemId);
    return instance;
  }

  public async render(): Promise<void> {
    await super.render();
    if (this.elem) this.cssAnimation = new CssAnimation(this.elem);
  }

  public show(): void {
    super.setHidden(false);
    this.cssAnimation?.start(CssAnimationEvent.ScaleIn);
  }

  public hide(): void {
    this.cssAnimation?.start(CssAnimationEvent.ScaleOut);
    this.elem?.addEventListener(
      "animationend",
      event => { super.setHidden(true); event.stopPropagation(); },
      { once: true }
    );
  }
}
