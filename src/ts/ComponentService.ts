export class ComponentService {
    private static Singleton: ComponentService;

    private constructor() { }

    public static get instance(): ComponentService {
        if (!ComponentService.Singleton) {
            ComponentService.Singleton = new ComponentService();
        }
        return ComponentService.Singleton;
    }

    /**
     * Note that we tokenize viewName instead of parametrizing the path to the HTML file.
     * This is due to security reasons (path injection).
     * 
     * @param viewName Token for the view which we want to load into the DOM
     */
    public async loadView(viewName: string): Promise<void> {
        const context = this.getContextByViewName(viewName);
        const rootElem = document.getElementById(context.rootElemID) as HTMLElement;

        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        await fetch(context.url, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.text())
            .then(text => { rootElem.innerHTML = text; })
            .catch(err => { throw new Error(`Error loading component: ${err}`); })
    }

    public removeView(viewName: string) {
        const context = this.getContextByViewName(viewName);
        const rootElem = document.getElementById(context.rootElemID) as HTMLElement;
        rootElem.innerHTML = "";
    }

    private getContextByViewName(viewName: string): { url: string, rootElemID: string } {
        let url: string;
        let rootElemID: string;

        switch (viewName) {
            case "hotspots-scene-01":
                url = "./views/hotspots-scene-01.html";
                rootElemID = "hotspots-container";
                break;

            case "main-navigation":
                url = "./views/main-navigation-bar.html";
                rootElemID = "main-navigation-container";
                break;

            case "loading-spinner":
                url = "./views/loading-spinner.html";
                rootElemID = "loading-spinner-container";
                break;

            default:
                url = ".";
                rootElemID = "";
                throw new Error(`Could not resolve viewName '${viewName}' to matching context.`);
        }

        return { url, rootElemID };
    }

}