/**
 * These are the mappings to literal CSS definitions.
 */
export enum CssAnimationEvent {
    ScaleIn = "scaleIn",
    OnMouseOver = "onMouseoverAnimate",
    OnMouseOut = "onMouseoutAnimate",
    OnClick = "onClickAnimate"
}

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
