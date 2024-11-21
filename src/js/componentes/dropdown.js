/**
 * Definición de un elemento lista desplegable
 */
class Dropdown {
    /**
     * 
     * @param {HTMLElement} HTMLelement Elemento HTML del dropdown
     */
    constructor(HTMLelement) {
        this.HTMLelement = HTMLelement;
        this.active = false;

        /**
         * Activar dropdown
         */
        this.enable = function () {
            this.active = true;
            HTMLelement.classList.add('active');
        };

        /**
         * Desactivar dropdown
         */
        this.disable = function () {
            this.active = false;
            HTMLelement.classList.remove('active');
        };

        // Definir evento de clic
        this.HTMLelement.addEventListener('click', () => {
            this.active ? this.disable() : this.enable();
        });
    }
};

export default Dropdown;