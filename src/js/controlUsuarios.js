import SnackBar from "./componentes/snackbar.js";
import { obtenerUsuarios, altaUsuario, bajaUsuario, recuperarUsuario, editarUsuario } from "./actions/accionesUsuario.js"
import { ModalAgregarUsuario, ModalEditarUsuario } from "./modalsAd.js";

const btnAgregarUsuario = document.querySelector('#btnAgregarUsuario');
const formEditarUsuario = document.getElementById('formEditarUsuario');

const formAltaUsuario = document.getElementById('formAltaUsuario');
const fotoAltaUsuario = document.getElementById('fotoAltaUsuario');
const fotoAltaUsuarioVista = document.getElementById('fotoAltaUsuarioVista');
const snackbar = new SnackBar(document.getElementById('snackbar'));

// Campos a validar para dar de alta a un usuario
const matricula = document.getElementById('matriculaAltaUsuario');
const nombre = document.getElementById('nombreAltaUsuario');
const apellidos = document.getElementById('apellidosAltaUsuario');
const usuario = document.getElementById('usuarioAltaUsuario');
const pass = document.getElementById('passAltaUsuario');

// Campos a validar para editar a un usuario
const nombreE = document.getElementById('nombreEditarUsuario');
const apellidosE  = document.getElementById('apellidosEditarUsuario');
const usuarioE = document.getElementById('usuarioEditarUsuario');
const passE = document.getElementById('passEditarUsuario');

// Expresión regular que admmite ñ y tildes
const regexNombre = /^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]+$/;

function validarCamposAgregar(){

    if(matricula.value.length != 8){
        snackbar.showError('La matrícula debe ser de 8 caracteres');
        return false;
       }  

       const valorNombre = nombre.value.trim();
       const valorApellidos = apellidos.value.trim();

       if(valorNombre.length>=48){
            snackbar.showError('Se rebasó el límite de caracteres para el nombre');
            return false;
       }

       if(valorApellidos.length>=48){
            snackbar.showError('Se rebasó el límite de caracteres para los apellidos');
            return false;
       }

       if(!regexNombre.test(valorNombre)) {
           snackbar.showError('El nombre solo puede contener letras y espacios');
           return false; 
       }

       if(!regexNombre.test(valorApellidos)) {
            snackbar.showError('Los apellidos solo pueden contener letras y espacios');
            return false; 
        }

        if(usuario.value.length < 5){
            snackbar.showError('El usuario debe ser mayor a 5 caracteres');
            return false; 
        }

        if(pass.value.length < 8){
            snackbar.showError('La contraseña debe ser mayor a 8 caracteres');
            return false; 
        }

        if(pass.value.length > 30){
            snackbar.showError('La contraseña no debe ser mayor a 30 caracteres');
            return false;     
        }

       return true;
}

function validarCamposEditar(){

    const valorNombreE = nombreE.value.trim();
    const valorApellidosE = apellidosE.value.trim();

    if(valorNombreE.length>=48){
        snackbar.showError('Se rebasó el límite de caracteres para el nombre');
        return false;
    }

    if(valorApellidosE.length>=48){
        snackbar.showError('Se rebasó el límite de caracteres para los apellidos');
        return false;
    }

    if(!regexNombre.test(valorNombreE)) {
        snackbar.showError('El nombre solo puede contener letras y espacios');
        return false; 
    }

    if(!regexNombre.test(valorApellidosE)) {
        snackbar.showError('Los apellidos solo pueden contener letras y espacios');
        return false; 
    }

    if(usuarioE.value.length < 5){
        snackbar.showError('El usuario debe ser mayor a 5 caracteres');
        return false; 
    }

    if(passE.value.length < 8){
        snackbar.showError('La contraseña debe ser mayor a 8 caracteres');
        return false; 
    }

    if(passE.value.length > 30){
        snackbar.showError('La contraseña no debe ser mayor a 30 caracteres');
        return false;     
    }

    return true;
}

formAltaUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarCamposAgregar()) {
        return; 
    }

    const form = new FormData(formAltaUsuario);
    const response = await altaUsuario(form);

    if ((typeof response) === Error) {
        snackbar.showError(response.message);
        return;
    }

    snackbar.showMessage(response);
    formAltaUsuario.reset();
    actualizarUsuarios();
    ModalAgregarUsuario.disable();
});

fotoAltaUsuario.addEventListener('change', (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
        // Crear una URL local para la imagen seleccionada
        const imageURL = URL.createObjectURL(selectedFile);
        
        // Actualizar el atributo src de la etiqueta <img> con la URL de la imagen
        fotoAltaUsuarioVista.src = imageURL;
    }
});

async function actualizarUsuarios() {
    const tablaUsuariosActivos = document.getElementById('tablaUsuariosActivos');
    const tablaUsuariosInactivos = document.getElementById('tablaUsuariosInactivos');
    const usuariosActivos = await obtenerUsuarios();
    const usuariosInactivos = await obtenerUsuarios('inactivos');

    // Limpiar la tabla de usuarios
    tablaUsuariosActivos.innerHTML = '';
    
    usuariosActivos.forEach(usuario => {
        // Hacer una fila
        const fila = crearFilaDeUsuario(usuario);

        // Botones
        const botones = document.createElement('td');

        const botonEditar = document.createElement('button');
        botonEditar.classList = 'btn-azul';
        botonEditar.setAttribute("id", "btnEditarUsuario");
        botonEditar.innerHTML = '<img src="/icons/pen.png" alt="EDITAR" style="width: 1rem;">'   
        botones.appendChild(botonEditar);

        const tooltipEditar = document.createElement('span');
        tooltipEditar.classList = 'tooltiptext';
        tooltipEditar.innerHTML = 'Editar' 
        botonEditar.appendChild(tooltipEditar);

        const botonBaja = document.createElement('button');
        botonBaja.classList = 'btn-rojo';
        botonBaja.innerHTML = '<img src="/icons/flecha_baja.png" alt="BAJA" style="width: 1rem;">'
        botones.appendChild(botonBaja);

        const tooltipBaja = document.createElement('span');
        tooltipBaja.classList = 'tooltiptext';
        tooltipBaja.innerHTML = 'Dar de baja' 
        botonBaja.appendChild(tooltipBaja);

        botonBaja.addEventListener('click', () => {
            handleBajaUsuario(usuario.matricula);
        });

        botonEditar.addEventListener('click', () => {
            handleEditarUsuario(usuario);
        });

        fila.appendChild(botones);
  
        // Agregar la fila a la tabla
        tablaUsuariosActivos.appendChild(fila);
    });

    // Limpiar la tabla de usuarios
    tablaUsuariosInactivos.innerHTML = '';

    usuariosInactivos.forEach(usuario => {
        // Hacer una fila
        const fila = crearFilaDeUsuario(usuario);

        // Botones
        const botones = document.createElement('td');

        const botonRecuperar = document.createElement('button');
        botonRecuperar.classList = 'btn-verde';
        botonRecuperar.innerHTML = '<img src="/icons/flecha_vuelta.png" alt="EDITAR" style="width: 1rem;">'
        botones.appendChild(botonRecuperar);

        const tooltipRecuperar = document.createElement('span');
        tooltipRecuperar.classList = 'tooltiptext';
        tooltipRecuperar.innerHTML = 'Reactivar' 
        botonRecuperar.appendChild(tooltipRecuperar);

        botonRecuperar.addEventListener('click', () => {
            handleRecuperarUsuario(usuario.matricula);
        });

        fila.appendChild(botones);
    
        // Agregar la fila a la tabla
        tablaUsuariosInactivos.appendChild(fila);
    });
}

function crearFilaDeUsuario(usuario) {
    // Crear la fila
    const fila = document.createElement('tr');
    
    // Agregar las celdas con la información del usuario
    const matricula = document.createElement('td');
    matricula.textContent = usuario.matricula;
    fila.appendChild(matricula);

    const nombre = document.createElement('td');
    nombre.textContent = `${usuario.nombre} ${usuario.apellidos}`;
    fila.appendChild(nombre);

    const adscripcion = document.createElement('td');
    adscripcion.textContent = usuario.adscripcion;
    fila.appendChild(adscripcion);
    
    const fecha_registro = document.createElement('td');
    fecha_registro.textContent = usuario.fecha_registro;
    fila.appendChild(fecha_registro);

    return fila;
}

function handleEditarUsuario(usuario) {
    document.querySelector('#matriculaEditarUsuario').value = usuario.matricula;
    console.log(usuario);
    ModalEditarUsuario.enable();
}

formEditarUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarCamposEditar()) {
        return; 
    }

    const form = new FormData(formEditarUsuario);

    const response = await editarUsuario(form);

    if (response instanceof Error) {
        snackbar.showError(response.message);
        return;
    }

    snackbar.showMessage(response);
    formEditarUsuario.reset();
    actualizarUsuarios();
    ModalEditarUsuario.disable();
});

async function handleBajaUsuario(matricula) {
    const form  = new FormData();
    form.append('matricula', matricula);

    const response = await bajaUsuario(form);

    if (response instanceof Error) {
        snackbar.showError(response.message);
        return;
    }

    snackbar.showMessage(response);
    actualizarUsuarios();
}

async function handleRecuperarUsuario(matricula) {
    const form  = new FormData();
    form.append('matricula', matricula);

    const response = await recuperarUsuario(form);
    
    if (response instanceof Error) {
        return snackbar.showError(response.message);
    }

    snackbar.showMessage(response);
    actualizarUsuarios();
}

actualizarUsuarios();

btnAgregarUsuario.addEventListener('click', () => {
    ModalAgregarUsuario.enable();
});