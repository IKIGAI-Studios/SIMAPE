import SnackBar from "./componentes/snackbar.js";
import { obtenerMisMovimientos } from './actions/accionesMovimiento.js'
const snackbar = new SnackBar(document.querySelector('#snackbar'));

const tablaMovimientos = document.querySelector('#tablaMovimientosHistorial');

async function cargarMovimientos() {
    const movimientos = await obtenerMisMovimientos();
    console.log(movimientos);
    
    if (movimientos instanceof Error) {
        return snackbar.showError(movimientos.message);
    }

    movimientos.forEach(movimiento => {
        const fila = document.createElement('tr');

        const folio = document.createElement('td');
        folio.innerHTML = movimiento.folio;
        
        const tipoMovimiento = document.createElement('td')
        tipoMovimiento.innerHTML = movimiento.tipo_movimiento;
        
        const nss = document.createElement('td')
        nss.innerHTML = movimiento.nss;
        
        const fecha = document.createElement('td')
        fecha.innerHTML = movimiento.fecha.substring(0,10);

        const boton = document.createElement('td');

        const btnReactivar = document.createElement('button');
        btnReactivar.classList.add('btn-verde');
        btnReactivar.style.padding = '0 2rem';
        btnReactivar.innerHTML = 'REIMPRIMIR';

        btnReactivar.addEventListener('click', (e) => {
            handleReactivar(movimiento.folio);
        });

        boton.appendChild(btnReactivar);

        fila.appendChild(folio);
        fila.appendChild(tipoMovimiento);
        fila.appendChild(nss);
        fila.appendChild(fecha);
        fila.appendChild(boton);

        tablaMovimientos.appendChild(fila);
    });
}

cargarMovimientos();

function handleReactivar(folio) {
    // Reimprimir xd
    snackbar.showMessage('Reimprimiendo ticket ' + folio + '...');
}