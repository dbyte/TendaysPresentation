export class FullscreenButton {
    private readonly elemID: string;
    private readonly buttonImageSource: string;

    constructor() {
        this.elemID = "goFullscreen";
        this.buttonImageSource = "assets/fullscreen-button.svg";

        this.initView();
        this.addEventListeners();
    }

    private initView(): void {
        let elem: HTMLVideoElement = this.getDomElem() as HTMLVideoElement;
        elem.src = this.buttonImageSource;
        elem.classList.add("button-fullscreen");
    }

    private getDomElem(): HTMLElement | never {
        const elem = document.getElementById(this.elemID);
        if (elem != null) {
            return elem;
        } else {
            const err = new Error("Could not get DOM element by ID.");
            alert(err.message);
            console.error(err.message);
            throw err;
        }
    }

    private addEventListeners(): void {
        const events = ["click"];
        events.map(e => { this.getDomElem().addEventListener(e, this) });
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
        let fullscreenElem = document.fullscreenElement;

        if (fullscreenElem) {
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
        }
    }

    private exit(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
