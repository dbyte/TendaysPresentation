import { PLAYBUTTON_01, PLAYBUTTON_02 } from "./Exporter.js";

export class Player {
    video: HTMLVideoElement;
    homeScreenPosterFake: HTMLVideoElement;

    constructor() {
        this.video = document.getElementById("mainVideoTarget") as HTMLVideoElement;
        this.homeScreenPosterFake = document.getElementById("homeScreenPosterFake") as HTMLVideoElement;
    }

    public start(pathToSource: string): void {
        PLAYBUTTON_01.animateOnClick();
        PLAYBUTTON_02.animateOnClick();
        this.video.src = pathToSource;
        this.homeScreenPosterFake.classList.remove("visible");
        this.video.classList.remove("invisible");
        this.video.play();
    }
}