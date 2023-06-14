import SnackBar from "./componentes/snackbar.js";
import { altaExpediente } from "./actions/accionesExpediente.js";
import { obtenerDelegaciones } from "./actions/accionesDelegacion.js";

const listDelegaciones = document.querySelector('#delegacionAltaExpediente');

const snackbar = new SnackBar(document.getElementById('snackbar'));

const formAltaExpediente = document.getElementById('formAltaExpediente');

formAltaExpediente.addEventListener('submit', async (e) => {
    e.preventDefault();

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

listDelegacionesFill();