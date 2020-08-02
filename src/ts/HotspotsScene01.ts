import { HotspotsComponent } from "./Hotspots";
import { PlayButton } from "./PlayButton";

export class HotspotsScene01 extends HotspotsComponent {
  constructor(parentElemID: string, onClickPlayButtonCallback?: CallableFunction) {
    const COMPONENT_ID = "hotspots-scene-01-component";

    const children = [];
    children.push(PlayButton.create("playVideo01", "animation-01", COMPONENT_ID));
    children.push(PlayButton.create("playVideo02", "animation-02", COMPONENT_ID));
    children.push(PlayButton.create("playVideo03", "animation-03", COMPONENT_ID));
    children.forEach(btn => {
      const ref = btn; ref.onClickCallback = onClickPlayButtonCallback;
    });

    super(COMPONENT_ID, parentElemID, children);
  }

  public static create(parentElemID: string,
    onClickPlayButtonCallback?: CallableFunction): HotspotsScene01 {
    const instance = new HotspotsScene01(parentElemID, onClickPlayButtonCallback);
    return instance;
  }
}
