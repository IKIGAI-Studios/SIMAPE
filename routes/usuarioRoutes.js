import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';
import Expediente from '../models/expedienteModel.js';
import SuperDate from '../utils/Superdate.js';

const usuarioRoutes = express.Router();

// * Obtener todos los usuarios
usuarioRoutes.get('/obtenerUsuarios/:filter', async (req, res) => {
    const usuarios = await Usuario.findAll({
        where: { 
            estatus: req.params.filter == 'activos' ? true : false 
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

        const nuevoUsuario = await Usuario.create({
            matricula,
            nombre,
            apellidos,
            adscripcion,
            tipo_usuario,
            usuario,
            pass : hashedPass,
            fecha_registro: SuperDate.today(),
            estatus: true
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