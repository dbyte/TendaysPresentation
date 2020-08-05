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
    this.cssAnimation?.start(CssAnimationClass.ScaleIn, { removeClassOnEnd: true });
  }

  public hide(): void {
    this.removeEventListeners();
    this.cssAnimation?.start(CssAnimationClass.ScaleOut, {
      callbackOnEnd: super.hide.bind(this),
      removeClassOnEnd: true
    });
  }

  // Called JS-internally by the added listeners!
  public handleEvent(e: Event): void {
    switch (e.type) {
      case "click":
        if (this.onClickCallback !== undefined) this.onClickCallback();
        break;
      case "mouseover":
        this.cssAnimation?.start(CssAnimationClass.OnMouseOver);
        break;
      case "mouseout":
        this.cssAnimation?.start(CssAnimationClass.OnMouseOut);
        break;
      default:
        break;
    }
    e.stopPropagation();
  }
}
