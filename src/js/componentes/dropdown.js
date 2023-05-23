class Dropdown {
    constructor(HTMLelement) {
        this.HTMLelement = HTMLelement;
        this.active = false;

        this.enable = function () {
            this.active = true;
            HTMLelement.classList.add('active');
        };

        this.disable = function () {
            this.active = false;
            HTMLelement.classList.remove('active');
        };

        this.HTMLelement.addEventListener('click', () => {
            this.active ? this.disable() : this.enable();
        });
    }
};

export default Dropdown;