const URL_BASE = `/peticion`;

/**
 * Función que realiza una petición a la API para obtener todas las peticiones realizadas
 * @returns {Promise<Array<Object> | Error>} Array de objetos con la información de las peticiones
 */
export async function obtenerPeticiones() {
    const ENDPOINT = '/obtenerPeticiones';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        const peticiones = await response.json();
        return peticiones;
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para obtener todas las peticiones realizadas por el usuario
 * @returns {Promise<Array<Object> | Error>} Array de objetos con la información de las peticiones
 */
export async function obtenerMisPeticiones() {
    const ENDPOINT = '/obtenerMisPeticiones';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        const peticiones = await response.json();
        return peticiones;
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para confirmar una petición de tipo baja
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function confirmarPeticionBaja(form) {
    const ENDPOINT = '/confirmarPeticionBaja';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        const peticiones = await response.json();
        return peticiones;
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para confirmar una petición de tipo transferencia
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function confirmarPeticionTransferencia(form) {
    const ENDPOINT = '/confirmarPeticionTransferencia';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        const peticiones = await response.json();
        return peticiones;
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para rechazar una petición
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function rechazarPeticion(form) {
    const ENDPOINT = '/rechazarPeticion';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        const peticiones = await response.json();
        return peticiones;
    } 
    catch (e) {
        return e;
    }
}