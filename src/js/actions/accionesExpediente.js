

/* *
    
*/
export async function buscarExpediente(nss) {
    const ENDPOINT = `/expediente/buscarPorNSS/${nss}`;

    try {
        const response = await fetch(ENDPOINT);

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