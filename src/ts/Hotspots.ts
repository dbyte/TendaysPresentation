import { Component } from "./Component";

export abstract class HotspotsComponent extends Component {
  public show(): void {
    this.children?.forEach(child => child.show());
  }

  public hide(): void {
    this.children?.forEach(child => child.hide());
  }
}
