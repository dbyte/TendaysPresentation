export class OverlayHandler {
  private elements: HTMLElement[];

  constructor(elements: HTMLElement[]) {
    this.elements = elements;
  }

  /**
  This is the core for resizing/repositioning overlay elements on
  pixel-exact defined hotspots of a vertically centered video source. */
  public repositionOnVideo(videoObject: HTMLVideoElement): void {
    this.elements.forEach(elem => { this.repositionSingleElem(elem, videoObject); });
  }

  private repositionSingleElem(htmlElement: HTMLElement, videoObject: HTMLVideoElement): void {
    const elem = htmlElement;

    let a = videoObject.videoWidth || 1920;
    const b = videoObject.videoHeight || 1080;
    const c = videoObject.getBoundingClientRect();
    const d = c.width;
    const e = c.height;

    if (d && c) {
      const g = Math.max(a / d, b / e);
      let l = parseFloat(this.getLeft(elem));
      elem.style.left = `${50 + (a / d / g) * (l - 50)}%`;
      const y = parseFloat(this.getTop(elem));
      elem.style.top = `${50 + (b / e / g) * (y - 50)}%`;
      l = Math.min(parseFloat(this.getWidth(elem)), 100 - l);
      elem.style.width = `${(a / d / g) * l}%`;
      a = Math.min(parseFloat(this.getHeight(elem)), 100 - y);
      elem.style.height = `${(b / e / g) * a}%`;
    }
  }

  private getLeft(elem: HTMLElement): string {
    return elem.getAttribute("left") || "25%";
  }

  private getTop(elem: HTMLElement): string {
    return elem.getAttribute("top") || "25%";
  }

  private getWidth(elem: HTMLElement): string {
    return elem.getAttribute("width") || "50%";
  }

  private getHeight(elem: HTMLElement): string {
    return elem.getAttribute("height") || "50%";
  }
}
