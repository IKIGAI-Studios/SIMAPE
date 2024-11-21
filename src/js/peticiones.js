import SnackBar from "./componentes/snackbar.js";
import { obtenerPeticiones, confirmarPeticionBaja, confirmarPeticionTransferencia, rechazarPeticion } from "./actions/accionesPeticion.js";
const snackbar = new SnackBar(document.querySelector('#snackbar'));

const tablaPeticiones = document.querySelector('#tablaPeticiones');

/**
 * Función para cargar las peticiones (solicitudes de movimiento)
 */
export async function cargarPeticiones() {
    tablaPeticiones.innerHTML = '';
    const peticiones = await obtenerPeticiones();
    
    if (peticiones instanceof Error) {
        return snackbar.showError(peticiones.message);
    }

    peticiones.forEach(peticion => {
        const fila = document.createElement('tr');

        const matricula = document.createElement('td');
        matricula.innerHTML = peticion.matricula;
        
        const nombre = document.createElement('td');
        nombre.innerHTML = `${peticion.nombre} ${peticion.apellidos}`;
        
        const movimiento = document.createElement('td');
        movimiento.innerHTML = peticion.tipo === 'BAJA'
            ? `${peticion.tipo} del expediente ${peticion.nss}`
            : `${peticion.tipo} del expediente ${peticion.nss} a la subdelegación ${peticion.n_delegacion} ${peticion.nom_delegacion} ${peticion.n_subdelegacion} ${peticion.nom_subdelegacion}`;
        
        const fecha = document.createElement('td');
        fecha.innerHTML = new Date(peticion.fecha).toLocaleString();

        const botones = document.createElement('td');

        const estado = document.createElement('p');
        estado.id = peticion.estado; 
        estado.innerText = peticion.estado;

        const btnAceptar = document.createElement('button');
        btnAceptar.classList.add('btn-azul');
        btnAceptar.innerHTML = `<img src="/icons/littledove.png" alt="Boton aceptar" style="width: 1rem;">
        <span class="tooltiptext">Aceptar</span>`;
        
        const btnRechazar = document.createElement('button');
        btnRechazar.classList.add('btn-rojo');
        btnRechazar.innerHTML = `<img src="/icons/x.png" alt="Boton rechazar" style="width: 1rem;">
        <span class="tooltiptext">Rechazar</span>`;

        btnAceptar.addEventListener('click', (e) => {
            handleAceptar(peticion.folio, peticion.tipo);
        });
        
        btnRechazar.addEventListener('click', (e) => {
            handleRechazar(peticion.folio);
        });

        if (peticion.estado === 'PENDIENTE') {
            botones.appendChild(btnAceptar);
            botones.appendChild(btnRechazar);
        }
        else {
            botones.appendChild(estado);
        }

        fila.appendChild(matricula);
        fila.appendChild(nombre);
        fila.appendChild(movimiento);
        fila.appendChild(fecha);
        fila.appendChild(botones);

        tablaPeticiones.appendChild(fila);
    });
}

cargarPeticiones();

/**
 * Función que se ejecuta al aceptar una petición
 * @param {String} folio Folio de la petición
 * @param {'BAJA' | 'TRANSFERENCIA'} tipo Tipo de petición
 */
async function handleAceptar(folio, tipo) {
    const form = new FormData();
    form.append('folio', folio);

    let confirmacion;

    if (tipo === 'BAJA') {
        confirmacion = await confirmarPeticionBaja(form);
    }
    else {
        confirmacion = await confirmarPeticionTransferencia(form);
    }

    if (confirmacion instanceof Error) {
        return snackbar.showError(confirmacion.message);
    }

    // Actualizar tabla
    snackbar.showMessage(confirmacion);
    await cargarPeticiones();

    // Mandar señal de sockets
    let s = io();
    s.emit('server:actualizarPeticionesOperativo');
}

/**
 * Función que se ejecuta al rechazar una petición
 * @param {String} folio Folio de la petición
 */
async function handleRechazar(folio) {
    const form = new FormData();
    form.append('folio', folio);

    const rechazo = await rechazarPeticion(form);

    if (rechazo instanceof Error) {
        return snackbar.showError(rechazo.message);
    }

    // Actualizar tabla
    snackbar.showMessage(rechazo);
    await cargarPeticiones();

    // Mandar señal de sockets
    let s = io();
    s.emit('server:actualizarPeticionesOperativo');
}