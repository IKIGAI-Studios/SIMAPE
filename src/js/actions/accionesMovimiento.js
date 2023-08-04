const URL_BASE = `/movimiento`;

export async function obtenerMisMovimientos() {
    const ENDPOINT = '/obtenerMisMovimientos';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
        const movimientos = await response.json();

        if (!response.ok) {
            throw new Error(movimientos.message);
        }
    
        return movimientos;
    } 
    catch (e) {
        console.log(e);
        return e;
    }
}

/**
 * Función para búsqueda de movimiento por folio
 * @param {Number} folio Folio del movimiento a buscar
 * @returns {Object | Error} Objeto con la información del movimiento
 */
export async function buscarPorFolio(folio) {
    const ENDPOINT = `/buscarPorFolio/${folio}`;
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
        const movimientoData = await response.json();

        if (!response.ok) {
            throw new Error(movimientoData.message);
        }
    
        return movimientoData;
    } 
    catch (e) {
        console.log(e);
        return e;
    }
}