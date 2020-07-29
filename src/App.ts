// Load polyfills first
import "ts-polyfill/lib/es2017-object";

import { PlayerController } from "./Exporter";

export class App {
    private static Singleton: App;
    private playerController?: PlayerController;
    public static readonly IS_CLIENT_SAFARI =
        navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') == -1 &&
        navigator.userAgent.indexOf('FxiOS') == -1;

    private constructor() { }

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
        window.onload = (() => {
            if (!App.IS_CLIENT_SAFARI) this.registerServiceWorker();
            this.playerController = new PlayerController();
            this.playerController?.bindView()
                .then(() => { this.playerController?.show() });

            console.log("PlayerController View initialized.");
        });
    }

    private registerServiceWorker() {
        // This is for progressive web app (PWA) only
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./pwa-serviceworker.js').then((registration) => {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, (err) => {
                // registration failed :(
                throw new Error(`ServiceWorker registration failed: ${err}`);
            });
        }
    }
}

// Bootstrap application
App.instance.start();
