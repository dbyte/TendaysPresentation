import { Button } from "./Button";
import { FullscreenService } from "./FullscreenService";

export class FullscreenButton extends Button {
  private fullscreen: FullscreenService;

  constructor(parentElemId: string) {
    const COMPONENT_ID = "fullscreen-button-component";

    super(COMPONENT_ID, "assets/fullscreen-button.svg", parentElemId);
    this.fullscreen = new FullscreenService();
  }

  public static create(parentElemID: string): FullscreenButton {
    const instance = new FullscreenButton(parentElemID);
    return instance;
  }

  // Called JS-internally by the added listeners!
  public handleEvent(e: Event): void {
    switch (e.type) {
      case "click":
        this.fullscreen.toggle();
        break;
      default:
        break;
    }
    e.stopPropagation();
  }
}
