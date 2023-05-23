class SnackBar {
    constructor(HTMLelement) {
        this.HTMLelement = HTMLelement;
        this.text;
        this.active = false;
        this.time = 3000;

        this.enable = function () {
            this.active = true;
            this.HTMLelement.classList.remove('invisible');
            this.HTMLelement.classList.add('show');
        };

        this.disable = function () {
            this.active = false;
            this.HTMLelement.classList.remove('show'); 
            this.HTMLelement.classList.add('hide');

            HTMLelement.addEventListener('animationend', () => {
                if (!this.active) {
                    this.HTMLelement.classList.remove('hide'); 
                    this.HTMLelement.classList.add('invisible');
                }
            });
        };

        this.showMessage = function(message) {
            HTMLelement.innerText = message;
            this.enable();
            setTimeout(() => {
                this.disable();
            }, this.time);
        }
    }
};

export default SnackBar;