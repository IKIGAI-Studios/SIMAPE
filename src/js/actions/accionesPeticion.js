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

export async function confirmarPeticionBaja(form) {
    const ENDPOINT = '/confirmarPeticionBaja';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
    
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

export async function confirmarPeticionTransferencia(form) {
    const ENDPOINT = '/confirmarPeticionTransferencia';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
    
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

export async function rechazarPeticion(form) {
    const ENDPOINT = '/rechazarPeticion';
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
    
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