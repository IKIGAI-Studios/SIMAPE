const formBusquedaExpediente = document.getElementById('formBusquedaExpediente');
const inputNSS = document.getElementById('nssBusquedaExpediente');

const inputNombre = document.getElementById('nombreBusquedaExpediente');
const inputTipoPension = document.getElementById('tipoPensionBusquedaExpediente');
const inputAño = document.getElementById('añoBusquedaExpediente');
const inputEstatus = document.getElementById('estatusBusquedaExpediente')
const inputUbicacion = document.getElementById('ubicacionBusquedaExpediente');

formBusquedaExpediente.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (inputNSS.value == '') return;

    try{
        const response = await fetch(`http://localhost:3000/expediente/buscarPorNSS/${inputNSS.value}`);
        const expedienteData = await response.json();

        if (expedienteData != 'Expediente no encontrado') {
            inputNombre.value = expedienteData.nombre;
            inputTipoPension.value = expedienteData.categoria;
            inputAño.value = expedienteData.año;
            inputEstatus.value = expedienteData.estatus == true ? 'Activo' : 'Inactivo';
            inputUbicacion.value = expedienteData.ubicacion;
        }

        console.log(expedienteData);
    }
    catch (e) {
        console.info(e);
    }
});