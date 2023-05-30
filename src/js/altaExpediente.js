import SnackBar from "./componentes/snackbar.js";

const snackbar = new SnackBar(document.getElementById('snackbar'));

const formAltaExpediente = document.getElementById('formAltaExpediente');

formAltaExpediente.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(formAltaExpediente);
    console.log([...form]);
    
    try {
        const response = await fetch(`http://localhost:3000/expediente/nuevoExpediente`, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        snackbar.showMessage(response.statusText);
        formAltaExpediente.reset();
    }
    catch (e) {
        console.log(e);
        snackbar.showMessage(e.message);
    }
});