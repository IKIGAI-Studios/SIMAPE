/**
 * Definición de un botón con estado de carga.
 */
export default class Button {
    /**
     * 
     * @param {HTMLElement} HTMLelement 
     * @param {String} text 
     * @param {'NORMAL' | 'LOADING'} state 
     */
    constructor(HTMLelement, text, state = 'NORMAL') {
        this.HTMLelement = HTMLelement;
        this.text = text

        this.setState(state);
    }

    /**
     * Cambiar el estado del botón
     * @param {'NORMAL' | 'LOADING'} state
     */
    setState(state) {
        this.state = state

        if (state === 'NORMAL') {
            this.HTMLelement.innerHTML = `<span>${this.text}</span>`
            //this.HTMLelement.innerText = this.text;
        }
        else if (state === 'LOADING') {
            this.HTMLelement.innerHTML = `<span style="visibility:hidden">${this.text}</span> <span class="loader"></span>`;
        }
    }
}