import env from '../utils/utils.js'

const URL_BASE = `${env.URL_BASE}usuario/`;

/**
    Busca un usuario a partir de su matricula.
    @param matricula Matricula del usuario a buscar.
    @returns Un objeto con el usuario encontrado
*/
export async function buscarUsuario(matricula) {
    const ENDPOINT = `busquedaUsuario/${matricula}`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error('No se pudo obtener el usuario');
        }

        const usuarioData = await response.json();
        return usuarioData;
    }
    catch (e) {
        return e;
    }
}

/**
    Busca todos los usuarios que cumplan la condición.
    @param estatus Opción para definir usuarios activos o 
    inactivos, por defecto serán usuarios activos.
    @returns Un arreglo con los usuarios.  
*/
export async function obtenerUsuarios(estatus = 'activos') {
    const ENDPOINT = `obtenerUsuarios/${estatus}`;
    
    try {
        const response = await fetch(URL_BASE + ENDPOINT);
        
        if (!response.ok) {
            throw new Error('No se pudieron obtener los usuarios');
        }

        const usuariosData = await response.json();
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
    const ENDPOINT = `altaUsuario`;

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
    const ENDPOINT = `bajaUsuario`;
    
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
    const ENDPOINT = `recuperarUsuario`;
    
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


