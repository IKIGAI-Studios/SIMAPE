import { cargarPeticiones } from "../peticiones.js";

const socket = io();

socket.on('cliente:conexion', (res) => {
    console.log(res)
});

socket.on('cliente:actualizarPeticionesAdministrador', async (res) => {
    console.log('Actualiza peticiones administrador')
    await cargarPeticiones();
});