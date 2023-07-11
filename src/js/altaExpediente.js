import SnackBar from "./componentes/snackbar.js";
import { altaExpediente } from "./actions/accionesExpediente.js";
import { obtenerDelegaciones } from "./actions/accionesDelegacion.js";

const listDelegaciones = document.querySelector('#delegacionAltaExpediente');

const snackbar = new SnackBar(document.getElementById('snackbar'));

const formAltaExpediente = document.getElementById('formAltaExpediente');

const años = document.querySelector('#añoAltaExpediente');

// Campos a validar

const nss = document.getElementById('nssAltaExpediente');

const nombre = document.getElementById('nombreAltaExpediente');

// Expresión regular que admmite ñ y tildes
const regexNombre = /^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]+$/;


function validarCampos(){

   if(nss.value.length < 11){
    snackbar.showError('El NSS no puede ser menor a 11 caracteres');
    return false;
   }  

   if(nss.value.length > 11){
    snackbar.showError('El NSS no puede ser mayor a 11 caracteres');
    return false;
   }

   const valorNombre = nombre.value.trim();

   if(valorNombre.length>98){
    snackbar.showError('Se rebasó el límite de caracteres para el nombre');
    return false;
   }

   if(!regexNombre.test(valorNombre)) {
       snackbar.showError('El nombre solo puede contener letras y espacios');
       return false; 
   }

   return true;
}

formAltaExpediente.addEventListener('submit', async (e) => {

    e.preventDefault();

    if (!validarCampos()) {
        return; 
    }

    const form = new FormData(formAltaExpediente);
    const expedienteCreado = await altaExpediente(form);

    if (expedienteCreado instanceof Error) {
        return snackbar.showError(expedienteCreado.message);
    }

    
    snackbar.showMessage('Expediente ingresado correctamente');
    formAltaExpediente.reset();
});

async function listDelegacionesFill() {
    const delegaciones = await obtenerDelegaciones();
    
    delegaciones.forEach((delegacion) => {
        const option = document.createElement('option');
        option.value = delegacion.id_delegacion;
        option.innerHTML = `${delegacion.n_delegacion} ${delegacion.nom_delegacion} - ${delegacion.n_subdelegacion} ${delegacion.nom_subdelegacion}`;
        listDelegaciones.appendChild(option);
    });
}

function añosFill(){
    const fechaActual = new Date();

    for (let i=fechaActual.getFullYear(); i>=fechaActual.getFullYear() - 100; i--){
        const option = document.createElement('option');
        option.value = i;
        option.innerHTML = i;
        años.appendChild(option);
    }
}



listDelegacionesFill();
añosFill();
