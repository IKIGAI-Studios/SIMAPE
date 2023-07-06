import { obtenerMiMatricula, buscarUsuario, cambiarPass } from "./actions/accionesUsuario.js";
import { ModalCambiarPass } from "./modalsOp.js";

const nombreBanner = document.querySelector('#nombreBanner');
const apellidoBanner = document.querySelector('#apellidoBanner');
const tipoUsuarioBanner = document.querySelector('#tipoUsuarioBanner');

const fotoPerfil = document.querySelector('#fotoPerfil');
const matriculaPerfil = document.querySelector('#matriculaPerfil');
const nombrePerfil = document.querySelector('#nombrePerfil');
const fechaRegistroPerfil = document.querySelector('#fechaRegistroPerfil');
const adscripcionPerfil = document.querySelector('#adscripcionPerfil');

const btnCambiarPass = document.querySelector('#btnCambiarPass');

const passActualCambio = document.querySelector('#passActualCambio');
const passNuevaCambio = document.querySelector('#passNuevaCambio');
const passNuevaConfCambio = document.querySelector('#passNuevaConfCambio');

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
        fotoPerfil.src = `/uploads/${usuario.foto}`;
    }
    matriculaPerfil.innerHTML = usuario.matricula;
    nombrePerfil.innerHTML = `${usuario.nombre} ${usuario.apellidos}`;
    fechaRegistroPerfil.innerHTML = usuario.fecha_registro;
    adscripcionPerfil.innerHTML = usuario.adscripcion;
}

btnCambiarPass.addEventListener('click', () => {
    ModalCambiarPass.enable();
});

formCambioPass.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (passNuevaCambio.value !== passNuevaConfCambio.value) {
        console.log('Las contraseñas no coinciden');
        return;
    }

    const form = new FormData();
    form.append('passActual', passActualCambio.value);
    form.append('passNuevo', passNuevaCambio.value);

    const res = await cambiarPass(form);

    console.log(res);
})

rellenarDatos();