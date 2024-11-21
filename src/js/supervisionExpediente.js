import SnackBar from "./componentes/snackbar.js";
import { buscarExpediente, obtenerSupervisionesActivas, supervisionExpediente, ingresarSupervision } from "./actions/accionesExpediente.js";
import { cargarMovimientos, imprimirTicket } from "./historial.js";

const formBusquedaExpediente = document.querySelector('#formBusquedaExpedienteSupervision');
const inputNSS = document.querySelector('#nssBusquedaExpedienteSupervision');

const supervisorSupervision = document.querySelector('#supervisorSupervision');
const areaExpedientes = document.querySelector('#expedientesSupervision');
const btnFinalizarSupervision = document.querySelector('#btnFinalizarSupervision');
const tablaSupervisionesActivas = document.querySelector('#tablaSupervisionesActivas');

const snackbar = new SnackBar(document.querySelector('#snackbar'));

// Variable para almacenar expedientes
let expedientes = [];

/**
 * Evento que se ejecuta al buscar un expediente
 */
formBusquedaExpediente.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (inputNSS.value === '') {
        snackbar.showMessage('Rellene los campos');
        return;
    }

    const expedienteData = await buscarExpediente(inputNSS.value);

    if (expedienteData instanceof Error) {
        return snackbar.showError(expedienteData.message);
    }

    const { expediente } = expedienteData;
    
    // Si el expediente no se encuentra disponible
    if (!expediente.estatus) {
        return snackbar.showError('El expediente está dado de baja');
    }

    if (expediente.estado === 'EXTRAIDO' || expediente.estado === 'PRESTADO' || expediente.estado === 'SUPERVISADO') {
        return snackbar.showError('El expediente se encuentra extraído');
    }

    if (expedientes.includes(expediente.nss)) {
        return snackbar.showError('El expediente ya ha sido añadido');
    }

    // Escribir los datos
    inputNSS.value = '';
    expedientes.push(expediente.nss);
    areaExpedientes.value = expedientes.join('\n');

    btnFinalizarSupervision.removeAttribute('disabled');
    snackbar.showMessage('Expediente añadido');
});

/**
 * Evento que se ejecuta al finalizar la búsqueda de expedientes
 */
btnFinalizarSupervision.addEventListener('click', async (e) => {
    if (supervisorSupervision.value == '') {
        return snackbar.showError('Introzuca un supervisor');
    }

    const form = new FormData();
    form.append('nssList', expedientes.join(','));
    form.append('motivo', 'Supervision');
    form.append('supervisor', supervisorSupervision.value);

    const supervision = await supervisionExpediente(form);

    if (supervision instanceof Error) {
        return snackbar.showError(supervision.message);
    }

    areaExpedientes.value = '';
    supervisorSupervision.value = '';
    btnFinalizarSupervision.setAttribute('disabled', '');
    cargarSupervisiones();
    expedientes = [];
    cargarMovimientos();
    snackbar.showMessage(supervision.message);

    await imprimirTicket(supervision.folio);
});

/**
 * Función que rellena la tabla de supervisiones activas
 */
async function cargarSupervisiones() {
    tablaSupervisionesActivas.innerHTML = '';
    const supervisiones = await obtenerSupervisionesActivas();
    
    if (supervisiones instanceof Error) {
        return snackbar.showError(supervisiones.message);
    }

    supervisiones.forEach(supervision => {
        const fila = document.createElement('tr');

        const folio = document.createElement('td');
        folio.innerHTML = supervision.folio;
        
        const supervisor = document.createElement('td');
        supervisor.innerHTML = supervision.supervisor;
        
        const fecha = document.createElement('td');
        fecha.innerHTML = supervision.fecha.substring(0,10);

        const botones = document.createElement('td');

        const btnIngresarExpedientes = document.createElement('button');
        btnIngresarExpedientes.classList.add('img-btn');
        btnIngresarExpedientes.innerHTML = `<img src="/icons/folder_azul.png" alt="BAJA" style="width: 2rem">
        <span class="tooltiptext">INGRESAR EXPEDIENTES</span>`;

        btnIngresarExpedientes.addEventListener('click', () => {
            handleIngresarExpedientes(supervision.folio);
        });

        botones.appendChild(btnIngresarExpedientes);

        fila.appendChild(folio);
        fila.appendChild(supervisor);
        fila.appendChild(fecha);
        fila.appendChild(botones);

        tablaSupervisionesActivas.appendChild(fila);
    });
}

/**
 * Función que se ejecuta al ingresar una supervisión
 * @param {String} folio Folio de la supervisión
 */
async function handleIngresarExpedientes(folio) {
    const form = new FormData();
    form.append('folio', folio);

    const res = await ingresarSupervision(form);

    if (res instanceof Error) {
        return snackbar.showError(res.message);
    }

    snackbar.showMessage(res);
    cargarSupervisiones();
}

cargarSupervisiones();