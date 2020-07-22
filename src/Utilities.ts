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

export class OverlayHandler {
    private elements: HTMLElement[];

    constructor(elements: HTMLElement[]) {
        this.elements = elements;
    }

    /**
    This is the core for resizing/repositioning overlay elements on
    pixel-exact defined hotspots of a vertically centered video source. */
    public repositionOnVideo(videoObject: HTMLVideoElement): void {
        this.elements.forEach(elem => { this.repositionSingleElem(elem, videoObject) });
    }

    private repositionSingleElem(elem: HTMLElement, videoObject: HTMLVideoElement): void {
        var a = videoObject.videoWidth || 1920,
            b = videoObject.videoHeight || 1080,
            c = videoObject.getBoundingClientRect(),
            e = c.width;
        const boundingRectHeight = c.height;

        if (e && c) {
            var g = Math.max(a / e, b / boundingRectHeight),
                l = parseFloat(this.getLeft(elem));
            elem.style.left = 50 + a / e / g * (l - 50) + "%";
            var y = parseFloat(this.getTop(elem));
            elem.style.top = 50 + b / boundingRectHeight / g * (y - 50) + "%";
            l = Math.min(parseFloat(this.getWidth(elem)), 100 - l);
            elem.style.width = a / e / g * l + "%";
            a = Math.min(parseFloat(this.getHeight(elem)), 100 - y);
            elem.style.height = b / boundingRectHeight / g * a + "%";
        }
    }

    private getLeft(elem: HTMLElement): string {
        return elem.getAttribute("left") || "25%"
    }

    private getTop(elem: HTMLElement): string {
        return elem.getAttribute("top") || "25%"
    }

    private getWidth(elem: HTMLElement): string {
        return elem.getAttribute("width") || "50%"
    }

    private getHeight(elem: HTMLElement): string {
        return elem.getAttribute("height") || "50%"
    }
}
