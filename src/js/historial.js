import SnackBar from "./componentes/snackbar.js";
import { buscarPorFolio, obtenerMisMovimientos } from './actions/accionesMovimiento.js'
import Button from "./componentes/button.js";
import { imprimir, testPrinter } from "./actions/accionesImpresion.js";
import { generarReportePDF } from "./utilities/generarReportePDF.js"

const snackbar = new SnackBar(document.querySelector('#snackbar'));

const tablaMovimientos = document.querySelector('#tablaMovimientosHistorial');

export async function cargarMovimientos() {
    const movimientos = await obtenerMisMovimientos();
    
    if (movimientos instanceof Error) {
        return snackbar.showError(movimientos.message);
    }

    tablaMovimientos.innerHTML = '';

    movimientos.forEach(movimiento => {
        const fila = document.createElement('tr');

        const folio = document.createElement('td');
        folio.innerHTML = movimiento.folio;
        
        const tipoMovimiento = document.createElement('td')
        tipoMovimiento.innerHTML = movimiento.tipo_movimiento;
        
        const nss = document.createElement('td')
        nss.innerHTML = movimiento.nss;
        
        const fecha = document.createElement('td')
        fecha.innerHTML = new Date(movimiento.fecha).toLocaleString();

        const boton = document.createElement('td');

        const btnReimprimirElement = document.createElement('button');
        btnReimprimirElement.classList.add('btn-verde');
        btnReimprimirElement.style.padding = '0 2rem';

        const btnReimprimir = new Button(
            btnReimprimirElement,
            'REIMPRIMIR'
        )

        btnReimprimir.HTMLelement.addEventListener('click', (e) => {
            handleReimprimir(btnReimprimir, movimiento.folio);
        });

        boton.appendChild(btnReimprimirElement);

        fila.appendChild(folio);
        fila.appendChild(tipoMovimiento);
        fila.appendChild(nss);
        fila.appendChild(fecha);
        fila.appendChild(boton);

        tablaMovimientos.appendChild(fila);
    });
}

cargarMovimientos();

/**
 * 
 * @param {Button} btnReimprimir 
 * @param {Number} folio 
 */
async function handleReimprimir(btnReimprimir, folio) {
    
    btnReimprimir.setState('LOADING');
    await imprimirTicket(folio);
    btnReimprimir.setState('NORMAL');
}

export async function imprimirTicket(folio) {
    // Buscar el movimiento
    const movimiento = await buscarPorFolio(folio);
    console.log(movimiento);

    // Si es reimpresión de supervisión, generar el pdf
    if (movimiento.tipo_movimiento === 'SUPERVISION_SALIDA') {
        const expedientes = movimiento.movimientosSupervision.map((movimiento) => {
            return {nss: movimiento.nss, nombre: movimiento.nombre};
        });

        generarReportePDF(
            movimiento.folio, 
            `${movimiento.nombre} ${movimiento.apellidos}`,
            movimiento.movimientosSupervision[0].supervisor,
            new Date(movimiento.fecha),
            expedientes
        );

        snackbar.showMessage('Documento generado con éxito');
        return;
    }

    const ticketBase = {
        tipo: movimiento.tipo_movimiento, 
        folio: movimiento.folio,
        matricula: movimiento.matricula, 
        nombreUsuario: `${movimiento.nombre} ${movimiento.apellidos}`, 
        fecha: new Date(movimiento.fecha)
    }

    let ticketExtra = {};

    if (movimiento.tipo_movimiento === 'INGRESO' || movimiento.tipo_movimiento === 'EXTRACCION') {
        ticketExtra = {
            expediente: {
                nss: movimiento.movimientoNormal.nss, 
                nombre: movimiento.movimientoNormal.nombre
            }
        }
    }
    else if (movimiento.tipo_movimiento === 'PRESTAMO' || movimiento.tipo_movimiento === 'DEVOLUCION') {
        ticketExtra = {
            expediente: {
                nss: movimiento.movimientoPrestamo.nss, 
                nombre: movimiento.movimientoPrestamo.nombre
            },
            matriculaReceptor: movimiento.movimientoPrestamo.matricula_receptor,
            nombreReceptor: `${movimiento.movimientoPrestamo.nombre_receptor} ${movimiento.movimientoPrestamo.apellidos_receptor}`
        }
    }

    const ticket = {
        ...ticketBase,
        ...ticketExtra
    }

    const test = await testPrinter();
    if (test instanceof Error) {
        return snackbar.showError(test.message);
    }

    const resImprimir = await imprimir(ticket);

    snackbar.showMessage(resImprimir);
}