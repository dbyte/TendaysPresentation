export class SceneLoader {

    /**
     * Note that we tokenize viewName instead of parametrizing the path to the HTML file.
     * This is due to security reasons (path injection).
     * 
     * @param viewName Token for the view which we want to load into the DOM
     */
    public async load(viewName: string): Promise<void> {
        const context = this.getContextByViewName(viewName);
        const rootElem = document.getElementById(context.rootElemID) as HTMLElement

        const headers = new Headers();
        headers.append('Content-Type', 'text/html');
        await fetch(context.url, {
            method: 'GET',
            headers: headers
        })
        .then(response => response.text())
        .then(text => { rootElem.innerHTML = text; })
        .catch(err => { console.log(err); })
    }

    private getContextByViewName(viewName: string): {url: string, rootElemID: string} {
        let url: string;
        let rootElemID: string;

        switch (viewName) {
            case "hotspots-scene-01":
                url = "./views/hotspots-scene-01.html";
                rootElemID = "hotspots";
                break;
        
            default:
                url = ".";
                rootElemID = "";
                break;
        }

        return {url, rootElemID};
    }

}