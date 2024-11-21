const URL_BASE = `http://localhost:3001`;

/**
 * Función que realiza una petición a la API del servidor de impresión para determinar si se encuentra activo
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function testServer() {
    const ENDPOINT = '/testServer';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error(await response.json());
        }
     
        return await response.json();
    }
    catch (e) {
        return new Error("El servidor no se ha iniciado correctamente");
    }
}

/**
 * Función que realiza una petición a la API del servidor de impresión para determinar si se encuentra conectada la impresora
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function testPrinter() {
    const ENDPOINT = '/testPrinter';
    
    try {
        const testServerRes = await testServer();

        if (testServerRes instanceof Error) {
            throw testServerRes;
        }

        const response = await fetch(URL_BASE + ENDPOINT);
        console.log(response);

        if (!response.ok) {
            throw new Error(await response.json());
        }
     
        return await response.json();
    }
    catch (e) {
        console.error(e);
        return e;
    }
}

/**
 * Función que realiza una petición a la API del servidor de impresión para imprimir un ticket de prueba
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function testPrint() {
    const ENDPOINT = '/testPrint';
    
    try {
        const testServerRes = await testServer();

        if (testServerRes instanceof Error) {
            throw testServerRes;
        }

        const response = await fetch(URL_BASE + ENDPOINT);
        console.log(response);

        if (!response.ok) {
            throw new Error(await response.json());
        }
     
        return await response.json();
    }
    catch (e) {
        console.error(e);
        return e;
    }
}

/**
 * Función que realiza una petición a la API del servidor de impresión para imprimir un ticket
 * @param {Object} ticket Objeto con la información del ticket
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function imprimir(ticket) {
    const ENDPOINT = '/imprimir';

    try {
        const testServerRes = await testServer();

        if (testServerRes instanceof Error) {
            throw testServerRes;
        }

        console.log(ticket);

        const response = await fetch(URL_BASE + ENDPOINT, {
            body: JSON.stringify(ticket),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        return await response.json();
    } 
    catch (e) {
        return e;
    }
}