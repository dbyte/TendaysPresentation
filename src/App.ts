// Load polyfills first
import "../../node_modules/ts-polyfill/lib/es2017-object";

import { PlayerController } from "./Exporter.js";

export class App {
    private static Singleton: App;
    private playerController?: PlayerController;

    private constructor() {}

    public static get instance(): App {
        if (!App.Singleton) {
            App.Singleton = new App();
        }
        return App.Singleton;
    }

    public get controller(): PlayerController | undefined {
        return this.playerController;
    }

    public start() {
        this.addGlobalEventListeners();
        this.playerController = new PlayerController();
    }

    private addGlobalEventListeners(): void {
        const events: string[] = ["load", "click"];
        events.map(e => { window.addEventListener(e, this) });
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
                this.controller?.fullscreenButton.toggle();
                break;
            default:
                alert('Error! id \"' + elem.id + '\" is an unexpected switch case!')
        }
    }
}

// Bootstrap application
App.instance.start();
