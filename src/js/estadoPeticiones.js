import SnackBar from "./componentes/snackbar.js";
import { obtenerMisPeticiones } from "./actions/accionesPeticion.js";
const snackbar = new SnackBar(document.querySelector('#snackbar'));

const tablaPeticiones = document.querySelector('#tablaPeticiones');

async function cargarPeticiones() {
    tablaPeticiones.innerHTML = '';
    const peticiones = await obtenerMisPeticiones();
    
    console.log(peticiones);

    if (peticiones instanceof Error) {
        return snackbar.showError(peticiones.message);
    }

    peticiones.forEach(peticion => {
        const fila = document.createElement('tr');
        
        const movimiento = document.createElement('td');
        movimiento.innerHTML = `${peticion.tipo} del expediente ${peticion.nss}`;
        
        const fecha = document.createElement('td');
        fecha.innerHTML = peticion.fecha.substring(0,10);

        const estado = document.createElement('td');
        const estadoTexto = document.createElement('p');
        estadoTexto.id = peticion.estado; 
        estadoTexto.innerText = peticion.estado;
        estado.appendChild(estadoTexto); 

        fila.appendChild(movimiento);
        fila.appendChild(fecha);
        fila.appendChild(estado);

        tablaPeticiones.appendChild(fila);
    });
}

cargarPeticiones();