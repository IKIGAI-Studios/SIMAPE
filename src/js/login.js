import SnackBar from "./componentes/snackbar.js";

const snackbar = new SnackBar(document.getElementById('snackbar'));

const formLogin = document.getElementById('formLogin');

/**
 * Evento que se ejecuta al iniciar sesión
 */
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(formLogin);
    
    try {
        const response = await fetch(`/login`, {
            method: 'POST',
            body: new URLSearchParams(form)
        });
        
        if (!response.ok) {
            throw new Error(await response.json());
        }

        formLogin.submit();
    }
    catch (e) {
        snackbar.showError(e.message);
    }
});