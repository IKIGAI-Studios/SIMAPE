const URL_BASE = `/peticion`;

export async function obtenerPeticiones() {
    const ENDPOINT = '/obtenerPeticiones';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        const peticiones = await response.json();
        return peticiones;
    } 
    catch (e) {
        return e;
    }
}

export async function obtenerMisPeticiones() {
    const ENDPOINT = '/obtenerMisPeticiones';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
    
        if (!response.ok) {
            throw new Error(await response.json());
        }
    
        const peticiones = await response.json();
        return peticiones;
    } 
    catch (e) {
        return e;
    }
}