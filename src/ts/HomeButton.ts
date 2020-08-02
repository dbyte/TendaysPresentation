import { Button } from "./Button";

export class HomeButton extends Button {
  public onClickCallback?: CallableFunction;

  constructor(parentElemID: string) {
    const COMPONENT_ID = "home-button-component";

    super(COMPONENT_ID, "assets/reload-button.svg", parentElemID);
  }

  public static create(parentElemID: string): HomeButton {
    const instance = new HomeButton(parentElemID);
    return instance;
  }

  public dispose(): void {
    super.dispose();
    this.onClickCallback = undefined;
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
}
