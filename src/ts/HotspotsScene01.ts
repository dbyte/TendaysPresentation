import { Component, PlayButton } from "./Exporter";

export class HotspotsScene01 extends Component<HotspotsScene01> {
    public readonly playButtons: PlayButton[];

    constructor(parentElemID: string) {
        super("hotspots-scene-01-component", parentElemID);

        this.playButtons = [];
        this.playButtons.push(PlayButton.create("playVideo01", "animation-01", this.componentId));
        this.playButtons.push(PlayButton.create("playVideo02", "animation-02", this.componentId));
        this.playButtons.push(PlayButton.create("playVideo03", "animation-03", this.componentId));
    }

    public static create(parentElemID: string): HotspotsScene01 {
        const instance = new HotspotsScene01(parentElemID);
        return instance;
    }

    public async render(): Promise<void> {
        // Set up my own component first!
        await super.render();
        
        // Now my children (their order matters for horiz. alignment, so no Promise.all!)
        for await (let button of this.playButtons) {
            button.render();
        }
    }

    public dispose(): void {
        this.playButtons.forEach(button => { button.dispose() });
        super.dispose();
    }

    public show(): void {
        this.playButtons.forEach(button => { button.show() });
    }

    public hide(): void {
        this.playButtons.forEach(button => { button.hide() });
    }
}