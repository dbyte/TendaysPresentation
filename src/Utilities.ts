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
        // This is a polyfill for Pre-ES7 clients. We don't have Object.values in pre-ES7.
        for (let key of Object.keys(theEnum)) {
            // @ts-ignore
            stringValues.push(theEnum[key]);
        }
        return stringValues;
    }
}