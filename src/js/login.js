import SnackBar from "./componentes/snackbar.js";

const snackbar = new SnackBar(document.getElementById('snackbar'));

const formLogin = document.getElementById('formLogin');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(formLogin);
    
    try {
        const response = await fetch(`/login`, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        formLogin.submit();
    }
    catch (e) {
        snackbar.showError(e.message);
    }
});