import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';
import Expediente from '../models/expedienteModel.js';

const routes = express.Router();

routes.get('/', (req, res) => {
    res.render('login');
});

// ADMIN
routes.get('/simape-ad', (req, res) => {
    if (!req.session.user){
        res.redirect('/');
        return;
    } 
    res.render('simape-ad', {session: req.session});
});

// OPERATIVO
routes.get('/simape-op', (req, res) => {
    if (!req.session.user){
        res.redirect('/');
        return;
    } 
    res.render('simape-op', {session: req.session});
});

routes.get('/login', (req, res) => {
    res.render('login', { session: req.session });
});

routes.get('/logout', (req, res) => {
    req.session.destroy((e) => {
        if (e) {
          console.log(e);
        } 
        else {
          res.redirect('/');
        }
    });
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
            attributes: ['nombre', 'apellidos', 'matricula', 'usuario', 'pass', 'tipo_usuario', 'estatus']
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
        req.session.user = { 
            nombre: usuarioEnBD.nombre, 
            apellidos: usuarioEnBD.apellidos,
            matricula: usuarioEnBD.matricula, 
            tipo_usuario: usuarioEnBD.tipo_usuario 
        };

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
        req.session.loginError = `ERROR DE CONSULTA ${e}`;
        console.log(`Login ERROR: ${e}`);
        res.redirect('/');
    }
});

routes.post('/registrarUsuario', async (req, res) => {
    try {
        const {matricula, nombre, apellidos, adscripcion, tipo_usuario, usuario, pass, estatus} = req.body;

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

        // Obtener la fecha actual
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let fechaActual = `${year}-${month}-${day}`;

        const nuevoUsuario = await Usuario.create({
            matricula,
            nombre,
            apellidos,
            adscripcion,
            tipo_usuario,
            usuario,
            pass : hashedPass,
            estatus: true,
            fecha_registro: fechaActual
        });

        console.log('Usuario registrado');
        res.json('Usuario registrado')
    } 
    catch (e) {
        req.session.loginError = `ERROR DE REGISTRO ${e}`;
        console.log(`Registrer ERROR: ${e}`);
        res.json(`ERROR ${e}`);
    }
});

// Expedientes
// TODO: Pasar a otro archivo de rutas

routes.get('/buscarPorNSS/:nss', async (req, res) => {
    const expedienteEncontrado = await Expediente.findOne({
        where: { 
            nss: req.params.nss 
        }
    });

    if (expedienteEncontrado)
    {
        res.json(expedienteEncontrado);
        console.log(expedienteEncontrado);
        return;
    }
    res.json('Expediente no encontrado');
    return;
});

// Control de usuarios
// TODO: Pasar a otro archivo de rutas
routes.get('/busquedaUsuario/:matricula', async (req, res) => {
    const usuarioEncontrado = await Usuario.findOne({
        where: { 
            matricula: req.params.matricula 
        },
        attributes: ['matricula', 'nombre', 'apellidos', 'adscripcion', 'estatus', 'fecha_registro']
    });

    if (usuarioEncontrado)
    {
        res.json(usuarioEncontrado);
        console.log(usuarioEncontrado);
        return;
    }
    res.json('Usuario no encontrado');
    return;
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