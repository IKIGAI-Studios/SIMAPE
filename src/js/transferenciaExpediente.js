import SnackBar from "./componentes/snackbar.js";
import { buscarExpediente, transferenciaExpediente } from "./actions/accionesExpediente.js";
import { obtenerDelegaciones } from "./actions/accionesDelegacion.js";
import { obtenerMisDatos } from "./bannerUsuario.js"

const formBusquedaExpediente = document.querySelector('#formBusquedaExpedienteTransferencia');
const inputNSS = document.querySelector('#nssBusquedaExpedienteTransferencia');

const inputNombre = document.querySelector('#nombreBusquedaExpedienteTransferencia');
const inputTipoPension = document.querySelector('#tipoPensionBusquedaExpedienteTransferencia');
const inputDelegacion = document.querySelector('#delegacionBusquedaExpedienteTransferencia');
const inputUbicacion = document.querySelector('#ubicacionBusquedaExpedienteTransferencia');
const inputMotivo = document.querySelector('#motivoTransferenciaExpediente');

const listDelegaciones = document.querySelector('#delegacionTransfenciaExpediente');

const btnTransferenciaExpediente = document.querySelector('#btnTransferenciaExpediente');
const btnTransferenciaExpedienteCancelar = document.querySelector('#btnTransferenciaExpedienteCancelar');

const snackbar = new SnackBar(document.querySelector('#snackbar'));

/**
 * Evento para limpiar al modificar el NSS
 */
inputNSS.addEventListener('keydown', (e) => {
    clearInputs();
    resetValues();
});

/**
 * Evento que se ejecuta al buscar un expediente
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

    resetValues();
    if (!expediente.estatus) {
        inputMotivo.value = 'Pendiente'; //expediente.motivo
        return snackbar.showMessage('El expediente ya ha sido dado de baja');
    }
    
    if (expediente.estatus) {
        btnTransferenciaExpediente.removeAttribute('disabled');
    }

    btnTransferenciaExpedienteCancelar.removeAttribute('disabled');
    listDelegaciones.removeAttribute('disabled');
    inputMotivo.removeAttribute('readonly');
    snackbar.showMessage('Expediente encontrado');
});

/**
 * Evento que se ejecuta al transferir un expediente
 */
btnTransferenciaExpediente.addEventListener('click', async (e) => {
    const form = new FormData();
    form.append('nss', inputNSS.value);
    form.append('del_destino', listDelegaciones.value);
    form.append('motivo', inputMotivo.value);

    const expedienteTransferido = await transferenciaExpediente(form);

    if (expedienteTransferido instanceof Error) {
        return snackbar.showError(expedienteTransferido.message);
    }

    snackbar.showMessage(expedienteTransferido);

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
 * Evento que se ejecuta al cancelar una transferencia
 */
btnTransferenciaExpedienteCancelar.addEventListener('click', (e) => {
    clearInputs();
    resetValues();
});

/**
 * Función para reiniciar los valores por defecto
 */
function resetValues() {
    btnTransferenciaExpediente.setAttribute('disabled', '');
    btnTransferenciaExpedienteCancelar.setAttribute('disabled', '');
    listDelegaciones.setAttribute('disabled', '');
    inputMotivo.setAttribute('readonly', '');
}

/**
 * Función para limpiar los campos
 */
function clearInputs() {
    inputNombre.value = '';
    inputTipoPension.value = '';
    inputDelegacion.value = '';
    inputUbicacion.value = '';
    inputMotivo.value = '';
}

/**
 * Función para llenar la lista desplegable de delegaciones
 */
async function listDelegacionesFill() {
    const delegaciones = await obtenerDelegaciones();
    
    delegaciones.forEach((delegacion) => {
        const option = document.createElement('option');
        option.value = delegacion.id_delegacion;
        option.innerHTML = `${delegacion.n_delegacion} ${delegacion.nom_delegacion} - ${delegacion.n_subdelegacion} ${delegacion.nom_subdelegacion}`;
        listDelegaciones.appendChild(option);
    });
}

listDelegacionesFill();