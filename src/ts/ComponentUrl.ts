export class ComponentUrl {
  private static readonly URL: Record<string, string> = {
    "video-component": "./views/video.html",
    "hotspots-scene-01-component": "./views/hotspots-scene-01.html",
    "main-navigation-component": "./views/main-navigation.html",
    "loadingspinner-component": "./views/loadingspinner.html",
    "info-button-component": "./views/info-button.html",
  };

  public static get(componentId: string): string | undefined {
    return ComponentUrl.URL[componentId];
  }
}
