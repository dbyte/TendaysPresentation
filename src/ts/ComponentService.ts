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
     * @param componentId Token for the component which we want to load into the DOM
     */
    public async loadView(componentId: string, parentElem: HTMLElement): Promise<void> {
        const context = this.getContextByComponent(componentId);
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
            parentElem.append(this.htmlTextToDomFragment(responseText));
        }

    }

    private htmlTextToDomFragment(text: string): DocumentFragment {
        const htmlBody = new DOMParser().parseFromString(text, "text/html").body;
        const fragment = new DocumentFragment();
        htmlBody.childNodes.forEach((child) => { fragment.appendChild(child) });
        return fragment;
    }

    public removeView(elem: HTMLElement) {
        elem.remove();
    }

    private getContextByComponent(viewName: string): { url: string } {
        let url: string;

        switch (viewName) {
            case "hotspots-scene-01-component":
                url = "./views/hotspots-scene-01.html";
                break;

            case "main-navigation-component":
                url = "./views/main-navigation.html";
                break;

            case "loadingspinner-component":
                url = "./views/loadingspinner.html";
                break;

            case "fullscreen-button-component":
                url = "./views/fullscreen-button.html";
                break;

            case "home-button-component":
                url = "./views/home-button.html";
                break;

            default:
                url = ".";
                throw new Error(`Could not resolve viewName '${viewName}' to matching context.`);
        }

        return { url };
    }

}