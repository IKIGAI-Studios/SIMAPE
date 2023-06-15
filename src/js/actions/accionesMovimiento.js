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