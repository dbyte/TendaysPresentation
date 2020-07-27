import { HasHtmlElement } from "./Exporter";

export class Video implements HasHtmlElement {
    public elem: HTMLVideoElement;
    private baseFilename: string;
    private static readonly BASE_DIR = "assets/";
    private static readonly SMALLRES_FRAGMENT = "-small";
    private static readonly MEDIUMRES_FRAGMENT = "-medium";
    private static readonly LARGE_FRAGMENT = "-large";
    private static readonly FILE_SUFFIX = ".mp4";

    public constructor(baseFilename: string) {
        this.elem = document.getElementById("mainVideoTarget") as HTMLVideoElement;
        this.baseFilename = baseFilename;
    }

    public switchSource(baseFilename: string): void {
        this.baseFilename = baseFilename;
        const relativePath = this.getRelativePath();
        const absolutePathToNewSource = new URL(relativePath, document.baseURI).href;

        /* Only switch source if not yet set (which will reduce
        flicker when user wants to play same video as previous time) */
        if (this.elem.src !== absolutePathToNewSource) {
            this.elem.src = relativePath;
            console.log("Video source is now ".concat(relativePath));
        }
    }

    public jumpToStart() {
        this.elem.pause();
        this.elem.currentTime = 0;
    }

    public getRelativePath(): string {
        return Video.BASE_DIR.concat(this.getFinalFilename());
    }

    private getFinalFilename(): string {
        return this.baseFilename.concat(this.getCurrentResolutionFilenameFragment().concat(Video.FILE_SUFFIX));
    }

    private getCurrentResolutionFilenameFragment(): string {
        // iPhoneX landscape max:
        if (window.matchMedia("(max-width: 812px)").matches) {
            return Video.SMALLRES_FRAGMENT;

        // iPad Pro landscape max:
        } else if (window.matchMedia("(max-width: 1366px)").matches) {
            return Video.MEDIUMRES_FRAGMENT;

        } else {
            return Video.LARGE_FRAGMENT;
        }
    }
}