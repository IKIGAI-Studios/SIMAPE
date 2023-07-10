import SnackBar from "./componentes/snackbar.js";

import { buscarExpediente, extraerExpediente, ingresarExpediente, obtenerUltimoMovimiento } from "./actions/accionesExpediente.js";

const formBusquedaExpediente = document.querySelector('#formBusquedaExpedienteConsulta');
const inputNSS = document.querySelector('#nssBusquedaExpedienteConsulta');

const inputNombre = document.querySelector('#nombreBusquedaExpedienteConsulta');
const inputTipoPension = document.querySelector('#tipoPensionBusquedaExpedienteConsulta');
const inputAño = document.querySelector('#añoBusquedaExpedienteConsulta');
const inputEstatus = document.querySelector('#estatusBusquedaExpedienteConsulta')
const inputUbicacion = document.querySelector('#ubicacionBusquedaExpedienteConsulta');
const movimientosBusquedaExpediente = document.querySelector('#movimientosBusquedaExpedienteConsulta');
const observacionesBusquedaExpediente = document.querySelector('#observacionesBusquedaExpedienteConsulta');

const btnIngresarExpediente = document.querySelector('#btnIngresarExpediente');
const btnExtraerExpediente = document.querySelector('#btnExtraerExpediente');
const btnPrestarExpediente = document.querySelector('#btnPrestarExpediente');

const formExtraerExpediente = document.querySelector('#formExtraerExpediente');
const formIngresarExpediente = document.querySelector('#formIngresarExpediente');
const formPrestarExpediente = document.querySelector('#formPrestarExpediente');

import { ModalIngresarExpediente, ModalExtraerExpediente, ModalPrestarExpediente } from "./modalsOp.js";

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

    const { expediente, movimientos } = expedienteData;

    // Escribir los datos
    inputNombre.value = expediente.nombre;
    inputTipoPension.value = expediente.categoria;
    inputAño.value = expediente.año;
    inputUbicacion.value = expediente.ubicacion;
    observacionesBusquedaExpediente.value = expediente.observaciones;

    resetValues();
    inputEstatus.value = 'Inactivo';

    if (expediente.estatus) {
        inputEstatus.value = 'Activo';

        // Activar/Desactivar los botones
        expediente.extraido ? btnIngresarExpediente.removeAttribute('disabled') : btnExtraerExpediente.removeAttribute('disabled');
    }

    // Verificar si se debe activar el boton préstamo
    if (expediente.extraido) {
        const ultimoMovimiento = await obtenerUltimoMovimiento(expediente.nss);
        const matricula = await 

        
        ultimoMovimiento.extraido ? btnIngresarExpediente.removeAttribute('disabled') : btnExtraerExpediente.removeAttribute('disabled');
    }

    // Escribir los movimientos
    const movimientosText = movimientos.map((movimiento) => {
        return `FOLIO: ${movimiento.folio} | TIPO: ${movimiento.tipo_movimiento} | FECHA: ${movimiento.fecha.slice(0,10)}`;
    }).join('\n');

    movimientosBusquedaExpediente.value = movimientosText;
    snackbar.showMessage('Expediente encontrado');
});

btnIngresarExpediente.addEventListener('click', async () => {
    ModalIngresarExpediente.enable();
});

btnExtraerExpediente.addEventListener('click', async () => {
    ModalExtraerExpediente.enable();
});

btnPrestarExpediente.addEventListener('click', async () => {
    ModalPrestarExpediente.enable();
});

formExtraerExpediente.addEventListener('submit', async(e) => {
    e.preventDefault();

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
    ModalExtraerExpediente.disable();
    snackbar.showMessage(data);
});

formIngresarExpediente.addEventListener('submit', async(e) => {
    e.preventDefault();

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
    ModalIngresarExpediente.disable();
    snackbar.showMessage(data);
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