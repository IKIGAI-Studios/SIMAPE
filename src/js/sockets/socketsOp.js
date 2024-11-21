import { cargarPeticiones } from "../estadoPeticiones.js";

const socket = io();

// Conexión con cliente
socket.on('cliente:conexion', (res) => {
    console.log(res)
});

// Actualizar peticiones de cliente
socket.on('cliente:actualizarPeticionesOperativo', async (res) => {
    console.log('Actualiza peticiones operativo')
    await cargarPeticiones();
});