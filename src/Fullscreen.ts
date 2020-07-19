export class Fullscreen {
    private static instance: Fullscreen;

    constructor() {
        if (!Fullscreen.instance) {
            Fullscreen.instance = this;
        }
        return Fullscreen.instance;
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
