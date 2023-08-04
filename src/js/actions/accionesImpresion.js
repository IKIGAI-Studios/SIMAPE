const URL_BASE = `http://localhost:3001`;

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