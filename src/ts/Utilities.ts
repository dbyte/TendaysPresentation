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
        const animationsToRemove: string[] = Object.values(CssAnimationEvent);;
        this.element.classList.remove(...animationsToRemove);
    }
}

export interface HasHtmlElement {
    elem: HTMLElement;
}

export function getElementsOfObjects(objects: HasHtmlElement[]): HTMLElement[] {
    return objects.map(o => { return o.elem });
}

export function isTouchDevice(): boolean {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

export const IS_CLIENT_SAFARI =
    navigator.vendor && navigator.vendor.indexOf("Apple") > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf("CriOS") == -1 &&
    navigator.userAgent.indexOf("FxiOS") == -1;