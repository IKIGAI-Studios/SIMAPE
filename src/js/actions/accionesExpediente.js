const URL_BASE = `/expediente`;

/* *
    
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
    
        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

export async function buscarExpediente(nss) {
    const ENDPOINT = `/buscarPorNSS/${nss}`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error(await response.json());
        }

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
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

        const expedienteData = await response.json();
        return expedienteData;
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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

export async function obtenerSupervisionesActivas() {
    const ENDPOINT = '/obtenerSupervisiones';

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error(await response.json());
        }

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

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

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}