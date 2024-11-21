import SnackBar from "./componentes/snackbar.js";
import { buscarExpediente, bajaExpediente } from "./actions/accionesExpediente.js";
import { obtenerMisDatos } from "./bannerUsuario.js"

const formBusquedaExpediente = document.querySelector('#formBusquedaExpedienteBaja');
const inputNSS = document.querySelector('#nssBusquedaExpedienteBaja');

const inputNombre = document.querySelector('#nombreBusquedaExpedienteBaja');
const inputTipoPension = document.querySelector('#tipoPensionBusquedaExpedienteBaja');
const inputDelegacion = document.querySelector('#delegacionBusquedaExpedienteBaja');
const inputUbicacion = document.querySelector('#ubicacionBusquedaExpedienteBaja');
const inputAño = document.querySelector('#añoBusquedaExpedienteBaja');
const inputMotivo = document.querySelector('#motivoBajaExpediente');

const btnBajaUsuario = document.querySelector('#btnBajaUsuario');
const btnBajaUsuarioCancelar = document.querySelector('#btnBajaUsuarioCancelar');

const snackbar = new SnackBar(document.querySelector('#snackbar'));

/**
 * Evento para limpiar al modificar el NSS
 */
inputNSS.addEventListener('keydown', (e) => {
    clearInputs();
    resetValues();
});

/**
 * Evento de búsqueda de expedientes
 */
formBusquedaExpediente.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (inputNSS.value === '') {
        snackbar.showMessage('Rellene los campos');
        return;
    }

    clearInputs();

    const expedienteData = await buscarExpediente(inputNSS.value);

    if (expedienteData instanceof Error) {
        return snackbar.showError(expedienteData.message);
    }

    const { expediente } = expedienteData;

    // Escribir los datos
    inputNombre.value = expediente.nombre;
    inputTipoPension.value = expediente.categoria;
    inputDelegacion.value = 'Pendiente';
    inputUbicacion.value = expediente.ubicacion;
    inputAño.value = expediente.año;

    resetValues();
    if (!expediente.estatus) {
        inputMotivo.value = 'Pendiente'; //expediente.motivo
        return snackbar.showMessage('El expediente ya ha sido dado de baja');
    }
    
    if (expediente.estatus) {
        btnBajaUsuario.removeAttribute('disabled');
    }

    btnBajaUsuarioCancelar.removeAttribute('disabled');
    inputMotivo.removeAttribute('readonly');
    snackbar.showMessage('Expediente encontrado');
});

/**
 * Evento de botón baja usuario
 */
btnBajaUsuario.addEventListener('click', async (e) => {
    const form = new FormData();
    form.append('nss', inputNSS.value);
    form.append('motivo', inputMotivo.value);

    const expedienteEliminado = await bajaExpediente(form);

    if (expedienteEliminado instanceof Error) {
        return snackbar.showError(expedienteEliminado.message);
    }

    snackbar.showMessage(expedienteEliminado);
    
    const usuario = await obtenerMisDatos();

    if (usuario.tipo_usuario === 'OPERATIVO') {
        const { cargarPeticiones } = await import("./estadoPeticiones.js");
        await cargarPeticiones();
        let s = io();
        s.emit('server:actualizarPeticionesAdministrador');
    }

    clearInputs();
    resetValues();
});

/**
 * Evento botón cancelar
 */
btnBajaUsuarioCancelar.addEventListener('click', (e) => {
    clearInputs();
    resetValues();
});

/**
 * Función para reiniciar valores por defecto
 */
function resetValues() {
    btnBajaUsuario.setAttribute('disabled', '');
    btnBajaUsuarioCancelar.setAttribute('disabled', '');
    inputMotivo.setAttribute('readonly', '');
}

/**
 * Función para borrar todos los inputs
 */
function clearInputs() {
    inputNombre.value = '';
    inputTipoPension.value = '';
    inputDelegacion.value = '';
    inputUbicacion.value = '';
    inputAño.value = '';
    inputMotivo.value = '';
}