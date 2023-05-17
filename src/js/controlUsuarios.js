const formBusquedaUsuario = document.getElementById('formBusquedaUsuario');
const matriculaUsuario = document.getElementById('matriculaUsuario');

const nombreUsuario = document.getElementById('nombreUsuario');
const adscripcionUsuario = document.getElementById('adscripcionUsuario');
const fechaRegUsuario = document.getElementById('fechaRegUsuario');
const estatusUsuario = document.getElementById('estatusUsuario');

const btnBusquedaUsuario = document.getElementById('btnBusquedaUsuario');

btnBusquedaUsuario.addEventListener('click', async (e) => {
    e.preventDefault();

    if (matriculaUsuario.value == '') return;

    try{
        const response = await fetch(`http://localhost:3000/busquedaUsuario/${matriculaUsuario.value}`);
        const usuarioData = await response.json();

        if (usuarioData != 'Usuario no encontrado') {
            nombreUsuario.value = usuarioData.nombre +' '+ usuarioData.apellidos;
            adscripcionUsuario.value = usuarioData.adscripcion;
            fechaRegUsuario.value = usuarioData.fecha_registro;
            estatusUsuario.value = usuarioData.estatus == true ? 'Activo' : 'Inactivo';
        }

        console.log(usuarioData);
    }
    catch (e) {
        console.info(e);
    }
});