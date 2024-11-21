import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import nocache from 'nocache'
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes/routes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import expedienteRoutes from './routes/expedienteRoutes.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'node:http';
import { socketsUsuario } from './sockets/socketsUsuario.js';
import delegacionRoutes from './routes/delegacionRoutes.js';
import movimientoRoutes from './routes/movimientoRoutes.js';
import peticionRoutes from './routes/peticionRoutes.js';

// Declarar constantes para uso de rutas estaticas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar uso de .env
dotenv.config();

// Constantes de inicio de servidor
const PORT = process.env.PORT || 6969;
const app = express();
const HTTPserver = http.createServer(app);
const io = new Server(HTTPserver);

// Sockets
socketsUsuario(io);

// Configuraciones de servidor
process.env.TZ = 'America/Mexico_City';
app.set('view engine', 'ejs');
app.use(cors());
app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET_KEY_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 12 }
}));


// Rutas
app.use('/', routes);
app.use('/usuario', usuarioRoutes);
app.use('/expediente', expedienteRoutes);
app.use('/delegacion', delegacionRoutes);
app.use('/movimiento', movimientoRoutes);
app.use('/peticion', peticionRoutes);

// Iniciar servidor
const server = HTTPserver.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});

// rutas estaticas frontend
app.use("/scss", express.static(join(__dirname, 'src/assets/scss')));
app.use("/imgs", express.static(join(__dirname, 'src/imgs')));
app.use("/icons", express.static(join(__dirname, 'src/icons')));
app.use("/fonts", express.static(join(__dirname, 'src/fonts')));
app.use("/js", express.static(join(__dirname, 'src/js')));
app.use("/uploads", express.static(join(__dirname, 'src/uploads')));
app.use("/dist", express.static(join(__dirname, 'dist')));

app.use((req, res) => {
  res.status(404).render('404');
});

// export { app, server };