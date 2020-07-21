import { PlayButton, FullscreenButton } from "./Exporter.js";

export class PlayerController {
    private playButtons: PlayButton[];
    public fullscreenButton: FullscreenButton;
    private video: HTMLVideoElement;
    private homeScreenPosterFake: HTMLVideoElement;

    constructor() {
        this.playButtons = [];
        this.fullscreenButton = new FullscreenButton();
        this.video = document.getElementById("mainVideoTarget") as HTMLVideoElement;
        this.homeScreenPosterFake = document.getElementById("homeScreenPosterFake") as HTMLVideoElement;
        this.setPlaybuttons();
    }

    private setPlaybuttons() {
        this.playButtons.push(new PlayButton("playVideo01", "../assets/animation-01.mp4"));
        this.playButtons.push(new PlayButton("playVideo02", "../assets/animation-01.mp4"));
    }

    public start(pathToSource: string): void {
        this.playButtons.forEach(button => { button.animateOnClick() })

        this.video.src = pathToSource;
        this.homeScreenPosterFake.classList.remove("visible");
        this.video.classList.remove("invisible");
        this.video.play();
    }
}