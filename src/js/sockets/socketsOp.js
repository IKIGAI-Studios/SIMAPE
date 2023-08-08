import { cargarPeticiones } from "../estadoPeticiones.js";

const socket = io();

socket.on('cliente:conexion', (res) => {
    console.log(res)
});

socket.on('cliente:actualizarPeticionesOperativo', async (res) => {
    console.log('Actualiza peticiones operativo')
    await cargarPeticiones();
});