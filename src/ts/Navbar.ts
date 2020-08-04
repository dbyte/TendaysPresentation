import { Component } from "./Component";
import { FullscreenButton } from "./FullscreenButton";
import { HomeButton } from "./HomeButton";
import { CssAnimation, CssAnimationEvent } from "./Utilities";

export class Navbar extends Component {
  private cssAnimation?: CssAnimation;

  constructor(parentElemId: string, onClickHomeButtonCallback?: CallableFunction) {
    const COMPONENT_ID = "main-navigation-component";
    const fullscreenButton = FullscreenButton.create(COMPONENT_ID);
    const homeButton = HomeButton.create(COMPONENT_ID);
    homeButton.onClickCallback = onClickHomeButtonCallback;

    super(COMPONENT_ID, parentElemId, [fullscreenButton, homeButton]);
  }

  public static create(parentElemId: string, onClickHomeButtonCallback?: CallableFunction): Navbar {
    const instance = new Navbar(parentElemId, onClickHomeButtonCallback);
    return instance;
  }

  public async render(): Promise<void> {
    // Set up my own component first!
    await super.render();
    this.setHidden(true);
    if (this.elem) this.cssAnimation = new CssAnimation(this.elem);
  }

  public toggleShowHide(): void {
    if (this.elem?.hidden) {
      this.show();
      return;
    }
    this.hide();
  }

  public show(): void {
    if (this.elem?.hidden) {
      this.elem.addEventListener(
        "animationend",
        () => { this.cssAnimation?.removeAll(); },
        { once: true }
      );

      super.setHidden(false);
      this.cssAnimation?.start(CssAnimationEvent.FadeIn);
      this.children?.forEach(child => child.show());
    }
  }

  public hide(): void {
    if (!this.elem?.hidden) {
      this.elem?.addEventListener(
        "animationend",
        () => { this.onHideAnimationEnd(); },
        { once: true }
      );

      this.cssAnimation?.start(CssAnimationEvent.FadeOut);
    }
  }
  private onHideAnimationEnd(): void {
    this.setHidden(true);
    this.cssAnimation?.removeAll();
    this.children?.forEach(child => child.hide());
  }
}
