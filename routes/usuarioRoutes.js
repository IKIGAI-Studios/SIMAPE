import express from 'express';
import bcrypt from 'bcrypt';
import Usuario, { Usuario as UsuarioModel } from '../models/usuarioModel.js';
import { subirArchivo } from '../middlewares/subirArchivos.js';
import multer  from 'multer';
import sequelize from '../utils/DBconnection.js';

const upload = multer({ dest: 'src/uploads/' });

const usuarioRoutes = express.Router();

// * Obtener mi matricula
usuarioRoutes.get('/obtenerMiMatricula', async (req, res) => {
    if (!req.session.user) {
        return new Error('Inicio de sesión fallido');
    }

    return res.json(req.session.user.matricula);
});

// * Obtener todos los usuarios
usuarioRoutes.get('/obtenerUsuarios/:filter', async (req, res) => {
    const { matricula } = req.session.user;

    const usuarios = await sequelize.query(
        `SELECT matricula, nombre, apellidos, adscripcion, estatus, fecha_registro FROM usuario WHERE estatus=${req.params.filter == 'activos' ? 'TRUE' : 'FALSE'} && matricula != '${matricula}'`,
        { type: sequelize.QueryTypes.SELECT }
    );

    if (usuarios)
    {
        return res.json(usuarios);
    }
    res.json('No hay usuarios');
});

// * Buscar usuario por matricula
usuarioRoutes.get('/busquedaUsuario/:matricula', async (req, res) => {
    const usuarioEncontrado = await UsuarioModel.findOne({
        where: { 
            matricula: req.params.matricula 
        },
        attributes: ['matricula', 'nombre', 'apellidos', 'adscripcion', 'estatus', 'fecha_registro', 'tipo_usuario', 'foto']
    });

    if (!usuarioEncontrado)
    {
        return res.status(404).json('Usuario no encontrado');
    }

    return res.json(usuarioEncontrado);
});

usuarioRoutes.post('/altaUsuarioSinFoto', async (req, res) => {
    try {
        const { matricula, nombre, apellidos, adscripcion, tipo_usuario, usuario, pass } = req.body;

        console.log(req.body);

        // Validar que el usuario sea único
        const usuarioRegistrado = await UsuarioModel.findOne({
            where: {
                usuario
            },
            attributes: ['usuario']
        });

        if (usuarioRegistrado) {
            throw new Error('ERROR: Usuario registrado anteriormente');
        }

        // Validar que la matricula sea único
        const matriculaRegistrada = await UsuarioModel.findOne({ 
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


        const nuevoUsuario = await UsuarioModel.create({
            matricula,
            nombre,
            apellidos,
            adscripcion,
            tipo_usuario,
            usuario,
            pass : hashedPass,
            fecha_registro: new Date(),
            estatus: true,
            foto: ''
        });

        res.statusMessage = 'Usuario registrado correctamente';
        res.json('Usuario registrado')
    } 
    catch (e) {
        return res.status(400).json(e.message);
    }
});


// * Registrar usuario
usuarioRoutes.post('/altaUsuario', subirArchivo('usuario', 'foto'), async (req, res) => {
    
    console.log(req.file);

    try {
        const { matricula, nombre, apellidos, adscripcion, tipo_usuario, usuario, pass } = req.body;
        const foto = req.file.filename ?? null;

        // Validar que el usuario sea único
        const usuarioRegistrado = await UsuarioModel.findOne({ 
            where: { 
                usuario 
            },
            attributes: ['usuario']
        });

        if (usuarioRegistrado) {
            throw new Error('ERROR: Usuario registrado anteriormente');
        }

        // Validar que la matricula sea único
        const matriculaRegistrada = await UsuarioModel.findOne({ 
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


        const nuevoUsuario = await UsuarioModel.create({
            matricula,
            nombre,
            apellidos,
            adscripcion,
            tipo_usuario,
            usuario,
            pass : hashedPass,
            fecha_registro: new Date(),
            estatus: true,
            foto
        });

        res.statusMessage = 'Usuario registrado correctamente';
        res.json('Usuario registrado')
    } 
    catch (e) {
        return res.status(400).json(e.message);
    }
});

// * Dar de baja a un usuario
usuarioRoutes.post('/bajaUsuario', async (req, res) => {
    try {
        const { matricula } = req.body;

        // Validar que el usuario exista
        const usuarioRegistrado = await UsuarioModel.findOne({ 
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
        return res.status(400).json(e.message);
    }
});

// * Recuperar un usuario dado de baja
usuarioRoutes.post('/recuperarUsuario', async (req, res) => {
    try {
        const {matricula} = req.body;

        // Validar que el usuario exista
        const usuarioRegistrado = await UsuarioModel.findOne({ 
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
        return res.status(400).json('Error en cambiar contraseña');
    }
});

// * Editar un usuario
usuarioRoutes.post('/editarUsuario', async (req, res) => {
    try {
        const { matricula } = req.body;

        // Validar que el usuario exista
        const usuarioBD = await Usuario.existe({ matricula });

        if (!usuarioBD.existe) {
            return res.status(400).json('Error de validación');
        }

        // Encriptar contraseña
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(req.body.pass, saltRounds);

        req.body.pass = hashedPass;
        
        // Actualizar el usuario
        await usuarioBD.usuario.update({  
            ...req.body
        });

        return res.json('Usuario actualizado');
    } 
    catch (e) {
        return res.status(400).json(e.message);
    }
});

// * Cambiar contraseña de usuario
usuarioRoutes.post('/cambiarPass', async (req, res) => {
    try {
        const { passActual, passNuevo } = req.body;
        const { matricula } = req.session.user;
    
        const usuario = await Usuario.existe({ matricula });

        if (!usuario.existe) {
            return res.status(400).json('Error de validación');
        }

        // Comparar contraseña actual
        const passActualVal = await bcrypt.compare(passActual, usuario.usuario.pass);
        if (!passActualVal) {
            return res.status(400).json('Contraseña incorrecta');
        }

        // Comparar contraseña actual con nueva
        const passNuevoVal = await bcrypt.compare(passNuevo, usuario.usuario.pass);
        if (passNuevoVal) {
            return res.status(400).json('La contraseña nueva es igual a la actual');
        }

        // Encriptar nueva contraseña
        const saltRounds = 10;
        const passNuevoHash = await bcrypt.hash(passNuevo, saltRounds);

        // Cambiar contraseña
        await usuario.usuario.update({
            pass: passNuevoHash
        });

        return res.status(200).json('El cambio se realizó correctamente');
    }
    catch(e) {
        console.log(e);
        return res.status(400).json('Error en cambiar contraseña');
    }
});

export default usuarioRoutes;