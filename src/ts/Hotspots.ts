import { Component } from "./Component";

export abstract class HotspotsComponent extends Component {
  private children: Component[];

  constructor(componentID: string, parentElemID: string, children: Component[]) {
    super(componentID, parentElemID);
    this.children = children;
  }

  public getChildren(): Component[] {
    return this.children;
  }

  public async render(): Promise<void> {
    // Set up my own component first!
    await super.render();

    // Now my children (their order matters for horiz. alignment, so no Promise.all!)
    await Promise.all(this.children.map(child => child.render()));
  }

  public dispose(): void {
    this.children.forEach(child => { child.dispose(); });
    super.dispose();
  }

  public show(): void {
    this.children.forEach(child => { child.show(); });
  }

  public hide(): void {
    this.children.forEach(child => { child.hide(); });
  }
}
