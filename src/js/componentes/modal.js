/**
 * Definición para Modal o ventana emergente
 */
class Modal {
    /**
     * 
     * @param {HTMLElement} HTMLmodal Elemento modal
     * @param {HTMLElement} HTMLbtnClose Elemento para cerrar la ventana
     */
    constructor(HTMLmodal, HTMLbtnClose) {
        this.HTMLmodal = HTMLmodal;
        this.HTMLbtnClose = HTMLbtnClose;
        this.active = false;

        // Añadir función de cierre por botón
        this.HTMLbtnClose.addEventListener('click', () => {
            this.disable();
        });
    }

    /**
     * Activar modal
     */
    enable() {
        this.active = true;
        this.HTMLmodal.style.display = "block";
    }

    /**
     * Desactivar modal
     */
    disable() {
        this.active = false;
        this.HTMLmodal.style.display = "none";
    }
}

export default Modal;