// Load polyfills first
import "ts-polyfill/lib/es2017-object";
import { PlayerController } from "./PlayerController";
import { IS_CLIENT_SAFARI } from "./Utilities";

export class App {
  private static Singleton: App;

  private playerController?: PlayerController;

  public static get instance(): App {
    if (!App.Singleton) {
      App.Singleton = new App();
    }
    return App.Singleton;
  }

  public get controller(): PlayerController | undefined {
    return this.playerController;
  }

  public start(): void {
    if (!IS_CLIENT_SAFARI) App.registerServiceWorker();

    this.playerController = PlayerController.create();
    if (!this.playerController) throw new Error("playerController is undefined!");

    this.playerController.render().then(() => this.playerController?.show());
  }

  private static registerServiceWorker(): void {
    // This is for progressive web app (PWA) only
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./pwa-serviceworker.js").then(registration => {
        // Registration was successful
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      }, err => {
        // registration failed :(
        throw new Error(`ServiceWorker registration failed: ${err}`);
      });
    }
  }
}

// Bootstrap applicationq
window.onload = () => App.instance.start();
