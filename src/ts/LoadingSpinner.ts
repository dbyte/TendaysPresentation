import { Component } from "./Component";
import { CssAnimation, CssAnimationEvent, CssAnimationOptions } from "./CssAnimationService";

export class LoadingSpinner extends Component {
  private cssAnimation?: CssAnimation;

  constructor(parentElemId: string) {
    const COMPONENT_ID = "loadingspinner-component";

    super(COMPONENT_ID, parentElemId);
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
    this.setHidden(false);
    this.cssAnimation?.start(CssAnimationEvent.ScaleIn);
  }

  public hide(): void {
    const options: CssAnimationOptions = {
      callbackOnEnd: () => this.setHidden(true),
      removeClassOnEnd: true
    };

    this.cssAnimation?.start(CssAnimationEvent.ScaleOut, options);
  }
}
