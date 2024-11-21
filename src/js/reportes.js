import SnackBar from "./componentes/snackbar.js";
import { ModalReporte } from "./modalsAd.js";
import { buscarExpediente } from "./actions/accionesExpediente.js";
import { buscarUsuario } from "./actions/accionesUsuario.js"
import { obtenerMovimientosFecha, obtenerMovimientosExpediente, obtenerMovimientosUsuario } from "./actions/accionesMovimiento.js";
import { generarExcel } from "./test/testExcel.js";

const snackbar = new SnackBar(document.querySelector('#snackbar'));

const fromMesReporte = document.querySelector('#fromMesReporte');
const toMesReporte = document.querySelector('#toMesReporte');
const tipoPensionReporte = document.querySelector('#tipoPensionReporte');
const checkboxReporte = document.querySelector('#checkboxReporte');
const btnGenerarReporteFecha = document.querySelector('#btnGenerarReporteFecha');
const btnGenerarReporteFechaExcel = document.querySelector('#btnGenerarReporteFechaExcel');

const nssReportes = document.querySelector('#nssReportes');
const btnGenerarReporteExpediente = document.querySelector('#btnGenerarReporteExpediente');
const btnGenerarReporteExpedienteExcel = document.querySelector('#btnGenerarReporteExpedienteExcel');

const matriculaReportes = document.querySelector('#matriculaReportes');
const btnGenerarReporteUsuario = document.querySelector('#btnGenerarReporteUsuario');
const btnGenerarReporteUsuarioExcel = document.querySelector('#btnGenerarReporteUsuarioExcel');

const bodyModalReporte = document.querySelector('#modalReporte div.row');

/**
 * Contiene la defición de un reporte HTML
 */
class Reporte {
    /**
     * @param {HTMLElement} HTMLelement Elemento para escribir el reporte
     */
    constructor(HTMLelement) {
        this.HTMLelement = HTMLelement;
    }

    /**
     * Función para agregar un título
     * @param {String} title Título 
     */
    addTitle(title) {
        this.HTMLelement.innerHTML += `<h2>${title}</h2>`;
    }

    /**
     * Función para agregar un texto
     * @param {String} text Texto 
     */
    addText(text) {
        this.HTMLelement.innerHTML += `<p>${text}</p>`;
    }

    /**
     * Función para agregar una tabla
     * @param {String} id Id de la tabla
     * @param {Array<String>} columns Array de columnas
     * @param {Array<Array<String>>} rows Matriz de filas
     */
    addTable(id, nombre, columns, rows) {
        this.HTMLelement.innerHTML += `
        <table class="tabla" id="${id}" nombre="${nombre}">
            <thead>
                ${
                    columns.map((column) => {
                        return `<th>${column}</th>` 
                    }).join('')
                }
            </thead>
            <tbody>
                ${
                    rows.map((row) => {
                        return `<tr>${
                            row.map((cell) => {
                                return `<td>${cell}</td>` 
                            }).join('')
                        }</tr>` 
                    }).join('')
                }
            </tbody>
        </table>
        `;
    }
}

/**
 * Evento que se ejecuta al dar clic en el botón de generar por fecha
 */
btnGenerarReporteFecha.addEventListener('click', async () => {

    const fechaInicio = new Date(fromMesReporte.value);
    const fechaFin = new Date(toMesReporte.value);

    const ultimoDiaMesActual = new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 2, 1);

    if (fechaInicio > fechaFin || fromMesReporte.value == '' || toMesReporte.value == '') {
        return snackbar.showError('Error en el rango de fecha');
    }

    const tipos = Array.from(checkboxReporte.getElementsByTagName('input')).map((chk) => {
        return chk.checked ? chk.value : null
    }).filter(Boolean);

    if (!tipos.length) {
        return snackbar.showError('Escoge al menos un tipo de movimiento');
    }

    await generarReporteFecha(fechaInicio, ultimoDiaMesActual, tipoPensionReporte.value, tipos);
});

/**
 * Evento que se ejecuta al dar clic en el botón de generar por fecha en excel
 */
btnGenerarReporteFechaExcel.addEventListener('click', async () => {
    const fechaInicio = new Date(fromMesReporte.value);
    const fechaFin = new Date(toMesReporte.value);

    const ultimoDiaMesActual = new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 2, 1);

    if (fechaInicio > fechaFin || fromMesReporte.value == '' || toMesReporte.value == '') {
        return snackbar.showError('Error en el rango de fecha');
    }

    const tipos = Array.from(checkboxReporte.getElementsByTagName('input')).map((chk) => {
        return chk.checked ? chk.value : null
    }).filter(Boolean);

    if (!tipos.length) {
        return snackbar.showError('Escoge al menos un tipo de movimiento');
    }

    await generarReporteFecha(fechaInicio, ultimoDiaMesActual, tipoPensionReporte.value, tipos);
    generarExcel(bodyModalReporte);
});

/**
 * Evento que se ejecuta al dar clic en el botón de generar reporte de expediente
 */
btnGenerarReporteExpediente.addEventListener('click', async () => {
    if (nssReportes.value == '') {
        snackbar.showError('Introduca un NSS de expediente');
        return;
    }

    await generarReporteExpediente(nssReportes.value);
});

/**
 * Evento que se ejecuta al dar clic en el botón de generar reporte de expediente en excel
 */
btnGenerarReporteExpedienteExcel.addEventListener('click', async () => {
    if (nssReportes.value == '') {
        snackbar.showError('Introduca un NSS de expediente');
        return;
    }

    await generarReporteExpediente(nssReportes.value);
    generarExcel(bodyModalReporte);
});

/**
 * Evento que se ejecuta al dar clic en el botón de generar reporte de usuario
 */
btnGenerarReporteUsuario.addEventListener('click', async () => {
    if (matriculaReportes.value == '') {
        snackbar.showError('Introduca una matricula válida');
        return;
    }

    await generarReporteUsuario(matriculaReportes.value);
});

/**
 * Evento que se ejecuta al dar clic en el botón de generar reporte de usuario en excel
 */
btnGenerarReporteUsuarioExcel.addEventListener('click', async () => {
    if (matriculaReportes.value == '') {
        snackbar.showError('Introduca una matricula válida');
        return;
    }

    await generarReporteUsuario(matriculaReportes.value);
    generarExcel(bodyModalReporte);
});

/**
 * Función que genera un reporte por fecha
 * @param {Date} fechaInicio Fecha de inicio
 * @param {Date} fechaFin Fecha de fin
 * @param {String} categoria Categoria
 * @param {Array<String>} tipos Filtros de movimiento
 * @returns {Promise} Se generó el reporte
 */
async function generarReporteFecha(fechaInicio, fechaFin, categoria, tipos) {
    bodyModalReporte.innerHTML = '';
    
    const movimientos = await obtenerMovimientosFecha(fechaInicio, fechaFin, categoria, tipos);

    if (movimientos instanceof Error) {
        return snackbar.showError(movimientos.message);
    }

    console.log(movimientos);
    
    const reporte = new Reporte(bodyModalReporte);

    ModalReporte.enable();

    reporte.addTitle('INFORMACIÓN GENERAL');
    reporte.addText(`Fecha inicio: ${fechaInicio.toLocaleString()}`);
    reporte.addText(`Fecha fin: ${fechaFin.toLocaleString()}`);
    reporte.addText(`Categoría: ${categoria}`);
    reporte.addText(`Tipos: ${tipos.toString()}`);
    
    if (movimientos.altas && movimientos.altas.length) {
        reporte.addTitle('ALTAS');
        const movimientosAlta = movimientos.altas.map((alta) => {
            return [
                alta.folio,
                new Date(alta.fecha).toLocaleString(),
                alta.nss,
                `${alta.nombre} ${alta.apellidos}`
            ]
        });
        reporte.addTable('tablaAltaReporte', 'ALTAS', ['FOLIO', 'FECHA', 'NSS', 'USUARIO'], movimientosAlta);
    }

    if (movimientos.bajas && movimientos.bajas.length) {
        reporte.addTitle('BAJAS');
        const movimientosBaja = movimientos.bajas.map((baja) => {
            return [
                baja.folio,
                new Date(baja.fecha).toLocaleString(),
                baja.nss,
                `${baja.nombre} ${baja.apellidos}`
            ]
        });
        reporte.addTable('tablaBajaReporte', 'BAJAS', ['FOLIO', 'FECHA', 'NSS', 'USUARIO'], movimientosBaja);
    }

    if (movimientos.transferencias && movimientos.transferencias.length) {
        reporte.addTitle('TRANSFERENCIAS');
        const movimientosBaja = movimientos.transferencias.map((transferencia) => {
            return [
                transferencia.folio,
                new Date(transferencia.fecha).toLocaleString(),
                transferencia.nss,
                `${transferencia.nombre} ${transferencia.apellidos}`,
                `${transferencia.n_delegacion} ${transferencia.nom_delegacion} ${transferencia.n_subdelegacion} ${transferencia.nom_subdelegacion}`
            ]
        });
        reporte.addTable('tablaTransferenciaReporte', 'TRANSFERENCIAS', ['FOLIO', 'FECHA', 'NSS', 'USUARIO', 'DESTINO'], movimientosBaja);
    }
}

/**
 * Función que genera el reporte de un expediente
 * @param {String} nss NSS del expediente
 * @returns {Promise} Se generó el reporte
 */
async function generarReporteExpediente(nss) {
    bodyModalReporte.innerHTML = '';
    
    let expediente = await buscarExpediente(nss);
    const movimientos = await obtenerMovimientosExpediente(nss);

    if (expediente instanceof Error) {
        return snackbar.showError('Introduca un NSS válido');
    }

    expediente = expediente.expediente;
    
    const reporte = new Reporte(bodyModalReporte);

    ModalReporte.enable();

    reporte.addTitle('INFORMACIÓN GENERAL');
    reporte.addText(`Numero de expediente: ${expediente.nss}`);
    reporte.addText(`Nombre: ${expediente.nombre}`);
    reporte.addText(`Categoría de pensión: ${expediente.categoria}`);
    reporte.addText(`Año: ${expediente.año}`);
    reporte.addText(`Observaciones: ${expediente.observaciones ?? 'Ninguna'}`);
    reporte.addText(`Ubicación: ${expediente.ubicacion}`);
    
    reporte.addTitle('ALTA');
    reporte.addTable('tablaAltaReporte', 'ALTA', ['FOLIO', 'FECHA', 'REGISTRADO POR'], [[movimientos.alta.folio, new Date(movimientos.alta.fecha).toLocaleString(), `${movimientos.alta.nombre} ${movimientos.alta.apellidos}`]]);
    
    if (movimientos.baja) {
        reporte.addTitle('BAJA');
        reporte.addTable('tablaBajaReporte', 'BAJA', ['FOLIO', 'FECHA', 'DADO DE BAJA POR'], [[movimientos.baja.folio, new Date(movimientos.baja.fecha).toLocaleString(), `${movimientos.baja.nombre} ${movimientos.baja.apellidos}`]]);
    }

    if (movimientos.transferencia) {
        reporte.addTitle('TRANSFERENCIA');
        reporte.addTable('tablaTransferenciaReporte', 'TRANSFERENCIA', ['FOLIO', 'FECHA', 'TRANSFERIDO POR', 'DESTINO'], [[movimientos.transferencia.folio, new Date(movimientos.transferencia.fecha).toLocaleString(), `${movimientos.transferencia.nombre} ${movimientos.transferencia.apellidos}`, `${movimientos.transferencia.n_delegacion} ${movimientos.transferencia.nom_delegacion} ${movimientos.transferencia.n_subdelegacion} ${movimientos.transferencia.nom_subdelegacion}`]]);
    }

    if (movimientos.extracciones && movimientos.extracciones.length) {
        reporte.addTitle('EXTRACCIONES');
        const movimientosExtraccion = movimientos.extracciones.map((extraccion) => {
            return [
                extraccion.folio,
                new Date(extraccion.fecha).toLocaleString(),
                `${extraccion.nombre} ${extraccion.apellidos}`
            ]
        });
        reporte.addTable('tablaExtraccionesReporte', 'EXTRACCIONES', ['FOLIO', 'FECHA', 'USUARIO'], movimientosExtraccion);
    }

    if (movimientos.ingresos && movimientos.ingresos.length) {
        reporte.addTitle('INGRESOS');
        const movimientosIngreso = movimientos.ingresos.map((ingreso) => {
            return [
                ingreso.folio,
                new Date(ingreso.fecha).toLocaleString(),
                `${ingreso.nombre} ${ingreso.apellidos}`
            ]
        });
        reporte.addTable('tablaIngresosReporte', 'INGRESOS', ['FOLIO', 'FECHA', 'USUARIO'], movimientosIngreso);
    }

    if (movimientos.prestamos && movimientos.prestamos.length) {
        reporte.addTitle('PRÉSTAMOS');
        const movimientosPrestamo = movimientos.prestamos.map((prestamo) => {
            return [
                prestamo.folio,
                new Date(prestamo.fecha).toLocaleString(),
                `${prestamo.nombre} ${prestamo.apellidos}`,
                `${prestamo.receptor_nombre} ${prestamo.receptor_apellidos}`,
                `${prestamo.pendiente ? 'PENDIENTE' : 'FINALIZADO'}`,
                `${prestamo.pendiente ? '' : new Date(prestamo.fecha_finalizacion).toLocaleString()}`
            ]
        });

        reporte.addTable('tablaPrestamosReporte', 'PRÉSTAMOS', [
            'FOLIO', 
            'FECHA EMISIÓN', 
            'USUARIO EMISOR', 
            'USUARIO RECEPTOR', 
            'ESTADO', 
            'FECHA_RECEPCIÓN'
        ], movimientosPrestamo);
    }

    if (movimientos.supervisiones && movimientos.supervisiones.length) {
        reporte.addTitle('SUPERVISIONES');
        const movimientosSupervision = movimientos.supervisiones.map((supervision) => {
            return [
                supervision.folio,
                new Date(supervision.fecha).toLocaleString(),
                `${supervision.nombre} ${supervision.apellidos}`,
                supervision.supervisor,
                `${supervision.pendiente ? 'PENDIENTE' : 'FINALIZADO'}`,
                `${supervision.pendiente ? '' : new Date(supervision.fecha_finalizacion).toLocaleString()}`
            ]
        });

        reporte.addTable('tablaSupervisionesReporte', 'SUPERVISIONES', [
            'FOLIO',
            'FECHA', 
            'RESPONSABLE', 
            'SUPERVISOR', 
            'ESTADO', 
            'FECHA_FINALIZACIÓN'
        ], movimientosSupervision);
    }
}

/**
 * Función que genera el reporte de un usuario
 * @param {String} matricula Matricula del usuario
 * @returns {Promise} Se generó el reporte
 */
async function generarReporteUsuario(matricula) {
    bodyModalReporte.innerHTML = '';
    
    const usuario = await buscarUsuario(matricula);
    const movimientos = await obtenerMovimientosUsuario(matricula);

    if (usuario instanceof Error) {
        return snackbar.showError(usuario.message);
    }
    
    const reporte = new Reporte(bodyModalReporte);

    ModalReporte.enable();

    reporte.addTitle('INFORMACIÓN GENERAL');
    reporte.addText(`Matricula: ${usuario.matricula}`);
    reporte.addText(`Nombre: ${usuario.nombre} ${usuario.apellidos}`);
    reporte.addText(`Registro: ${new Date(usuario.fecha_registro).toLocaleString()}`);
    reporte.addText(`Adscripción: ${usuario.adscripcion}`);
    
    if (movimientos.altas && movimientos.altas.length) {
        reporte.addTitle('ALTAS');
        const movimientosAlta = movimientos.altas.map((alta) => {
            return [
                alta.folio,
                new Date(alta.fecha).toLocaleString(),
                alta.nss
            ]
        });
        reporte.addTable('tablaAltaReporte', 'ALTAS', ['FOLIO', 'FECHA', 'NSS'], movimientosAlta);
    }

    if (movimientos.bajas && movimientos.bajas.length) {
        reporte.addTitle('BAJAS');
        const movimientosBaja = movimientos.bajas.map((baja) => {
            return [
                baja.folio,
                new Date(baja.fecha).toLocaleString(),
                baja.nss
            ]
        });
        reporte.addTable('tablaBajaReporte', 'BAJAS', ['FOLIO', 'FECHA', 'NSS'], movimientosBaja);
    }

    if (movimientos.transferencias && movimientos.transferencias.length) {
        reporte.addTitle('TRANSFERENCIAS');
        const movimientosBaja = movimientos.transferencias.map((transferencia) => {
            return [
                transferencia.folio,
                new Date(transferencia.fecha).toLocaleString(),
                transferencia.nss,
                `${transferencia.n_delegacion} ${transferencia.nom_delegacion} ${transferencia.n_subdelegacion} ${transferencia.nom_subdelegacion}`
            ]
        });
        reporte.addTable('tablaTransferenciaReporte', 'TRANSFERENCIAS', ['FOLIO', 'FECHA', 'NSS', 'DESTINO'], movimientosBaja);
    }

    if (movimientos.extracciones && movimientos.extracciones.length) {
        reporte.addTitle('EXTRACCIONES');
        const movimientosExtraccion = movimientos.extracciones.map((extraccion) => {
            return [
                extraccion.folio,
                new Date(extraccion.fecha).toLocaleString(),
                extraccion.nss
            ]
        });
        reporte.addTable('tablaExtraccionesReporte', 'EXTRACCIONES', ['FOLIO', 'FECHA', 'NSS'], movimientosExtraccion);
    }

    if (movimientos.ingresos && movimientos.ingresos.length) {
        reporte.addTitle('INGRESOS');
        const movimientosIngreso = movimientos.ingresos.map((ingreso) => {
            return [
                ingreso.folio,
                new Date(ingreso.fecha).toLocaleString(),
                ingreso.nss
            ]
        });
        reporte.addTable('tablaIngresosReporte', 'INGRESOS', ['FOLIO', 'FECHA', 'NSS'], movimientosIngreso);
    }

    if (movimientos.prestamos && movimientos.prestamos.length) {
        reporte.addTitle('PRÉSTAMOS');
        const movimientosPrestamo = movimientos.prestamos.map((prestamo) => {
            return [
                prestamo.folio,
                new Date(prestamo.fecha).toLocaleString(),
                `${prestamo.nombre} ${prestamo.apellidos}`,
                `${prestamo.receptor_nombre} ${prestamo.receptor_apellidos}`,
                `${prestamo.pendiente ? 'PENDIENTE' : 'FINALIZADO'}`,
                `${prestamo.pendiente ? '' : new Date(prestamo.fecha_finalizacion).toLocaleString()}`
            ]
        });

        reporte.addTable('tablaPrestamosReporte', 'PRÉSTAMOS', [
            'FOLIO', 
            'FECHA EMISIÓN', 
            'USUARIO EMISOR', 
            'USUARIO RECEPTOR', 
            'ESTADO', 
            'FECHA_RECEPCIÓN'
        ], movimientosPrestamo);
    }

    if (movimientos.supervisiones && movimientos.supervisiones.length) {
        reporte.addTitle('SUPERVISIONES');
        const movimientosSupervision = movimientos.supervisiones.map((supervision) => {
            return [
                supervision.folio,
                new Date(supervision.fecha).toLocaleString(),
                supervision.nss,
                supervision.supervisor,
                `${supervision.pendiente ? 'PENDIENTE' : 'FINALIZADO'}`,
                `${supervision.pendiente ? '' : new Date(supervision.fecha_finalizacion).toLocaleString()}`
            ]
        });

        reporte.addTable('tablaSupervisionesReporte', 'SUPERVISIONES', [
            'FOLIO',
            'FECHA', 
            'NSS', 
            'SUPERVISOR', 
            'ESTADO', 
            'FECHA_FINALIZACIÓN'
        ], movimientosSupervision);
    }
}



