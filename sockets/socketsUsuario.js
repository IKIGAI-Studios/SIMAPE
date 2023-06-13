
export function socketsUsuario(io) {
    io.on('connection', (socket) => {
        console.log(`client connected: ${socket.id}`);
        //listaUsuarios.

        //io.to(socketId).emit()
        
        socket.emit('server:conexion', `Hola cliente, tu id es: ${socket.id}`);
    });
}