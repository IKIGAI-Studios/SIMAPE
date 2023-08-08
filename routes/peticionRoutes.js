import express from 'express';
import Peticion from '../models/peticionModel.js';
import Expediente from '../models/expedienteModel.js';
import MovimientoNormal from '../models/movimientoNormalModel.js';
import MovimientoTransferencia from '../models/movimientoTransferenciaModel.js';
import Usuario from '../models/usuarioModel.js';
import sequelize from '../utils/DBconnection.js';
import { ESTADO_PETICION, TIPO_USUARIO } from '../utils/constants.js';

const peticionRoutes = express.Router();

peticionRoutes.get('/obtenerPeticiones', async (req, res) => {
    try {
        const peticionesNormales = await sequelize.query(`
            SELECT peticion.folio, peticion.estado, peticion.tipo, movimiento.matricula, movimiento.fecha, movimientonormal.nss, usuario.nombre, usuario.apellidos
            FROM peticion INNER JOIN movimiento ON (peticion.folio = movimiento.folio) INNER JOIN usuario ON (movimiento.matricula = usuario.matricula) INNER JOIN 
            movimientonormal ON (movimiento.folio = movimientonormal.folio) ORDER BY movimiento.fecha DESC
        `, { type: sequelize.QueryTypes.SELECT }
        );

        const peticionesTransferencia = await sequelize.query(`
        SELECT peticion.folio, peticion.estado, peticion.tipo, movimiento.matricula, movimiento.fecha, movimientotransferencia.nss, movimientotransferencia.del_destino, delegacion.*, usuario.nombre, usuario.apellidos
        FROM peticion INNER JOIN movimiento ON (peticion.folio = movimiento.folio) INNER JOIN usuario ON (movimiento.matricula = usuario.matricula) INNER JOIN 
        movimientotransferencia ON (movimiento.folio = movimientotransferencia.folio) INNER JOIN delegacion ON (movimientotransferencia.del_destino = delegacion.id_delegacion) ORDER BY movimiento.fecha DESC
        `, { type: sequelize.QueryTypes.SELECT }
        );

        const peticiones = peticionesTransferencia.concat(peticionesNormales);

        return res.status(200).json(peticiones);
    } 
    catch (e) {
        return res.status(400).json('Error');
    }
});

peticionRoutes.get('/obtenerMisPeticiones', async (req, res) => {
    try {
        const { matricula } = req.session.user;

        const peticiones = await sequelize.query(`
        SELECT peticion.*, usuario.nombre, usuario.apellidos, movimiento.fecha FROM peticion INNER JOIN movimiento ON peticion.folio = movimiento.folio INNER JOIN usuario ON movimiento.matricula = usuario.matricula WHERE 
        usuario.matricula = ${matricula} AND (
        peticion.folio IN (SELECT folio FROM movimientoNormal) OR 
        peticion.folio IN (SELECT folio FROM movimientoTransferencia)) ORDER BY movimiento.fecha DESC
        `, { type: sequelize.QueryTypes.SELECT }
        );

        return res.status(200).json(peticiones);
    } 
    catch (e) {
        return res.status(400).json('Error');
    }
});

peticionRoutes.post('/confirmarPeticionBaja', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { folio } = req.body;

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });
        if (!usuarioVal.existe || usuarioVal.usuario.tipo_usuario !== TIPO_USUARIO.ADMINISTRADOR) {
            return res.status(400).json('Error de autenticación');
        }

        // Validar movimientos
        const movimientoBD = await MovimientoNormal.existe({ folio });
        const peticionBD = await Peticion.existe({ folio });
        const expedienteBD = await Expediente.existe({ nss:movimientoBD.movimientoNormal.nss });


        if (!peticionBD.existe || !movimientoBD.existe || !expedienteBD.existe) {
            return res.status(400).json('Peticion no válida');
        }

        // Actualizar peticion
        await peticionBD.peticion.update({
            estado: ESTADO_PETICION.ACEPTADO
        });

        // Actualizar movimiento
        await movimientoBD.movimientoNormal.update({
            pendiente: false
        });

        // Actualizar expediente
        await expedienteBD.expediente.update({
            estatus: false
        });

        return res.status(200).json('Peticion de baja confirmada');
    } 
    catch (e) {
        return res.status(400).json(e.message);
    }
});

peticionRoutes.post('/confirmarPeticionTransferencia', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { folio } = req.body;

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });
        if (!usuarioVal.existe || usuarioVal.usuario.tipo_usuario !== TIPO_USUARIO.ADMINISTRADOR) {
            return res.status(400).json('Error de autenticación');
        }

        // Validar movimientos
        const movimientoBD = await MovimientoTransferencia.existe({ folio });
        console.log(movimientoBD);
        const peticionBD = await Peticion.existe({ folio });
        const expedienteBD = await Expediente.existe({ nss:movimientoBD.movimientoTransferencia.nss });


        if (!peticionBD.existe || !movimientoBD.existe || !expedienteBD.existe) {
            return res.status(400).json('Peticion no válida');
        }

        // Actualizar peticion
        await peticionBD.peticion.update({
            estado: ESTADO_PETICION.ACEPTADO
        });

        // Actualizar movimiento
        await movimientoBD.movimientoTransferencia.update({
            pendiente: false
        });

        // Actualizar expediente
        await expedienteBD.expediente.update({
            estatus: false,
            ubicacion: 'TRANSFERIDO',
            delegacion: movimientoBD.movimientoTransferencia.del_destino,
        });

        return res.status(200).json('Peticion de transferencia confirmada');
    } 
    catch (e) {
        return res.status(400).json(e.message);
    }
});

peticionRoutes.post('/rechazarPeticion', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { folio } = req.body;

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });
        if (!usuarioVal.existe || usuarioVal.usuario.tipo_usuario !== TIPO_USUARIO.ADMINISTRADOR) {
            return res.status(400).json('Error de autenticación');
        }

        // Validar movimientos
        const peticionBD = await Peticion.existe({ folio });


        if (!peticionBD.existe) {
            return res.status(400).json('Peticion no válida');
        }

        // Actualizar peticion
        await peticionBD.peticion.update({
            estado: ESTADO_PETICION.RECHAZADO
        });

        return res.status(200).json('Peticion rechazada');
    } 
    catch (e) {
        return res.status(400).json(e.message);
    }
});


export default peticionRoutes;