import { Component } from "./ComponentService";
import { FullscreenButton } from "./FullscreenButton";
import { HomeButton } from "./HomeButton";
import { CssAnimation, CssAnimationEvent } from "./Utilities";

export class Navbar extends Component<Navbar> {
  private fullscreenButton!: FullscreenButton;
  private homeButton!: HomeButton;
  private cssAnimation?: CssAnimation;

  constructor(parentElemId: string) {
    super("main-navigation-component", parentElemId);

    this.fullscreenButton = FullscreenButton.create(this.componentId);
    this.homeButton = HomeButton.create(this.componentId);
  }

  public static create(parentElemId: string): Navbar {
    const instance = new Navbar(parentElemId);
    return instance;
  }

  public async render(): Promise<void> {
    // Set up my own component first!
    await super.render();
    this.elem.hidden = true;
    this.cssAnimation = new CssAnimation(this.elem);

    // Now my children (their order matters for horiz. alignment, so no Promise.all!)
    await this.fullscreenButton.render();
    await this.homeButton.render();
  }

  public dispose(): void {
    super.dispose();
    this.fullscreenButton.dispose();
    this.homeButton.dispose();
  }

  public toggleShowHide(): void {
    if (this.elem.hidden) {
      this.show();
      return;
    }
    this.hide();
  }

  public show(): void {
    if (this.elem.hidden) {
      this.elem.addEventListener(
        "animationend",
        () => { this.cssAnimation?.removeAll(); },
        { once: true }
      );

      this.elem.hidden = false;
      this.cssAnimation?.start(CssAnimationEvent.FadeIn);
      this.fullscreenButton.show();
      this.homeButton.show();
    }
  }

  public hide(): void {
    if (!this.elem.hidden) {
      this.elem.addEventListener(
        "animationend",
        () => { this.onHideAnimationEnd(); },
        { once: true }
      );

      this.cssAnimation?.start(CssAnimationEvent.FadeOut);
    }
  }
  private onHideAnimationEnd(): void {
    this.elem.hidden = true;
    this.cssAnimation?.removeAll();
    this.fullscreenButton.hide();
    this.homeButton.elem.hidden = true;
  }
}
