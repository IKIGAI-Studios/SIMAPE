import { obtenerMiMatricula, buscarUsuario } from "./actions/accionesUsuario.js";

const nombreBanner = document.querySelector('#nombreBanner');
const apellidoBanner = document.querySelector('#apellidoBanner');
const tipoUsuarioBanner = document.querySelector('#tipoUsuarioBanner');

const fotoPerfil = document.querySelector('#fotoPerfil');
const matriculaPerfil = document.querySelector('#matriculaPerfil');
const nombrePerfil = document.querySelector('#nombrePerfil');
const fechaRegistroPerfil = document.querySelector('#fechaRegistroPerfil');
const adscripcionPerfil = document.querySelector('#adscripcionPerfil');

async function obtenerMisDatos() {
    const matricula = await obtenerMiMatricula();
    return await buscarUsuario(matricula);
}

async function rellenarDatos() {
    const usuario = await obtenerMisDatos();

    nombreBanner.innerHTML = usuario.nombre;
    apellidoBanner.innerHTML = usuario.apellidos;
    tipoUsuarioBanner.innerHTML = usuario.tipo_usuario;

    if (usuario.foto) {
        fotoPerfil.src = `/public/imgs/${usuario.foto}`;
    }
    matriculaPerfil.innerHTML = usuario.matricula;
    nombrePerfil.innerHTML = `${usuario.nombre} ${usuario.apellidos}`;
    fechaRegistroPerfil.innerHTML = usuario.fecha_registro;
    adscripcionPerfil.innerHTML = usuario.adscripcion;
}

rellenarDatos();