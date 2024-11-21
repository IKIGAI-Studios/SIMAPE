/**
 * Definición de un elemento de una sidebar
 */
class SidebarItem {
    /**
     * 
     * @param {String} titleHint Título para la pestaña
     * @param {HTMLElement} HTMLitem Botón de la sidebar
     * @param {HTMLElement} HTMLcontent Contenido desplegable
     */
    constructor(titleHint, HTMLitem, HTMLcontent) {
        this.titleHint = titleHint;
        this.HTMLitem = HTMLitem;
        this.HTMLcontent = HTMLcontent;
        this.active = false;

        /**
         * Activar el elemento
         */
        this.enable = function () {
            this.active = true;
            this.HTMLitem.classList.add('activo');
            this.HTMLcontent.classList.add('activo');
        };

        /**
         * Desactivar el elemento
         */
        this.disable = function () {
            this.active = false;
            this.HTMLitem.classList.remove('activo');
            this.HTMLcontent.classList.remove('activo');
        };
    }
};

export default SidebarItem;