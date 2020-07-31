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
        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        let response;
        let responseText;

        try {
            response = await fetch(context.url, {
                method: 'GET',
                headers: headers
            });
            if (!response) throw new Error(
                `Unable to load component. No response for request url ${context.url}`);

            if (!response.ok) throw new Error(
                `Unable to load component. Response status = ${response.status}`);

        } catch (error) {
            return Promise.reject(error);
        }

        if (response && response.ok) {
            responseText = await response.text();
            this.getPlaceholderElement(viewName).append(this.htmlTextToDomFragment(responseText));
        }

    }

    private htmlTextToDomFragment(text: string): DocumentFragment {
        const htmlBody = new DOMParser().parseFromString(text, "text/html").body;
        const fragment = new DocumentFragment();
        htmlBody.childNodes.forEach((child) => { fragment.appendChild(child) });
        return fragment;
    }

    public removeView(viewName: string) {
        this.getPlaceholderElement(viewName).innerHTML = "";
    }

    private getPlaceholderElement(viewName: string): HTMLElement {
        const context = this.getContextByViewName(viewName);
        const rootElem = document.getElementById(context.rootElemID) as HTMLElement;

        if (!rootElem) throw new Error(
            `No root element found in DOM for element-id '${context.rootElemID}'!`);

        return rootElem;
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

            case "fullscreen-button":
                url = "./views/fullscreen-button.html";
                rootElemID = "navbar";
                break;

            case "home-button":
                url = "./views/home-button.html";
                rootElemID = "navbar";
                break;

            default:
                url = ".";
                rootElemID = "";
                throw new Error(`Could not resolve viewName '${viewName}' to matching context.`);
        }

        return { url, rootElemID };
    }

}