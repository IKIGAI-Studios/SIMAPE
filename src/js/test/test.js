const socket = io();

socket.on('server:conexion', (res) => {
    console.log(res)
});