/**
 * These are the mappings to literal CSS definitions.
 */
export enum CssAnimationEvent {
  ScaleIn = "scaleIn",
  ScaleOut = "scaleOut",
  FadeIn = "fadeIn",
  FadeOut = "fadeOut",
  OnMouseOver = "onMouseoverAnimate",
  OnMouseOut = "onMouseoutAnimate"
}

/**
 * Trigger CSS animations by manipulating HTMLDomElement-Classes
 */
export class CssAnimation {
  private readonly element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public start(cssEvent: string): void {
    this.removeAll();
    this.element.classList.add(cssEvent);
  }

  public removeAll(): void {
    const animationsToRemove: string[] = Object.values(CssAnimationEvent);
    this.element.classList.remove(...animationsToRemove);
  }
}

export interface HasHtmlElement {
  elem?: HTMLElement;
}

export function getElementsOfObjects(objects: HasHtmlElement[]): HTMLElement[] {
  const countUndefined = objects.filter(o => o === undefined).length;
  if (countUndefined > 0) {
    throw new TypeError(
      `Expected all HTMLElements to be defined but got ${countUndefined} undefined.`
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return objects.map(o => o.elem!);
}

export function getElementByUniqueClassName(className: string): HTMLElement | never {
  const elems = document.getElementsByClassName(className);
  const count: number = !elems ? 0 : elems.length;
  switch (count) {
    case 1:
      return elems[0] as HTMLElement;

    case 0:
      throw new Error(`Unable to find element with class name ${className}`);

    default:
      throw new Error(`Class name not unique. Found ${count} elements, expected 1!`);
  }
}

export function htmlTextToDomFragment(text: string): DocumentFragment {
  const htmlBody = new DOMParser().parseFromString(text, "text/html").body;
  const fragment = new DocumentFragment();
  htmlBody.childNodes.forEach(child => { fragment.appendChild(child); });
  return fragment;
}

export function isTouchDevice(): boolean {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export const IS_CLIENT_SAFARI = navigator.vendor && navigator.vendor.indexOf("Apple") > -1
  && navigator.userAgent
  && navigator.userAgent.indexOf("CriOS") === -1
  && navigator.userAgent.indexOf("FxiOS") === -1;
