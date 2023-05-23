import SnackBar from "./componentes/snackbar.js";

const snackbar = new SnackBar(document.getElementById('snackbar'));

const formLogin = document.getElementById('formLogin');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(formLogin);
    console.log([...form]);
    
    try {
        const response = await fetch(`http://localhost:3000/login`, {
            method: 'POST',
            body: new URLSearchParams(form)
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        formLogin.submit();
    }
    catch (e) {
        snackbar.showMessage(e.message);
    }
});


//snackbar.show();
  