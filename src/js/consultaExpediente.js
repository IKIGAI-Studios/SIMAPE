import SnackBar from "./componentes/snackbar.js";
import { buscarExpediente, extraerExpediente, ingresarExpediente } from "./actions/accionesExpediente.js";

const formBusquedaExpediente = document.querySelector('#formBusquedaExpediente');
const inputNSS = document.querySelector('#nssBusquedaExpediente');

const inputNombre = document.querySelector('#nombreBusquedaExpediente');
const inputTipoPension = document.querySelector('#tipoPensionBusquedaExpediente');
const inputAño = document.querySelector('#añoBusquedaExpediente');
const inputEstatus = document.querySelector('#estatusBusquedaExpediente')
const inputUbicacion = document.querySelector('#ubicacionBusquedaExpediente');
const movimientosBusquedaExpediente = document.querySelector('#movimientosBusquedaExpediente');
const observacionesBusquedaExpediente = document.querySelector('#observacionesBusquedaExpediente');

const btnIngresarExpediente = document.querySelector('#btnIngresarExpediente');
const btnExtraerExpediente = document.querySelector('#btnExtraerExpediente');

const snackbar = new SnackBar(document.querySelector('#snackbar'));

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

    const { expediente, movimientos } = expedienteData;

    // Escribir los datos
    inputNombre.value = expediente.nombre;
    inputTipoPension.value = expediente.categoria;
    inputAño.value = expediente.año;
    inputEstatus.value = expediente.estatus == true ? 'Activo' : 'Inactivo';
    inputUbicacion.value = expediente.ubicacion;
    observacionesBusquedaExpediente.value = expediente.observaciones;

    // Activar/Desactivar los botones
    resetValues();
    expediente.extraido == true ? btnIngresarExpediente.removeAttribute('disabled') : btnExtraerExpediente.removeAttribute('disabled');
    
    // Escribir los movimientos
    const movimientosText = movimientos.map((movimiento) => {
        return `FOLIO: ${movimiento.folio} | TIPO: ${movimiento.tipo_movimiento} | FECHA: ${movimiento.fecha.slice(0,10)}`;
    }).join('\n');

    movimientosBusquedaExpediente.value = movimientosText;
    snackbar.showMessage('Expediente encontrado');
});

btnExtraerExpediente.addEventListener('click', async () => {
    const form = new FormData();
    form.append('nss', inputNSS.value);
    form.append('motivo', 'prueba');
    
    const data = await extraerExpediente(form);

    if (data instanceof Error) {
        return snackbar.showError(data.message);
    }

    inputNSS.value = '';
    clearInputs();
    resetValues();
    snackbar.showMessage('Imprimiendo...');
});

btnIngresarExpediente.addEventListener('click', async () => {
    const form = new FormData();
    form.append('nss', inputNSS.value);
    form.append('motivo', 'prueba'); //TODO: Cambiar
    
    const data = await ingresarExpediente(form);

    if (data instanceof Error) {
        return snackbar.showError(data.message);
    }

    inputNSS.value = '';
    clearInputs();
    resetValues();
    snackbar.showMessage('Imprimiendo...');
});

function resetValues() {
    btnIngresarExpediente.setAttribute('disabled', '');
    btnExtraerExpediente.setAttribute('disabled', '');
}

function clearInputs() {
    inputNombre.value = '';
    inputTipoPension.value = '';
    inputAño.value = '';
    inputEstatus.value = '';
    inputUbicacion.value = '';
    movimientosBusquedaExpediente.value = '';
    observacionesBusquedaExpediente.value = '';
}