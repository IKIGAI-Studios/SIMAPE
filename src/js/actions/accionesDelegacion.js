const URL_BASE = `/delegacion`;
/**
 * Función que hace una petición a la API, retorna todas las delegaciones registradas en la BD
 * @returns {Promise<Array<Object> | Error>} Array con objetos tipo delegación
 */
export async function obtenerDelegaciones() {
    const ENDPOINT = '/obtenerDelegaciones';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        const delegaciones = await response.json();
        return delegaciones;
    } 
    catch (e) {
        return e;
    }
}