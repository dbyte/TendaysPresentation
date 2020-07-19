import { Fullscreen, PlayButton } from "./Exporter.js";

export class App {
    private static instance: App;

    constructor() {
        if (!App.instance) {
            this.addGlobalEventListeners();
            App.instance = this;
        }
        return App.instance;
    }

    private addGlobalEventListeners(): void {
        const events: string[] = ["load", "click"];
        events.map(e => { return window.addEventListener(e, this) });
    }

    // Called JS-internally by the added listeners!
    public handleEvent(e: Event): void {
        switch (e.type) {
            case "click":
                console.log('document click event called');
                this.handleClick(e);
                break;
        }
    }

    private handleClick(e: Event): void {
        let elem: HTMLElement;
        if (e.target instanceof HTMLElement) {
            elem = e.target;
        } else {
            return;
        }
        const isButton: boolean = elem.tagName.toLowerCase() == 'button';
        const isForcedClickable: boolean = elem.classList.contains('clickable');
        const isClickAllowed: boolean = isButton || isForcedClickable;
        if (!isClickAllowed) return;

        e.preventDefault();
        switch (elem.id) {
            case 'goFullscreen':
                FULLSCREEN.toggle();
                break;
            default:
                alert('Error! id \"' + elem.id + '\" is an unexpected switch case!')
        }
    }
}

// Bootstrap application
export const APP = new App();
export const FULLSCREEN = new Fullscreen();
export const PLAYBUTTON_01 = new PlayButton("playVideo01", "../assets/animation-01.mp4");
export const PLAYBUTTON_02 = new PlayButton("playVideo02", "../assets/animation-01.mp4");