class Modal {
    constructor(HTMLmodal, HTMLbtnClose) {
        this.HTMLmodal = HTMLmodal;
        this.HTMLbtnClose = HTMLbtnClose;
        this.active = false;

        this.HTMLbtnClose.addEventListener('click', () => {
            this.disable();
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