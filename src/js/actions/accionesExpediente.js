const URL_BASE = `/expediente`;

/* *
    
*/
export async function buscarExpediente(nss) {
    const ENDPOINT = `/buscarPorNSS/${nss}`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error('No se pudo obtener el usuario');
        }

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}

export async function bajaExpediente(form) {
    const ENDPOINT = `/bajaExpediente`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error('Error');
        }

        const expedienteData = await response.json();
        return expedienteData;
    } 
    catch (e) {
        return e;
    }
}