import SnackBar from "./componentes/snackbar.js";
import { buscarExpediente } from "./actions/accionesExpediente.js";

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
    try {
        const form = new FormData();
        form.append('nss', inputNSS.value);
        form.append('tipo_movimiento', 'EXTRACCION');
        form.append('motivo', 'prueba');

        const response = await fetch('/expediente/movimiento', {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) throw new Error('Error');

        inputNSS.value = '';
        clearInputs();
        resetValues();
        snackbar.showMessage('Imprimiendo...');
    } 
    catch (e) {
        console.log(e);
    }
});

btnIngresarExpediente.addEventListener('click', async () => {
    try {
        const form = new FormData();
        form.append('nss', inputNSS.value);
        form.append('tipo_movimiento', 'INGRESO');
        form.append('motivo', 'prueba');

        const response = await fetch('/expediente/movimiento', {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) throw new Error('Error');

        inputNSS.value = '';
        clearInputs();
        resetValues();
        snackbar.showMessage('Imprimiendo...');
    } 
    catch (e) {
        console.log(e);
    }
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