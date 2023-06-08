import { bajaExpediente } from "./actions/accionesExpediente.js";


const btnBuscarExpedienteBaja = document.querySelector('#btnBuscarExpedienteBaja');

btnBuscarExpedienteBaja.addEventListener('click', (e) => {

});

async function handleBajaUsuario(matricula) {
    const form  = new FormData();
    form.append('matricula', matricula);

    const response = await bajaUsuario(form);

    if ((typeof response) === Error) {
        snackbar.showError(response.message);
        return;
    }

    snackbar.showMessage(response);
    actualizarUsuarios();
}