import { Button, getElementByUniqueClassName } from "./Exporter";

export class FullscreenButton extends Button {
    constructor(parentElemId: string) {
        super("fullscreen-button-component", "assets/fullscreen-button.svg", parentElemId);
    }

    public static create(parentElemID: string): FullscreenButton {
        const instance = new FullscreenButton(parentElemID);
        return instance;
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                this.toggle();
                break;
        }
        e.stopPropagation();
    }

    public toggle(): void {
        const isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);

        if (isInFullScreen) {
            this.exit();
        } else {
            this.enter();
        }
    }

    private enter(): void {
        // Source: https://davidwalsh.name/fullscreen
        let target = getElementByUniqueClassName('interactiveContainer');

        if (target.requestFullscreen) {
            target.requestFullscreen();
        } else if (target.mozRequestFullscreen) { /* Firefox */
            target.mozRequestFullscreen();
        } else if (target.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            target.webkitRequestFullscreen();
        } else if (target.msRequestFullscreen) { /* IE/Edge */
            target.msRequestFullscreen();
        }
    }

    private exit(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

/* Missing typescript interfaces for fullscreen mode. This is for
typescript only (compiler would complain without that) and has 
no impact for distributed code. */
declare global {
    interface Document {
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
        webkitFullscreenElement?: Element;
    }

    interface HTMLElement {
        msRequestFullscreen?: () => Promise<void>;
        mozRequestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
    }
}