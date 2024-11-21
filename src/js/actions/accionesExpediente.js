const URL_BASE = `/expediente`;

/**
 * Función que realiza una petición a la API para dar de alta un expediente
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function altaExpediente(form) {
    const ENDPOINT = '/altaExpediente';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que hace una petición a la API para buscar un expediente por su NSS
 * @param {String} nss NSS del expediente
 * @returns {Promise<Object | Error>} Objeto con la información del expediente
 */
export async function buscarExpediente(nss) {
    const ENDPOINT = `/buscarPorNSS/${nss}`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * Función que hace una petición a la API para obtener si el usuario realizó el último movimiento del tipo dado o no.
 * @param {'EXTRACCION' | 'INGRESO'} tipoMovimiento Tipo de movimiento
 * @param {String} nss NSS del expediente
 * @returns {Promise<Boolean | Error>} Retorna si el último movimiento del tipo dado lo realizó el usuario.
 */
export async function obtenerUltimoMovimiento(tipoMovimiento, nss) {
    const ENDPOINT = `/ultimoMovimiento/${tipoMovimiento}/${nss}`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que hace una petición a la API para obtener si el usuario ha sido el último en recibir un préstamo del expediente.
 * @param {String} nss NSS del expediente
 * @returns {Promise<Object | Error>} Objeto con el valor recibioPrestamo y prestamo, que contienen un bool y el préstamo.
 */
export async function obtenerUltimoPrestamo(nss) {
    const ENDPOINT = `/ultimoPrestamo/${nss}`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para ingresar un expediente
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function ingresarExpediente(form) {
    const ENDPOINT = '/movimiento/ingreso';

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para realizar una extracción
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function extraerExpediente(form) {
    const ENDPOINT = '/movimiento/extraccion';

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para realizar una baja
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function bajaExpediente(form) {
    const ENDPOINT = '/movimiento/baja';

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para realizar una transferencia
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function transferenciaExpediente(form) {
    const ENDPOINT = '/movimiento/transferencia';

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para realizar una supervisión
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function supervisionExpediente(form) {
    const ENDPOINT = '/movimiento/supervision';

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para ingresar una supervisión
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function ingresarSupervision(form) {
    const ENDPOINT = '/movimiento/ingresarSupervision';

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para obtener todas las supervisiones que se encuentren activas
 * @returns {Promise<Array<Object> | Error>} Array con las supervisiones
 */
export async function obtenerSupervisionesActivas() {
    const ENDPOINT = '/obtenerSupervisiones';

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para realizar un préstamo
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function prestarExpediente(form) {
    const ENDPOINT = '/movimiento/prestamo';

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para ingresar un préstamo
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function ingresarPrestamo(form) {
    const ENDPOINT = '/movimiento/ingresarPrestamo';

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        return response.json();
    } 
    catch (e) {
        return e;
    }
}