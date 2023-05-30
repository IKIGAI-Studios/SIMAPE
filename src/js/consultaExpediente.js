import SnackBar from "./componentes/snackbar.js";

const formBusquedaExpediente = document.getElementById('formBusquedaExpediente');
const inputNSS = document.getElementById('nssBusquedaExpediente');

const inputNombre = document.getElementById('nombreBusquedaExpediente');
const inputTipoPension = document.getElementById('tipoPensionBusquedaExpediente');
const inputAño = document.getElementById('añoBusquedaExpediente');
const inputEstatus = document.getElementById('estatusBusquedaExpediente')
const inputUbicacion = document.getElementById('ubicacionBusquedaExpediente');

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

        if (!response.ok) {
            throw new Error(response.statusText);
        }
        
        if (response.statusText == 'Expediente no encontrado') {
            throw new Error(response.statusText);
        }
        
        inputNombre.value = expedienteData.nombre;
        inputTipoPension.value = expedienteData.categoria;
        inputAño.value = expedienteData.año;
        inputEstatus.value = expedienteData.estatus == true ? 'Activo' : 'Inactivo';
        inputUbicacion.value = expedienteData.ubicacion;
        

        console.log(expedienteData);
    }
    catch (e) {
        snackbar.showMessage(e.message);
    }
});

function clearInputs() {
    inputNombre.value = '';
    inputTipoPension.value = '';
    inputAño.value = '';
    inputEstatus.value = '';
    inputUbicacion.value = '';
}