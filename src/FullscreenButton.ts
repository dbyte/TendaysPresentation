import { Button } from "./Exporter";

export class FullscreenButton extends Button {

    constructor() {
        super("goFullscreen", "assets/fullscreen-button.svg");
    }

    public initView(): void {
        const videoElem = this.elem as HTMLVideoElement;
        videoElem.src = this.buttonImageSource;
        this.elem.classList.add("button-fullscreen");

        /* Overlay elements should have the 'hidden' selector in their HTML
        as they may have wrong positions/sizes when entering the page.
        As soon as the page got loaded and we've rearranged things, we can
        switch them on. */
        this.elem.hidden = false;
    }

    protected addEventListeners(): void {
        const events = ["click"];
        events.map(e => { this.elem.addEventListener(e, this) });
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                console.log('click event called');
                this.toggle();
                break;
        }
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
        let target = document.getElementById('interactiveContainer');
        if (target === null) {
            const err = new Error("Could not get DOM element by ID 'interactiveContainer'.");
            alert(err.message);
            console.error(err.message);
            throw err;
        }

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