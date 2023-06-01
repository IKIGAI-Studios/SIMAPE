class Modal {
    constructor(HTMLmodal, HTMLbtnOpen, HTMLbtnClose) {
        this.HTMLmodal = HTMLmodal;
        this.HTMLbtnOpen = HTMLbtnOpen;
        this.HTMLbtnClose = HTMLbtnClose;
        this.active = false;

        this.HTMLbtnClose.addEventListener('click', () => {
            this.disable();
        });
        
        this.HTMLbtnOpen.addEventListener('click', () => {
            this.enable();
        });
    }

    enable = function () {
        this.active = true;
        this.HTMLmodal.style.display = "block";
    }

    disable = function () {
        this.active = false;
        this.HTMLmodal.style.display = "none";
    }
}

export default Modal;