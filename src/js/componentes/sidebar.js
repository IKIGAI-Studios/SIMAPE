import Dropdown from "./dropdown.js";
import SidebarItem from "./sidebarItem.js";

/**
 * Definición de Sidebar que contiene SidebarItems
 */
class Sidebar {
    /**
     * 
     * @param {HTMLElement>} HTMLhint Título de Item
     * @param {Dropdown} dropdown Dropdown con elementos 
     */
    constructor(HTMLhint, dropdown) {
        this.sidebarItems = [];
        this.index = 0;
        this.HTMLhint = HTMLhint;
        this.dropdown = dropdown;

        /**
         * Crear un dropdown a partir de una lista de nodos HTML
         * @param {Array<String>} HTMLhints Arreglo con los títulos
         * @param {Array<SidebarItem>} HTMLitems Arreglo con los items de la lista
         * @param {Array<HTMLElement>} HTMLcontents Arreglo con los contenidos de cada uno de los elementos 
         */
        this.createFromNodeList = function (HTMLhints, HTMLitems, HTMLcontents) {
            for (let i = 0; i < HTMLhints.length; i++) {
                const newSidebarItem = new SidebarItem(HTMLhints[i], HTMLitems[i], HTMLcontents[i]);
                this.sidebarItems.push(newSidebarItem);
            }

            this.sidebarItems.forEach((sidebarItem, index) => {
                sidebarItem.HTMLitem.addEventListener('click', () => {
                    this.sidebarItems.forEach((sidebarItem) => {
                        sidebarItem.disable();
                    });
                    sidebarItem.enable();
                    HTMLhint.innerText = sidebarItem.titleHint;

                    if (sidebarItem.HTMLitem.classList.contains('sub')) {
                        this.dropdown.disable();
                    }
                });
            });
        };

        /**
         * Retorna la cantidad de elementos en la barra
         * @returns {Number} Cantidad de elementos en la lista
         */
        this.lenght = function () {
            return this.sidebarItems.lenght;
        };
    }
};

export default Sidebar;