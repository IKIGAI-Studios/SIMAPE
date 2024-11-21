import { cargarPeticiones } from "../peticiones.js";

const socket = io();

// Conexión con cliente
socket.on('cliente:conexion', (res) => {
    console.log(res)
});

//Actualizar peticiones de administrador
socket.on('cliente:actualizarPeticionesAdministrador', async (res) => {
    console.log('Actualiza peticiones administrador')
    await cargarPeticiones();
});