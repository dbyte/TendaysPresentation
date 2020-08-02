import { HasHtmlElement, getElementByUniqueClassName, htmlTextToDomFragment } from "./Utilities";

export abstract class Component<T> implements HasHtmlElement {
  public elem: HTMLElement;
  public readonly componentId: string;
  protected readonly parentElemId: string;

  constructor(componentId: string, parentElemId: string) {
    this.componentId = componentId;
    this.parentElemId = parentElemId;
    this.elem = undefined!;
  }

  public async render(skipLoading?: "skipLoading"): Promise<void> {
    const parentElem = getElementByUniqueClassName(this.parentElemId);
    if (!parentElem) Error(`Unable to find DOM element with id '${this.parentElemId}'`);

    if (!skipLoading) await this.loadView();
    this.elem = getElementByUniqueClassName(this.componentId) as HTMLElement;
  }

  public dispose(): void {
    this.elem.remove();
    this.elem = undefined!;
  }

  public abstract show(): void;
  public abstract hide(): void;

  private async loadView(): Promise<void> {
    const parentElem = getElementByUniqueClassName(this.parentElemId);
    if (!parentElem) Error(`Unable to find DOM element with id '${this.parentElemId}'`);

    const url = ComponentUrl.get(this.componentId);
    let response;
    const headers = new Headers();
    headers.append("Content-Type", "text/html");

    try {
      response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response) {
        throw new Error(`Unable to load component. No response for request url ${url}`);
      }

      if (!response.ok) {
        throw new Error(`Unable to load component. Response status = ${response.status}`);
      }
    } catch (error) {
      return Promise.reject(error);
    }

    if (response && response.ok) {
      const responseText = await response.text();
      parentElem.append(htmlTextToDomFragment(responseText));
    }
  }
}

class ComponentUrl {
  private static readonly URL: Record<string, string> = {
    "video-component": "./views/video.html",
    "hotspots-scene-01-component": "./views/hotspots-scene-01.html",
    "main-navigation-component": "./views/main-navigation.html",
    "loadingspinner-component": "./views/loadingspinner.html",
    "fullscreen-button-component": "./views/fullscreen-button.html",
    "home-button-component": "./views/home-button.html",
    "info-button-component": "./views/info-button.html",
  };

  public static get(componentId: string): string | never {
    const url = ComponentUrl.URL[componentId];
    if (url) return url;
    throw new Error(`Could not find URL for component '${componentId}'`);
  }
}
