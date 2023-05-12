import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';

const routes = express.Router();

routes.get('/', (req, res) => {
    res.render('login');
});

routes.get('/simape', (req, res) => {
    res.render('simape');
});

routes.get('/login', (req, res) => {
    res.render('login', { session: req.session });
});

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
            attributes: ['nombre', 'matricula', 'usuario', 'pass', 'tipo_usuario', 'estatus']
        });

        // No existe el usuario
        if (!usuarioEnBD) {
            console.log("No existe el usuario");
            req.session.loginError = 'No existe el usuario';
            res.redirect('/login');
            return;
        }

        // Encriptar contraseña para comparar
        const passComparacion = await bcrypt.compare(pass, usuarioEnBD.pass);


        if (!passComparacion) {
            console.log("Contraseña incorrecta");
            req.session.loginError = 'Contraseña incorrecta';
            res.redirect('/login');
            return;
        }

        // Crear la sesión del Usuario
        req.session.user = { nombre: usuarioEnBD.nombre, matricula: usuarioEnBD.matricula, tipo_usuario: usuarioEnBD.tipo_usuario };

        // Redireccionar al tipo de usuario correspondiente
        if (usuarioEnBD.tipo_usuario == "administrador") {
            console.log(req.session.user);
            console.log("Accediendo a administrador");
            res.redirect('/simape');
        } 
        else {
            console.log(req.session.user);
            console.log("Accediendo a operativo");
            res.redirect('/simape');
        }
    } 
    catch (e) {
        req.session.loginError = `ERROR DE CONSULTA ${e}`;
        console.log(`Login ERROR: ${e}`);
        res.redirect('/');
    }
});

routes.post('/registrarUsuario', async (req, res) => {
    try {
        const {matricula, nombre, adscripcion, tipo_usuario, usuario, pass, estatus} = req.body;

        // Validar que el usuario sea único
        const usuarioRegistrado = await Usuario.findOne({ 
            where: { 
                usuario 
            },
            attributes: ['usuario']
        });

        if (usuarioRegistrado) {
            //req.session.registerEjecutor = `El usuario ${user} ya ha sido registrado`;
            console.log('ERROR Usuario registrado');
            res.redirect('/simape');
            return;
        }

        // Validar que la matricula sea único
        const matriculaRegistrada = await Usuario.findOne({ 
            where: { 
                matricula 
            },
            attributes: ['matricula']
        });

        if (matriculaRegistrada) {
            //req.session.registerEjecutor = `El usuario ${user} ya ha sido registrado`;
            console.log('ERROR Matricula registrado');
            res.redirect('/simape');
            return;
        }

        // Encriptar contraseña
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(pass, saltRounds);

        const nuevoUsuario = await Usuario.create({
            matricula,
            nombre,
            adscripcion,
            tipo_usuario,
            usuario,
            pass : hashedPass,
            estatus: true
        });

        console.log('Usuario registrado');
        res.redirect('/simape');
        
    } 
    catch (e) {
        req.session.loginError = `ERROR DE REGISTRO ${e}`;
        console.log(`Registrer ERROR: ${e}`);
        res.redirect('/simape');
    }
});


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