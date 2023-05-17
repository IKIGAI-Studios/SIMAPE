const formBusqueda = document.getElementById('formBusqueda');
const inputNSS = document.getElementById('nss');

const inputNombre = document.getElementById('nombre');
const inputTipoPension = document.getElementById('tipoPension');
const inputAño = document.getElementById('año');
const inputEstatus = document.getElementById('estatus')
const inputUbicacion = document.getElementById('ubicacion');

formBusqueda.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (inputNSS.value == '') return;

    try{
        const response = await fetch(`http://localhost:3000/buscarPorNSS/${inputNSS.value}`);
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