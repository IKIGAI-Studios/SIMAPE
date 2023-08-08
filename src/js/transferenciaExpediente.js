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


inputNSS.addEventListener('keydown', (e) => {
    clearInputs();
    resetValues();
});

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

btnTransferenciaExpedienteCancelar.addEventListener('click', (e) => {
    clearInputs();
    resetValues();
});

function resetValues() {
    btnTransferenciaExpediente.setAttribute('disabled', '');
    btnTransferenciaExpedienteCancelar.setAttribute('disabled', '');
    listDelegaciones.setAttribute('disabled', '');
    inputMotivo.setAttribute('readonly', '');
}

function clearInputs() {
    inputNombre.value = '';
    inputTipoPension.value = '';
    inputDelegacion.value = '';
    inputUbicacion.value = '';
    inputMotivo.value = '';
}

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