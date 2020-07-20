export enum CssAnimationEvent {
    OnDocumentLoaded = "onLoadAnimate",
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
        const animationsToRemove: string[] = this.enumValuesToStringArray(CssAnimationEvent);
        this.element.classList.remove(...animationsToRemove);
    }

    private enumValuesToStringArray(theEnum: typeof CssAnimationEvent): string[] {
        var stringValues: string[] = [];
        stringValues = Object.values(CssAnimationEvent);
        return stringValues;
    }
}
