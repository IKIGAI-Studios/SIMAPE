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
        return;
    }
    res.json('No hay usuarios');
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
usuarioRoutes.post('/altaUsuario', async (req, res) => {
    try {
        const {matricula, nombre, apellidos, adscripcion, tipo_usuario, usuario, pass} = req.body;

        // Validar que el usuario sea único
        const usuarioRegistrado = await Usuario.findOne({ 
            where: { 
                usuario 
            },
            attributes: ['usuario']
        });

        if (usuarioRegistrado) {
            throw new Error('ERROR: Usuario registrado anteriormente');
        }

        // Validar que la matricula sea único
        const matriculaRegistrada = await Usuario.findOne({ 
            where: { 
                matricula 
            },
            attributes: ['matricula']
        });

        if (matriculaRegistrada) {
            throw new Error('ERROR: Matricula registrada anteriormente');
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

        res.statusMessage = 'Usuario registrado correctamente';
        res.json('Usuario registrado')
    } 
    catch (e) {
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
});

// * Dar de baja a un usuario
usuarioRoutes.post('/bajaUsuario', async (req, res) => {
    try {
        const {matricula} = req.body;

        // Validar que el usuario exista
        const usuarioRegistrado = await Usuario.findOne({ 
            where: { 
                matricula 
            },
            attributes: ['nombre', 'matricula']
        });

        if (!usuarioRegistrado) {
            throw new Error('ERROR: Usuario no existe');
        }

        // Actualizar el usuario
        await usuarioRegistrado.update(
            { estatus: false }
        );

        res.statusMessage = `Usuario ${usuarioRegistrado.nombre} dado de baja correctamente`;
        res.json(`Usuario ${usuarioRegistrado.nombre} dado de baja correctamente`);
    } 
    catch (e) {
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
});

// * Recuperar un usuario dado de baja
usuarioRoutes.post('/recuperarUsuario', async (req, res) => {
    try {
        const {matricula} = req.body;

        // Validar que el usuario exista
        const usuarioRegistrado = await Usuario.findOne({ 
            where: { 
                matricula 
            },
            attributes: ['nombre', 'matricula']
        });

        if (!usuarioRegistrado) {
            throw new Error('ERROR: Usuario no existe');
        }

        // Actualizar el usuario
        await usuarioRegistrado.update(
            { estatus: true }
        );

        res.statusMessage = `Usuario ${usuarioRegistrado.nombre} recuperado correctamente`;
        res.json(`Usuario ${usuarioRegistrado.nombre} recuperado correctamente`);
    } 
    catch (e) {
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
});

export default usuarioRoutes;