import SnackBar from "./componentes/snackbar.js";
import { obtenerPeticiones, confirmarPeticionBaja, confirmarPeticionTransferencia, rechazarPeticion } from "./actions/accionesPeticion.js";
const snackbar = new SnackBar(document.querySelector('#snackbar'));

const tablaPeticiones = document.querySelector('#tablaPeticiones');

async function cargarPeticiones() {
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
        movimiento.innerHTML = `${peticion.tipo} del expediente ${peticion.nss}`;
        
        const fecha = document.createElement('td');
        fecha.innerHTML = peticion.fecha.substring(0,10);

        const botones = document.createElement('td');

        const estado = document.createElement('td');
        estado.innerHTML = peticion.estado;

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

    snackbar.showMessage(confirmacion);
    cargarPeticiones();
}

async function handleRechazar(folio) {
    const form = new FormData();
    form.append('folio', folio);

    const rechazo = await rechazarPeticion(form);

    if (rechazo instanceof Error) {
        return snackbar.showError(rechazo.message);
    }

    snackbar.showMessage(rechazo);
    cargarPeticiones();
}