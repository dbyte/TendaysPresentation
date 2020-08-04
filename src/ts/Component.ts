import { HasHtmlElement, getElementByUniqueClassName, htmlTextToDomFragment } from "./Utilities";
import { ComponentUrl } from "./ComponentUrl";

export abstract class Component implements HasHtmlElement {
  public elem?: HTMLElement;
  protected children?: Component[];
  public readonly componentId: string;
  private readonly componentURL?: string;
  protected readonly parentElemId: string;

  constructor(componentId: string, parentElemId: string, children?: Component[]) {
    this.componentId = componentId;
    this.parentElemId = parentElemId;
    this.children = children;
    this.componentURL = ComponentUrl.get(this.componentId);
  }

  public getChildren(): Component[] {
    if (!this.children) return [];
    return this.children;
  }

  public async render(): Promise<void> {
    const parentElem = getElementByUniqueClassName(this.parentElemId);
    if (!parentElem) Error(`Unable to find DOM element with id '${this.parentElemId}'`);

    if (this.componentURL) {
      await this.loadView();
    } else {
      console.info(
        `Skipping fetch of component ${this.componentId} because it's an embedded component.`
      );
    }

    // Throws on undefined or multiple found elements
    this.elem = getElementByUniqueClassName(this.componentId);

    if (this.children) {
      /* Composite - deep loop through all children. Wait until all children finished rendering.
      Note: Children are rendered in parallel inside map call! Hence, we
      do not guarantee the order in which renderings of them get finished */
      await Promise.all(this.children.map(async child => {
        await child.render();
      }));
    }
  }

  public dispose(): void {
    this.children?.forEach(child => child.dispose());
    this.elem?.remove();
    this.elem = undefined;
  }

  public abstract show(): void;

  public abstract hide(): void;

  /* Just an often needed helper for subclasses.
  We do not recursively hide/show children here, as it may not be desired
  to hide/show them at the same time. */
  public setHidden(isHidden: boolean): void {
    if (this.elem) this.elem.hidden = isHidden;
  }

  /* Fetch HTML component and insert into live DOM. Do not call for
  "embedded" components which HTML is nested inside their parents. */
  private async loadView(): Promise<void> {
    const parentElem = getElementByUniqueClassName(this.parentElemId);
    if (!parentElem) Error(`Unable to find DOM element with id '${this.parentElemId}'`);

    if (!this.componentURL) {
      throw new Error(`Could not find URL for component '${this.componentId}'`);
    }

    let response;
    const headers = new Headers();
    headers.append("Content-Type", "text/html");

    try {
      response = await fetch(this.componentURL, {
        method: "GET",
        headers,
      });
    } catch (error) {
      throw new Error(`Unable to load component by GET. ${error}`);
    }

    if (!response) {
      throw new Error(`Unable to load component. No response for request url ${this.componentURL}`);
    }

    if (!response.ok) {
      throw new Error(`Unable to load component. Response status = ${response.status}`);
    }

    const responseText = await response.text();
    parentElem.append(htmlTextToDomFragment(responseText));
  }
}
