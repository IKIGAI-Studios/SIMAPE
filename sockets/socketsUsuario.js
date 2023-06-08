export function socketsUsuario(io) {
    io.on('connection', (socket) => {
        console.log(`client connected: ${socket.id}`);
    });
}