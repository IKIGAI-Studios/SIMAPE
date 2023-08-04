import { obtenerMiMatricula, buscarUsuario } from "./actions/accionesUsuario.js";
const nombreBanner = document.querySelector('#nombreBanner');
const apellidoBanner = document.querySelector('#apellidoBanner');
const tipoUsuarioBanner = document.querySelector('#tipoUsuarioBanner');

export async function obtenerMisDatos() {
    const matricula = await obtenerMiMatricula();
    return await buscarUsuario(matricula);
}

async function rellenarDatos() {
    const usuario = await obtenerMisDatos();

    nombreBanner.innerHTML = usuario.nombre;
    apellidoBanner.innerHTML = usuario.apellidos;
    tipoUsuarioBanner.innerHTML = usuario.tipo_usuario;
}

rellenarDatos();