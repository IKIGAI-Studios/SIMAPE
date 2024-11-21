import { obtenerMiMatricula, buscarUsuario } from "./actions/accionesUsuario.js";
const nombreBanner = document.querySelector('#nombreBanner');
const apellidoBanner = document.querySelector('#apellidoBanner');
const tipoUsuarioBanner = document.querySelector('#tipoUsuarioBanner');

/**
 * Función para obtener los datos del usuario actual
 * @returns {Promise<Object | Error>} Objeto con los datos del usuario actual
 */
export async function obtenerMisDatos() {
    const matricula = await obtenerMiMatricula();
    return await buscarUsuario(matricula);
}

/**
 * Función para rellenar los datos del usuario en la página
 */
async function rellenarDatos() {
    const usuario = await obtenerMisDatos();

    nombreBanner.innerHTML = usuario.nombre;
    apellidoBanner.innerHTML = usuario.apellidos;
    tipoUsuarioBanner.innerHTML = usuario.tipo_usuario;
}

rellenarDatos();