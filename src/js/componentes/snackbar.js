/**
 * Definición de elemento para cargar notificaciones
 */
class SnackBar {
    /**
     * 
     * @param {HTMLElement} HTMLelement Elemento Snackbar
     */
    constructor(HTMLelement) {
        this.HTMLelement = HTMLelement;
        this.text;
        this.active = false;
        this.time = 3000;
    }
    /**
     * Activar Snackbar
     */
    enable() {
        this.active = true;
        this.HTMLelement.classList.remove('invisible');
        this.HTMLelement.classList.add('show');
    };

    /**
     * Desactivar Snackbar
     */
    disable() {
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

    /**
     * Función para mostrar un mensaje
     * @param {String} message Mensaje a mostrar
     */
    showMessage(message) {
        this.HTMLelement.innerText = message;
        this.enable();
        setTimeout(() => {
            this.disable();
        }, this.time);
    }

    /**
     * Función para mostrar un error
     * @param {String} message Mensaje a mostrar
     */
    showError(message) {
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