const formBusquedaUsuario = document.getElementById('formBusquedaUsuario');
const matriculaUsuario = document.getElementById('matriculaUsuario');

const nombreUsuario = document.getElementById('nombreUsuario');
const adscripcionUsuario = document.getElementById('adscripcionUsuario');
const fechaRegUsuario = document.getElementById('fechaRegUsuario');
const estatusUsuario = document.getElementById('estatusUsuario');

const btnBusquedaUsuario = document.getElementById('btnBusquedaUsuario');

const btnAltaUsuario = document.getElementById('btnAltaUsuario');
const btnBajaUsuario = document.getElementById('btnBajaUsuario');
const btnCancelarUsuario = document.getElementById('btnCancelarUsuario');

btnBusquedaUsuario.addEventListener('click', async (e) => {
    e.preventDefault();

    // TODO: Validar campos
    if (matriculaUsuario.value == '') return;

    try{
        const response = await fetch(`http://localhost:3000/busquedaUsuario/${matriculaUsuario.value}`);
        const usuarioData = await response.json();

        if (usuarioData != 'Usuario no encontrado') {
            nombreUsuario.value = usuarioData.nombre +' '+ usuarioData.apellidos;
            adscripcionUsuario.value = usuarioData.adscripcion;
            fechaRegUsuario.value = usuarioData.fecha_registro;
            estatusUsuario.value = usuarioData.estatus == true ? 'Activo' : 'Inactivo';

            nombreUsuario.setAttribute('readonly', 'true');
            adscripcionUsuario.setAttribute('readonly', 'true');
            fechaRegUsuario.setAttribute('readonly', 'true');
        }
        console.log(usuarioData);
    }
    catch (e) {
        console.info(e);
    }
});

btnAltaUsuario.addEventListener('click', async (e) => {

    // TODO: Validar si los campos no están vacíos
    try{
        dataUsuario = {
            matricula: matriculaUsuario.value,
            nombre: nombreUsuario.value,
            adscripcion: adscripcionUsuario.value,

        };
        console.log(usuarioData);

        const response = await fetch(`http://localhost:3000/registrarUsuario`, {
            method: "POST",
            body: JSON.stringify(dataUsuario)
        });
        const usuarioData = await response.json();

        nombreUsuario.removeAttribute('readonly');
        adscripcionUsuario.removeAttribute('readonly');
        fechaRegUsuario.removeAttribute('readonly');

    }
    catch (e) {
        console.info(e);
    }

    
});

btnCancelarUsuario.addEventListener('click', (e) => {
    matriculaUsuario.value = '';
    nombreUsuario.value = '';
    adscripcionUsuario.value = '';
    fechaRegUsuario.value = '';
    estatusUsuario.value = '';

    nombreUsuario.removeAttribute('readonly');
    adscripcionUsuario.removeAttribute('readonly');
    fechaRegUsuario.removeAttribute('readonly');
});