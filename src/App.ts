// Load polyfills first
import "ts-polyfill/lib/es2017-object";

import { PlayerController } from "./Exporter";

export class App {
    private static Singleton: App;
    private playerController?: PlayerController;

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
            this.playerController = new PlayerController();
            this.playerController?.bindView()
            .then(() => { this.playerController?.show() });
            
            console.log("PlayerController View initialized.");
        });
    }
}

// Bootstrap application
App.instance.start();
