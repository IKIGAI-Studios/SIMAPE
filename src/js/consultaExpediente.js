import SnackBar from "./componentes/snackbar.js";
import { buscarExpediente } from "./actions/accionesExpediente.js";

const formBusquedaExpediente = document.getElementById('formBusquedaExpediente');
const inputNSS = document.getElementById('nssBusquedaExpediente');

const inputNombre = document.getElementById('nombreBusquedaExpediente');
const inputTipoPension = document.getElementById('tipoPensionBusquedaExpediente');
const inputAño = document.getElementById('añoBusquedaExpediente');
const inputEstatus = document.getElementById('estatusBusquedaExpediente')
const inputUbicacion = document.getElementById('ubicacionBusquedaExpediente');
const movimientosBusquedaExpediente = document.getElementById('movimientosBusquedaExpediente');

const btnIngresarExpediente = document.getElementById('btnIngresarExpediente');
const btnExtraerExpediente = document.getElementById('btnExtraerExpediente');

const snackbar = new SnackBar(document.getElementById('snackbar'));

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

        const response = await fetch('http://localhost:3000/expediente/movimiento', {
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

        const response = await fetch('http://localhost:3000/expediente/movimiento', {
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
}