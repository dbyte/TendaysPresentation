import { Button } from "./Button";
import { CssAnimation, CssAnimationEvent } from "./Utilities";

export class InfoButton extends Button {
  private cssAnimation?: CssAnimation;

  constructor(parentElemID: string) {
    super("info-button-component", "assets/info-button.png", parentElemID);
  }

  public static create(parentElemID: string): InfoButton {
    const instance = new InfoButton(parentElemID);
    return instance;
  }

  public async render(): Promise<void> {
    await super.render();
    this.cssAnimation = new CssAnimation(this.elem);
  }

  public show(): void {
    super.show();
    this.animateIn();
  }

  // Called JS-internally by the added listeners!
  public handleEvent(e: Event): void {
    switch (e.type) {
      case "click":
        // ToDo
        break;
      default:
        break;
    }
    e.stopPropagation();
  }

  private animateIn(): void {
    this.elem.addEventListener(
      "animationend", event => { this.onInAnimationEnd(event); },
      { once: true }
    );
    this.cssAnimation?.start(CssAnimationEvent.ScaleIn);
  }
  private onInAnimationEnd(event: AnimationEvent): void {
    this.cssAnimation?.removeAll();
    event.stopPropagation();
  }
}
