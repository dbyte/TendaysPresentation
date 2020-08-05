import { Button } from "./Button";
import { CssAnimationService, CssAnimationClass } from "./CssAnimationService";

export class InfoButton extends Button {
  private onClickCallback?: CallableFunction;
  private cssAnimation?: CssAnimationService;

  constructor(parentElemID: string, onClickCallback?: CallableFunction) {
    const COMPONENT_ID = "info-button-component";

    super(COMPONENT_ID, "assets/info-button.png", parentElemID);
    this.onClickCallback = onClickCallback;
  }

  public static create(
    parentElemID: string,
    onClickCallback?: CallableFunction
  ): InfoButton {
    const instance = new InfoButton(parentElemID, onClickCallback);
    return instance;
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
        if (this.onClickCallback) this.onClickCallback();
        break;
      default:
        break;
    }
    e.stopPropagation();
  }

  private animateIn(): void {
    this.cssAnimation?.start(CssAnimationClass.ScaleIn);
  }
}
