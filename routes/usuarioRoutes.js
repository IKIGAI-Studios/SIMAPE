import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';
import Expediente from '../models/expedienteModel.js';

const usuarioRoutes = express.Router();

// * Obtener todos los usuarios
usuarioRoutes.get('/obtenerUsuarios', async (req, res) => {
    const usuarios = await Usuario.findAll({
        where: { 
            estatus: true 
        },
        attributes: ['matricula', 'nombre', 'apellidos', 'adscripcion', 'estatus', 'fecha_registro']
    });

    if (usuarios)
    {
        res.json(usuarios);
        console.log(usuarios);
        return;
    }
    res.json('No hay usuarios');
    return;
});

// * Buscar usuario por matricula
usuarioRoutes.get('/busquedaUsuario/:matricula', async (req, res) => {
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

// * Registrar usuario
usuarioRoutes.post('/registrarUsuario', async (req, res) => {
    console.log(req.body);
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
        console.log(`Register ERROR: ${e}`);
        res.json(`ERROR ${e}`);
    }
});

export default usuarioRoutes;