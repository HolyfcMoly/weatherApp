export default class SwitchPadding {
    constructor() {
        this.media = window.matchMedia("(max-width: 1023px)");
        this.block = document.querySelector(".left_info");
    }
    handleScreenChange(media) {
        if (media.matches) {
            this.switchPadding();
        }
    }

    switchPadding() {
        if (this.block.classList.contains("px-10")) {
            this.block.classList.remove("px-10");
            this.block.classList.add("px-5");
        } else {
            this.block.classList.remove("px-5");
            this.block.classList.add("px-10");
        }
    }

    init() {
        this.handleScreenChange(this.media);
        this.media.addEventListener("change", () =>
            this.handleScreenChange(this.media)
        );
    }
}