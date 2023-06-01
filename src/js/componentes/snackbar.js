class SnackBar {
    constructor(HTMLelement) {
        this.HTMLelement = HTMLelement;
        this.text;
        this.active = false;
        this.time = 3000;
    }

    enable = function () {
        this.active = true;
        this.HTMLelement.classList.remove('invisible');
        this.HTMLelement.classList.add('show');
    };

    disable = function () {
        this.active = false;
        this.HTMLelement.classList.remove('show'); 
        this.HTMLelement.classList.add('hide');

        this.HTMLelement.addEventListener('animationend', () => {
            if (!this.active) {
                this.HTMLelement.classList.remove('hide'); 
                this.HTMLelement.classList.add('invisible');
            }
        });
    };

    showMessage = function(message) {
        this.HTMLelement.innerText = message;
        this.enable();
        setTimeout(() => {
            this.disable();
        }, this.time);
    }

    showError = function(message) {
        this.HTMLelement.classList.add('error');
        this.HTMLelement.innerText = message;
        this.enable();
        setTimeout(() => {
            this.disable();
            this.HTMLelement.classList.remove('error');
        }, this.time);
    }
};

export default SnackBar;