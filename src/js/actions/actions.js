const URL_BASE = 'http://localhost:3000/';

/**
    Obtiene un array con todos los usuarios.
    @param estatus Opción para definir usuarios activos o 
    inactivos, por defecto serán usuarios activos.
    @returns Un arreglo con los usuarios.  
*/
export async function obtenerUsuarios(estatus = 'activos') {
    const ENDPOINT = `usuario/obtenerUsuarios/${estatus}`;
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
        const usuariosData = await response.json();
    
        if (!response.ok) {
            throw new Error('No se pudieron obtener los usuarios');
        }

        return usuariosData;
    }
    catch (e) {
        return e;
    }

}

/**
    Crea un nuevo usuario y lo introduce en la base de datos.
    @param form Se requiere para enviar todos los datos del usuario.
    @returns Datos del usuario que se ha introducido.
*/
export async function altaUsuario(form) {
    const ENDPOINT = `usuario/altaUsuario`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
    
        if (!response.ok) {
            throw new Error(response.statusText);
        }
    
        const usuarioData = await response.json();
    
        return usuarioData;
    } 
    catch (e) {
        return e;
    }
}

/**
    Establece el estatus de un usuario como inactivo (false).
    @param form Se requiere enviar un formulario con la matricula.
    @returns Datos del usuario que se ha actualizado.
*/
export async function bajaUsuario(form) {
    const ENDPOINT = `usuario/bajaUsuario`;
    
    try {
        const response = await fetch( URL_BASE + ENDPOINT, { 
            method: 'POST', 
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const usuarioData = await response.json();

        return usuarioData;
    }
    catch (e) {
        return e;
    }
}

/**
    Establece el estatus de un usuario como activo (true).
    @param form Se requiere enviar un formulario con la matricula.
    @returns Datos del usuario que se ha actualizado.
*/
export async function recuperarUsuario(form) {
    const ENDPOINT = `usuario/recuperarUsuario`;
    
    try {
        const response = await fetch( URL_BASE + ENDPOINT, { 
            method: 'POST', 
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const usuarioData = await response.json();

        return usuarioData;
    }
    catch (e) {
        return e;
    }
}


