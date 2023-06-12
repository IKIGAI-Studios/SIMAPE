import SnackBar from "./componentes/snackbar.js";

const snackbar = new SnackBar(document.getElementById('snackbar'));

const formAltaExpediente = document.getElementById('formAltaExpediente');

formAltaExpediente.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(formAltaExpediente);
    console.log([...form]);
    
    try {
        const response = await fetch(`/expediente/altaExpediente`, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        const resJson = await response.json();

        if (!response.ok) {
            throw new Error(resJson);
        }

        snackbar.showMessage('Ok');
        formAltaExpediente.reset();
    }
    catch (e) {
        console.log(e);
        snackbar.showMessage(e.message);
    }
});