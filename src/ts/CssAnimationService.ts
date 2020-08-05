/**
 * These are the mappings to literal CSS definitions.
 */
export enum CssAnimationClass {
  ScaleIn = "scaleIn",
  ScaleOut = "scaleOut",
  FadeIn = "fadeIn",
  FadeOut = "fadeOut",
  OnMouseOver = "onMouseoverAnimate",
  OnMouseOut = "onMouseoutAnimate",
  SlideOutLeft = "slideOutLeft"
}

export interface CssAnimationOptions {
  callbackOnEnd?: CallableFunction,
  removeClassOnEnd?: boolean,
}

/**
 * Trigger CSS animations by manipulating HTMLDomElement-Classes
 */
export class CssAnimationService {
  private readonly element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public start(cssEvent: string, options?: CssAnimationOptions): void {
    const handleAnimationEnd = options?.callbackOnEnd || options?.removeClassOnEnd;

    // Wait for animation end and perform additional actions if requested.
    if (handleAnimationEnd) {
      const capturedClassname = cssEvent;
      this.element.addEventListener(
        "animationend", () => {
          if (options?.removeClassOnEnd) this.element.classList.remove(capturedClassname);
          if (options?.callbackOnEnd) options.callbackOnEnd();
        },
        { once: true }
      );
    }

    // Remove all animation classes of this element.
    this.removeAll();
    // Trigger animation start by adding class which is referenced in CSS
    this.element.classList.add(cssEvent);
  }

  public removeAll(): void {
    const animationsToRemove: string[] = Object.values(CssAnimationClass);
    this.element.classList.remove(...animationsToRemove);
  }
}
