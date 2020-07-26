export class VideoModel {
    private static readonly BASE_DIR = "assets/";
    private static readonly SMALLRES_FRAGMENT = "-small";
    private static readonly MEDIUMRES_FRAGMENT = "-medium";
    private static readonly LARGE_FRAGMENT = "-large";
    private static readonly FILE_SUFFIX = ".mp4";

    public constructor(private baseFilename: string) {
        this.baseFilename = baseFilename;
    }

    public getRelativePath(): string {
        return VideoModel.BASE_DIR.concat(this.getFinalFilename());
    }

    private getFinalFilename(): string {
        return this.baseFilename.concat(this.getCurrentResolutionFilenameFragment().concat(VideoModel.FILE_SUFFIX));
    }

    private getCurrentResolutionFilenameFragment(): string {
        if (window.matchMedia("(max-width: 812px)").matches) {
            return VideoModel.SMALLRES_FRAGMENT;

        } else if (window.matchMedia("(max-width: 1400px)").matches) {
            return VideoModel.MEDIUMRES_FRAGMENT;

        } else {
            return VideoModel.LARGE_FRAGMENT;
        }
    }
}