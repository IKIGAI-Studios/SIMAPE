import SnackBar from "./componentes/snackbar.js";
import { buscarExpediente, extraerExpediente, ingresarExpediente, obtenerUltimoMovimiento, prestarExpediente, obtenerUltimoPrestamo, ingresarPrestamo } from "./actions/accionesExpediente.js";
import { obtenerUsuarios } from "./actions/accionesUsuario.js";

const formBusquedaExpediente = document.querySelector('#formBusquedaExpedienteConsulta');
const inputNSS = document.querySelector('#nssBusquedaExpedienteConsulta');

const inputNombre = document.querySelector('#nombreBusquedaExpedienteConsulta');
const inputTipoPension = document.querySelector('#tipoPensionBusquedaExpedienteConsulta');
const inputAño = document.querySelector('#añoBusquedaExpedienteConsulta');
const inputEstatus = document.querySelector('#estatusBusquedaExpedienteConsulta')
const inputUbicacion = document.querySelector('#ubicacionBusquedaExpedienteConsulta');
const movimientosBusquedaExpediente = document.querySelector('#movimientosBusquedaExpediente');
const observacionesBusquedaExpediente = document.querySelector('#observacionesBusquedaExpedienteConsulta');

const btnIngresarExpediente = document.querySelector('#btnIngresarExpediente');
const btnExtraerExpediente = document.querySelector('#btnExtraerExpediente');
const btnPrestarExpediente = document.querySelector('#btnPrestarExpediente');
const btnDevolverExpediente = document.querySelector('#btnDevolverExpediente');

const formExtraerExpediente = document.querySelector('#formExtraerExpediente');
const formIngresarExpediente = document.querySelector('#formIngresarExpediente');
const formPrestarExpediente = document.querySelector('#formPrestarExpediente');

const usuariosPrestarExpediente = document.querySelector('#usuariosPrestarExpediente');

import { ModalIngresarExpediente, ModalExtraerExpediente, ModalPrestarExpediente } from "./modalsOp.js";

const snackbar = new SnackBar(document.querySelector('#snackbar'));

inputNSS.addEventListener('keydown', (e) => {
    clearInputs();
    resetValues();
});

formBusquedaExpediente.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (inputNSS.value === '') {
        snackbar.showMessage('Rellene los campos');
        return;
    }

    clearInputs();

    const expedienteData = await buscarExpediente(inputNSS.value);

    if (expedienteData instanceof Error) {
        return snackbar.showError(expedienteData.message);
    }

    const { expediente, movimientos } = expedienteData;

    movimientosBusquedaExpediente.innerHTML = '';

    // Escribir los datos
    inputNombre.value = expediente.nombre;
    inputTipoPension.value = expediente.categoria;
    inputAño.value = expediente.año;
    inputUbicacion.value = expediente.ubicacion;
    observacionesBusquedaExpediente.value = expediente.observaciones;

    resetValues();
    inputEstatus.value = 'Inactivo';

    if (expediente.estatus) {
        inputEstatus.value = 'Activo';
        console.log(expediente);

        // Verificar si se debe activar el boton préstamo

        if (expediente.estado === 'EXTRAIDO') {
            const ultimoMovimiento = await obtenerUltimoMovimiento('EXTRACCION', expediente.nss);

            if (ultimoMovimiento) {
                console.log('extraido por mi');
                btnPrestarExpediente.style.display = "block";
                btnIngresarExpediente.removeAttribute('disabled');
            }
            else {
                console.log('lo sacó alguien más');
            }
        }
        else if (expediente.estado === 'PRESTADO') {
            const ultimoPrestamo = await obtenerUltimoPrestamo(expediente.nss);
            const ultimoMovimiento = await obtenerUltimoMovimiento('EXTRACCION', expediente.nss);

            if (ultimoPrestamo.recibioPrestamo) {
                console.log('me lo prestaron a mi');
                btnDevolverExpediente.style.display = "block";
            }
            else if (ultimoMovimiento && !ultimoPrestamo.recibioPrestamo) {
                console.log('lo presté yo');
            }
        }
        else if (expediente.estado === 'SUPERVISADO') {
            console.log('está siendo supervisado');
        }
        else {
            console.log('está en almacen');
            btnExtraerExpediente.removeAttribute('disabled');
        }
    }

    // Escribir los movimientos
    movimientos.forEach(movimiento => {
        const fila = document.createElement('tr');

        const folio = document.createElement('td');
        folio.innerText = movimiento.folio;
        
        const tipo_movimiento = document.createElement('td');
        tipo_movimiento.innerText = movimiento.tipo_movimiento;

        const fechaCell = document.createElement('td');
        const fecha = new Date(movimiento.fecha);
        fechaCell.innerText = fecha.toLocaleString();

        const nombre = document.createElement('td');
        nombre.innerText = `${movimiento.nombre} ${movimiento.apellidos}`;

        fila.appendChild(folio);
        fila.appendChild(tipo_movimiento);
        fila.appendChild(fechaCell);
        fila.appendChild(nombre);

        movimientosBusquedaExpediente.appendChild(fila)
    });

    snackbar.showMessage('Expediente encontrado');
});

btnIngresarExpediente.addEventListener('click', async () => {
    ModalIngresarExpediente.enable();
});

btnExtraerExpediente.addEventListener('click', async () => {
    ModalExtraerExpediente.enable();
});

btnPrestarExpediente.addEventListener('click', async () => {
    ModalPrestarExpediente.enable();
});

formExtraerExpediente.addEventListener('submit', async(e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('nss', inputNSS.value);
    form.append('motivo', 'prueba');
    
    const data = await extraerExpediente(form);

    if (data instanceof Error) {
        return snackbar.showError(data.message);
    }

    inputNSS.value = '';
    clearInputs();
    resetValues();
    ModalExtraerExpediente.disable();
    snackbar.showMessage(data);
});

formIngresarExpediente.addEventListener('submit', async(e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('nss', inputNSS.value);
    form.append('motivo', 'prueba'); //TODO: Cambiar
    
    const data = await ingresarExpediente(form);

    if (data instanceof Error) {
        return snackbar.showError(data.message);
    }

    inputNSS.value = '';
    clearInputs();
    resetValues();
    ModalIngresarExpediente.disable();
    snackbar.showMessage(data);
});

formPrestarExpediente.addEventListener('submit', async(e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('nss', inputNSS.value);
    form.append('motivo', 'prueba'); //TODO: Cambiar
    form.append('matricula_receptor', usuariosPrestarExpediente.value);
    
    const data = await prestarExpediente(form);

    if (data instanceof Error) {
        return snackbar.showError(data.message);
    }

    inputNSS.value = '';
    clearInputs();
    resetValues();
    ModalPrestarExpediente.disable();
    snackbar.showMessage(data);
});

btnDevolverExpediente.addEventListener('click', async(e) => {
    console.log('aslkjdnasjbndlaskj');
    const ultimoPrestamo = await obtenerUltimoPrestamo(inputNSS.value);

    const form = new FormData();
    form.append('folio', ultimoPrestamo.prestamo.folio);

    const data = await ingresarPrestamo(form);

    if (data instanceof Error) {
        return snackbar.showError(data.message);
    }

    inputNSS.value = '';
    clearInputs();
    resetValues();
    snackbar.showMessage(data);
});

function resetValues() {
    btnIngresarExpediente.setAttribute('disabled', '');
    btnExtraerExpediente.setAttribute('disabled', '');
    btnPrestarExpediente.style.display = "none";
    btnDevolverExpediente.style.display = "none";
}

async function fillUsers() {
    const usuarios = await obtenerUsuarios();

    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.innerText = `${usuario.nombre} ${usuario.apellidos}`;
        option.setAttribute('value', usuario.matricula);
        usuariosPrestarExpediente.appendChild(option);
    });
}

fillUsers();

function clearInputs() {
    inputNombre.value = '';
    inputTipoPension.value = '';
    inputAño.value = '';
    inputEstatus.value = '';
    inputUbicacion.value = '';
    movimientosBusquedaExpediente.value = '';
    observacionesBusquedaExpediente.value = '';
    movimientosBusquedaExpediente.innerHTML = '';
}