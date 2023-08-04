import Usuario from "../models/usuarioModel.js";

/**
 * Función para validar un usuario dada su matrícula
 * @param {string} matricula Matricula del usuario a validar
 * @returns {Promise<boolean>} Representa si el usuario es válido o no
 */
export async function validarUsuario(matricula) {
    return new Promise(async (resolve, reject) => {
        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });
        
        resolve(usuarioVal.existe ? true : false);
    });
}