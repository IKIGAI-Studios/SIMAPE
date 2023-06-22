import SnackBar from "./componentes/snackbar.js";
import { obtenerPeticiones } from "./actions/accionesPeticion.js";
const snackbar = new SnackBar(document.querySelector('#snackbar'));

const tablaPeticiones = document.querySelector('#tablaPeticiones');

async function cargarPeticiones() {
    const peticiones = await obtenerPeticiones();
    console.log(peticiones);
    
    if (peticiones instanceof Error) {
        return snackbar.showError(peticiones.message);
    }

    peticiones.forEach(peticion => {
        const fila = document.createElement('tr');

        const matricula = document.createElement('td');
        matricula.innerHTML = peticion.matricula;
        
        const nombre = document.createElement('td')
        nombre.innerHTML = `${peticion.nombre} ${peticion.apellidos}`;
        
        const movimiento = document.createElement('td')
        movimiento.innerHTML = `${peticion.tipo} del expediente ${peticion.nss}`;
        
        const fecha = document.createElement('td')
        fecha.innerHTML = peticion.fecha.substring(0,10);

        const botones = document.createElement('td');

        const btnAceptar = document.createElement('button');
        btnAceptar.classList.add('btn-azul');
        btnAceptar.innerHTML = `<img src="/icons/littledove.png" alt="Boton aceptar" style="width: 1rem;">
        <span class="tooltiptext">Aceptar</span>`;
        
        const btnRechazar = document.createElement('button');
        btnRechazar.classList.add('btn-rojo');
        btnRechazar.innerHTML = `<img src="/icons/x.png" alt="Boton rechazar" style="width: 1rem;">
        <span class="tooltiptext">Rechazar</span>`;

        btnAceptar.addEventListener('click', (e) => {
            handleAceptar(peticion.folio);
        });
        
        btnRechazar.addEventListener('click', (e) => {
            handleRechazar(peticion.folio);
        });

        botones.appendChild(btnAceptar);
        botones.appendChild(btnRechazar);

        fila.appendChild(matricula);
        fila.appendChild(nombre);
        fila.appendChild(movimiento);
        fila.appendChild(fecha);
        fila.appendChild(botones);
        console.log('aaaaaa');
        console.log(fila);
        console.log(tablaPeticiones);

        tablaPeticiones.appendChild(fila);
    });
}

cargarPeticiones();

function handleAceptar(folio) {
    // Reimprimir xd
    snackbar.showMessage('Aceptado');
}

function handleRechazar(folio) {
    // Reimprimir xd
    snackbar.showMessage('Rechazado');
}