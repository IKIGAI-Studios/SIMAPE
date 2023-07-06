import SnackBar from "./componentes/snackbar.js";
import { obtenerUsuarios, altaUsuario, bajaUsuario, recuperarUsuario } from "./actions/accionesUsuario.js"
import { ModalAgregarUsuario } from "./modalsAd.js";
import { ModalEditarUsuario } from "./modalsAd.js";

const formAltaUsuario = document.getElementById('formAltaUsuario');
const snackbar = new SnackBar(document.getElementById('snackbar'));


formAltaUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

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
    ModalEditarUsuario.disable();
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
    ModalEditarUsuario.enable();
}

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