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
        this.playerController = new PlayerController();
        window.onload = (() => { 
            this.playerController?.initView() });
            console.log("PlayerController View initialized.")
    }
}

// Bootstrap application
App.instance.start();
