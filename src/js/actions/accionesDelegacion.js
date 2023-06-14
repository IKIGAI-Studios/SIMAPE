const URL_BASE = `/delegacion`;

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