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

/**
 * Función para obtener TODOS los movimientos de un expediente
 * @param {Date} fechaInicio Nss del expediente buscar
 * @returns {Object | Error} Objeto con la información de todos los movimientos
 */
export async function obtenerMovimientosFecha(fechaInicio, fechaFin, categoria, tipos) {
    const ENDPOINT = `/obtenerMovimientosFecha`;
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT + 
            `?fechaInicio=${fechaInicio.toJSON()}` +
            `&fechaFin=${fechaFin.toJSON()}` +
            `&categoria=${categoria}` +
            `&tipos=${tipos.toString()}`
        );
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

/**
 * Función para obtener TODOS los movimientos de un expediente
 * @param {Number} nss Nss del expediente buscar
 * @returns {Object | Error} Objeto con la información de todos los movimientos
 */
export async function obtenerMovimientosExpediente(nss) {
    const ENDPOINT = `/obtenerMovimientosExpediente/${nss}`;
    
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

/**
 * Función para obtener TODOS los movimientos de un usuario
 * @param {String} matricula Matricula del usuario
 * @returns {Object | Error} Objeto con la información de todos los movimientos
 */
export async function obtenerMovimientosUsuario(matricula) {
    const ENDPOINT = `/obtenerMovimientosUsuario/${matricula}`;
    
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