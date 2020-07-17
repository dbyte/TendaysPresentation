class App {
    constructor() {
        if(! App.instance) {
            this.addGlobalEventListeners();
            App.instance = this;
        }
        return App.instance;
    }

    addGlobalEventListeners() {
        let events = ["load", "click"];
        events.map(e => { return window.addEventListener(e, this) });
    }

    // Called JS-internally by the added listeners!
    handleEvent(e) {
        switch(e.type) {
            case "click":
                console.log('document click event called');
                this.handleClick(e);
            break;
        }
    }

    handleClick(e) {
        let isButton = event.target.tagName.toLowerCase() == 'button';
        let isForcedClickable = event.target.classList.contains('clickable');
        let isClickAllowed = isButton || isForcedClickable;
        if (!isClickAllowed) return;

        event.preventDefault();
        let id = event.target.id;
        switch (id) {
            case 'goFullscreen':
                FULLSCREEN.toggle();
                break;
            default:
                alert('Error! id \"' + id + '\" is an unexpected switch case!')
        }
    }
}

class PlayButton {
    constructor(elemID, pathToVideo) {
        this.elemID = elemID;
        this.pathToVideo = pathToVideo;
        this.buttonImageSource = "assets/play-button-grey.svg";
        this.player = new Player();
        this.animationEndMethod = null;
        this.initDom();
        this.addEventListeners();
    }

    static get DomClassRegistry() {
        const DEFAULT = ["button-player"];
        return {
            DEFAULT: DEFAULT,
            ON_LOAD: DEFAULT.concat(["onLoadAnimate"]),
            ON_MOUSEOVER: DEFAULT.concat(["onMouseoverAnimate"]),
            ON_MOUSEOUT: DEFAULT.concat(["onMouseoutAnimate"]),
            ON_CLICK: DEFAULT.concat(["onClickAnimate"]),
        };
    }

    initDom() {
        let elem = this.getDomElem();
        elem.src = this.buttonImageSource;
    }

    addEventListeners() {
        let events = ["load", "click", "mouseover", "mouseout"];
        events.map(e => { return this.getDomElem().addEventListener(e, this) });
    }

    removeEventListeners() {
        let events = ["load", "click", "mouseover", "mouseout"];
        events.map(e => { return this.getDomElem().removeEventListener(e, this) });
    }

    // Called JS-internally by the added listeners!
    handleEvent(e) {
        switch(e.type) {
            case "load":
                console.log('load event called');
                this.animateOnLoad();
            break;
            case "click":
                console.log('click event called');
                this.player.start(this.pathToVideo);
            break;
            case "mouseover":
                console.log('mouseover event called');
                this.animateOnMouseover();
            break;
            case "mouseout":
                console.log('mouseout event called');
                this.animateOnMouseout();
            break;
        }
    }

    getDomElem() {
        return document.getElementById(this.elemID);
    }

    setDomClass(classes) {
        let elem = this.getDomElem();
        elem.removeAttribute("class");
        elem.classList.add(...classes);
    }

    animateOnLoad() {
        this.getDomElem().addEventListener("animationend", this.animationEndMethod = this.onLoadAnimationEnd.bind(this));
        this.setDomClass(PlayButton.DomClassRegistry.ON_LOAD);
    }
    onLoadAnimationEnd(event) {
        console.log('onAnimationEnd called');
        this.setDomClass(PlayButton.DomClassRegistry.DEFAULT);
        this.getDomElem().removeEventListener("animationend", this.animationEndMethod);
    }

    animateOnMouseover() {
        this.getDomElem().addEventListener("animationend", this.animationEndMethod = this.onMouseoverAnimationEnd.bind(this));
        this.setDomClass(PlayButton.DomClassRegistry.ON_MOUSEOVER);
    }
    onMouseoverAnimationEnd(event) {
        console.log('onMouseoverAnimationEnd called');
        this.getDomElem().removeEventListener("animationend", this.animationEndMethod);
    }

    animateOnMouseout() {
        this.getDomElem().addEventListener("animationend", this.animationEndMethod = this.onMouseoutAnimationEnd.bind(this));
        this.setDomClass(PlayButton.DomClassRegistry.ON_MOUSEOUT);
    }
    onMouseoutAnimationEnd(event) {
        console.log('onMouseoutAnimationEnd called');
        this.getDomElem().removeEventListener("animationend", this.animationEndMethod);
    }

    animateOnClick() {
        this.removeEventListeners();
        this.getDomElem().addEventListener("animationend", this.animationEndMethod = this.onClickAnimationEnd.bind(this));
        this.setDomClass(PlayButton.DomClassRegistry.ON_CLICK);
    }
    onClickAnimationEnd(event) {
        console.log('onClickAnimationEnd called');
        this.getDomElem().classList.add('invisible');
        this.getDomElem().removeEventListener("animationend", this.animationEndMethod);
    }
}

class Player {
    constructor() {
        this.video = document.getElementById("mainVideoTarget");
        this.homeScreenPosterFake = document.getElementById("homeScreenPosterFake");
    }

    start(pathToSource) {
        PLAYBUTTON_01.animateOnClick();
        PLAYBUTTON_02.animateOnClick();
        this.video.src = pathToSource;
        this.homeScreenPosterFake.classList.remove("visible");
        this.video.classList.remove("invisible");
        this.video.play();
    }
}

class Fullscreen {
    constructor() {
        if(! Fullscreen.instance) {
            Fullscreen.instance = this;
        }
        return Fullscreen.instance;
    }

    toggle() {
        let fullscreenElem = document.fullscreenElement || document.mozFullScreenElement ||
            document.webkitFullscreenElement || document.msFullscreenElement;

        if (fullscreenElem) {
            this.exit();
        } else {
            this.enter();
        }
    }

    enter() {
        // Source: https://davidwalsh.name/fullscreen
        let target = document.getElementById('interactiveContainer');

        if (target.requestFullscreen) {
            target.requestFullscreen();
        } else if (target.mozRequestFullScreen) {
            target.mozRequestFullScreen();
        } else if (target.webkitRequestFullscreen) {
            target.webkitRequestFullscreen();
        } else if (target.msRequestFullscreen) {
            target.msRequestFullscreen();
        }
    }

    exit() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

const APP = new App();
const FULLSCREEN = new Fullscreen();
const PLAYBUTTON_01 = new PlayButton("playVideo01", "../assets/animation-01.mp4");
const PLAYBUTTON_02 = new PlayButton("playVideo02", "../assets/animation-01.mp4");