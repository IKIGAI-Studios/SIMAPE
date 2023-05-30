import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';
import Expediente from '../models/expedienteModel.js';

const routes = express.Router();

// * Inicio
routes.get('/', (req, res) => {
    res.render('login', { session: req.session });
});

// * Inicio administrador
routes.get('/simape-ad', (req, res) => {
    if (!req.session.user || req.session.user.tipo_usuario !== 'ADMINISTRADOR'){
        res.redirect('/');
        return;
    } 
    res.render('simape-ad', {session: req.session});
});

// * Inicio operativo
routes.get('/simape-op', (req, res) => {
    if (!req.session.user || req.session.user.tipo_usuario !== 'OPERATIVO'){
        res.redirect('/');
        return;
    } 
    res.render('simape-op', {session: req.session});
});

// * Login
routes.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        // Destructurar los datos necesarios
        const { usuario, pass } = req.body;

        // Buscar el usuario
        const usuarioEnBD = await Usuario.findOne({
            where: {
                usuario: usuario
            },
            attributes: ['nombre', 'apellidos', 'matricula', 'usuario', 'pass', 'tipo_usuario', 'estatus', 'fecha_registro', 'adscripcion']
        });

        // No existe el usuario
        if (!usuarioEnBD) {
            console.log("No existe el usuario");
            throw new Error('No existe el usuario');
        }

        // Encriptar contraseña para comparar
        const passComparacion = await bcrypt.compare(pass, usuarioEnBD.pass);


        if (!passComparacion) {
            console.log("Contraseña incorrecta");
            throw new Error('Contraseña incorrecta');
        }

        // Crear la sesión del Usuario
        req.session.user = { 
            nombre: usuarioEnBD.nombre, 
            apellidos: usuarioEnBD.apellidos,
            matricula: usuarioEnBD.matricula, 
            tipo_usuario: usuarioEnBD.tipo_usuario,
            fecha_registro: usuarioEnBD.fecha_registro,
            adscripcion: usuarioEnBD.adscripcion
        };

        delete req.session.loginError;

        // Redireccionar al tipo de usuario correspondiente
        if (usuarioEnBD.tipo_usuario == "ADMINISTRADOR") {
            console.log(req.session.user);
            console.log("Accediendo a administrador");
            res.redirect('/simape-ad');
        } 
        else {
            console.log(req.session.user);
            console.log("Accediendo a operativo");
            res.redirect('/simape-op');
        }
    } 
    catch (e) {
        console.log(e);
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
});

// * Logout
routes.get('/logout', (req, res) => {
    req.session.destroy();
    res.writeHead(302, {
        'Location': '/'
    });
    res.end();
});

// * Test
routes.get('/test', async (req, res) => {
    try {
        const response = await Usuario.findAll();
        res.json(response);
    }
    catch (e) {
        res.json(`ERROR ${e}`);
    }
});

export default routes;