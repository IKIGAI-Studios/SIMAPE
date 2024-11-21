import { cambiarPass } from "./actions/accionesUsuario.js";
import { obtenerMisDatos } from "./bannerUsuario.js"
import { ModalCambiarPass } from "./modalsOp.js";
import Button from "./componentes/button.js";
import SnackBar from "./componentes/snackbar.js";
import { testPrinter, testPrint } from "./actions/accionesImpresion.js"

const fotoPerfil = document.querySelector('#fotoPerfil');
const matriculaPerfil = document.querySelector('#matriculaPerfil');
const nombrePerfil = document.querySelector('#nombrePerfil');
const fechaRegistroPerfil = document.querySelector('#fechaRegistroPerfil');
const adscripcionPerfil = document.querySelector('#adscripcionPerfil');

const btnCambiarPass = document.querySelector('#btnCambiarPass');

const passActualCambio = document.querySelector('#passActualCambio');
const passNuevaCambio = document.querySelector('#passNuevaCambio');
const passNuevaConfCambio = document.querySelector('#passNuevaConfCambio');

const snackbar = new SnackBar(document.querySelector('#snackbar'));

// Botón de prueba de impresora
const btnProbarImpresora = new Button(
    document.querySelector('#btnProbarImpresora'), 
    'PROBAR IMPRESORA'
);

// Botón de impresión de prueba
const btnImprimirPrueba = new Button(
    document.querySelector('#btnImprimirPrueba'), 
    'IMPRIMIR PRUEBA'
);

/**
 * Función para rellenar los datos del usuario en la pestaña perfil
 */
async function rellenarDatos() {
    const usuario = await obtenerMisDatos();

    if (usuario.foto) {
        const fotoPath = `/uploads/${usuario.foto}`;

        try {
            const foto = await fetch(fotoPath);

            if (!foto.ok) {
                throw new Error();
            }
            fotoPerfil.src = `/uploads/${usuario.foto}`;
        }
        catch (error) {
            snackbar.showError('La foto del usuario no existe');
        }
    }

    matriculaPerfil.innerHTML = usuario.matricula;
    nombrePerfil.innerHTML = `${usuario.nombre} ${usuario.apellidos}`;
    fechaRegistroPerfil.innerHTML = usuario.fecha_registro;
    adscripcionPerfil.innerHTML = usuario.adscripcion;
}

/**
 * Evento de clic de botón cambiar contraseña
 */
btnCambiarPass.addEventListener('click', () => {
    ModalCambiarPass.enable();
});

/**
 * Evento para cambiar contraseña
 */
formCambioPass.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Verificar si las contraseñas son iguales
    if (passNuevaCambio.value !== passNuevaConfCambio.value) {
        return snackbar.showError('Las contraseñas no coinciden');
    }

    // Enviar los datos
    const form = new FormData();
    form.append('passActual', passActualCambio.value);
    form.append('passNuevo', passNuevaCambio.value);

    const res = await cambiarPass(form);

    snackbar.showMessage(res);
    ModalCambiarPass.disable();
})

rellenarDatos();

/**
 * Evento de clic para el botón probar impresora
 */
btnProbarImpresora.HTMLelement.addEventListener('click', async () => {
    btnProbarImpresora.setState('LOADING');

    const printerRes = await testPrinter();
    
    snackbar.showMessage(printerRes);
    btnProbarImpresora.setState('NORMAL');
});

/**
 * Evento de clic para el botón imprimir prueba
 */
btnImprimirPrueba.HTMLelement.addEventListener('click', async () => {
    btnImprimirPrueba.setState('LOADING');

    const printerRes = await testPrint();
    
    snackbar.showMessage(printerRes);
    btnImprimirPrueba.setState('NORMAL');
});