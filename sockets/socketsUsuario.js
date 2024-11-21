/**
 * Función para sockets
 * @param {Object} io 
 */
export function socketsUsuario(io) {
    io.on('connection', (socket) => {
        console.log(`client connected: ${socket.id}`);
        socket.emit('cliente:conexion', `Hola cliente, tu id es: ${socket.id}`);

        socket.on('server:actualizarPeticionesOperativo', () => {
            io.emit('cliente:actualizarPeticionesOperativo');
        });

        socket.on('server:actualizarPeticionesAdministrador', () => {
            io.emit('cliente:actualizarPeticionesAdministrador');
        });
        
    });
}