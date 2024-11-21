const URL_BASE = `/usuario`;

/**
    Función que realiza una petición a la API para obtener la matrícula del usuario con sesión iniciada
    @returns {Promise<String | Error>} Matricula del usuario
*/
export async function obtenerMiMatricula() {
    const ENDPOINT = `/obtenerMiMatricula`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT);

        if (!response.ok) {
            throw new Error('No se pudo obtener el usuario');
        }

        const matricula = await response.json();
        return matricula;
    }
    catch (e) {
        return e;
    }
}

/**
 * Función que realiza una petición a la API para cambiar la contraseña del usuario con sesión actual
 * @param {FormData} form Formulario con la información
 * @returns {Promise<String | Error>} Respuesta del servidor
 */
export async function cambiarPass(form) {
    const ENDPOINT = `/cambiarPass`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        const matricula = await response.json();
        return matricula;
    }
    catch (e) {
        return e;
    }
}

/**
    Función que realiza una petición a la API para buscar un usuario a partir de su matricula.
    @param {String} matricula Matricula del usuario a buscar.
    @returns {Promise<Object | Error>} Objeto con la información del usuario
*/
export async function buscarUsuario(matricula) {
    const ENDPOINT = `/busquedaUsuario/${matricula}`;

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
    Función que realiza una petición a la API para buscar todos los usuarios que cumplan la condición.
    @param {String} estatus Opción para definir usuarios activos o 
    inactivos, por defecto serán usuarios activos.
    @returns {Promise<Array<Object> | Error>} Array con los usuarios.  
*/
export async function obtenerUsuarios(estatus = 'activos') {
    const ENDPOINT = `/obtenerUsuarios/${estatus}`;
    
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
    Función que realiza una petición a la API para crear un nuevo usuario y lo introduce en la base de datos.
    @param {FormData} form Formulario con los datos del usuario. Su formato es **multipart/form-data**
    @returns {Promise<String | Error>} Respuesta del servidor
*/
export async function altaUsuario(form) {
    const ENDPOINT = `/altaUsuario`;

    try {
        const response = await fetch(URL_BASE + ENDPOINT, {
            method: 'POST',
            body: form
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
    Función que realiza una petición a la API la cual establece el estatus de un usuario como inactivo (false).
    @param {FormData} form Formulario con los datos
    @returns {Promise<String | Error>} Respuesta del servidor
*/
export async function bajaUsuario(form) {
    const ENDPOINT = `/bajaUsuario`;
    
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
    Función que realiza una petición a la API la cual establece el estatus de un usuario como activo (true).
    @param {FormData} form Formulario con la información 
    @returns {Promise<String | Error>} Respuesta del servidor
*/
export async function recuperarUsuario(form) {
    const ENDPOINT = `/recuperarUsuario`;
    
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
    Función que realiza una petición a la API para editar un usuario en base a su matricula
    @param {FormData} form Formulario con la información
    @returns {Promise<String | Error>} Respuesta del servidor
*/
export async function editarUsuario(form) {
    const ENDPOINT = `/editarUsuario`;
    
    try {
        const response = await fetch( URL_BASE + ENDPOINT, { 
            method: 'POST', 
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(await response.json());
        }

        const usuarioData = await response.json();
        return usuarioData;
    }
    catch (e) {
        return e;
    }
}
