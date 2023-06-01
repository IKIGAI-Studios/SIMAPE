import SnackBar from "./componentes/snackbar.js";

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

    try{
        const response = await fetch(`http://localhost:3000/expediente/buscarPorNSS/${inputNSS.value}`);
        const expedienteData = await response.json();
        console.log(response);
        console.log(expedienteData);

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        
        if (response.statusText == 'Expediente no encontrado') {
            throw new Error(response.statusText);
        }
        
        const { expedienteEncontrado, movimientos } = expedienteData;
        

        // Escribir los datos
        inputNombre.value = expedienteEncontrado.nombre;
        inputTipoPension.value = expedienteEncontrado.categoria;
        inputAño.value = expedienteEncontrado.año;
        inputEstatus.value = expedienteEncontrado.estatus == true ? 'Activo' : 'Inactivo';
        inputUbicacion.value = expedienteEncontrado.ubicacion;

        // Activar/Desactivar los botones
        resetValues();
        expedienteEncontrado.extraido == true ? btnIngresarExpediente.removeAttribute('disabled') : btnExtraerExpediente.removeAttribute('disabled');
        
        // Escribir los movimientos
        const movimientosText = movimientos.map((movimiento) => {
            return `FOLIO: ${movimiento.folio} | TIPO: ${movimiento.tipo_movimiento} | FECHA: ${movimiento.fecha.slice(0,10)}`;
        }).join('\n');

        movimientosBusquedaExpediente.value = movimientosText;
        snackbar.showMessage('Expediente encontrado');
    }
    catch (e) {
        snackbar.showMessage(e.message);
    }
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