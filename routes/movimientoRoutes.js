import express from 'express';
import sequelize from '../utils/DBconnection.js';
import Usuario from '../models/usuarioModel.js';
import { TIPO_MOVIMIENTO } from '../utils/constants.js';
import MovimientoNormal from '../models/movimientoNormalModel.js';
import MovimientoTransferencia from '../models/movimientoTransferenciaModel.js';
import MovimientoPrestamo from '../models/movimientoPrestamoModel.js';
import MovimientoSupervision from '../models/movimientoSupervisionModel.js';
import { validarUsuario } from './validarUsuario.js';

const movimientoRoutes = express.Router();

// Middleware para validar usuario
movimientoRoutes.use('/*', async (req, res, next) => {  
    if (!req.session.user) {
        return res.redirect('/');
    }

    const { matricula } = req.session.user;

    const esValido = await validarUsuario(matricula);
    
    if (!esValido) {
        return res.status(400).json('Error de autenticación');
    }

    next();
});

movimientoRoutes.get('/obtenerMisMovimientos', async (req, res) => {
    try {
        const { matricula } = req.session.user;

        const movimientosNormales = await sequelize.query(
            `SELECT movimiento.*, usuario.nombre, usuario.apellidos,
                    CASE
                        WHEN movimiento.tipo_movimiento = 'SUPERVISION_ENTRADA' OR movimiento.tipo_movimiento = 'SUPERVISION_SALIDA' THEN GROUP_CONCAT(COALESCE(movimientonormal.nss, movimientoprestamo.nss, movimientosupervision.nss, movimientotransferencia.nss) SEPARATOR ', ') 
                        ELSE COALESCE(movimientonormal.nss, movimientoprestamo.nss, movimientosupervision.nss, movimientotransferencia.nss) 
                    END AS nss
            FROM movimiento
            INNER JOIN usuario ON movimiento.matricula = usuario.matricula
            LEFT JOIN movimientonormal ON movimiento.folio = movimientonormal.folio
            LEFT JOIN movimientoprestamo ON movimiento.folio = movimientoprestamo.folio
            LEFT JOIN movimientosupervision ON movimiento.folio = movimientosupervision.folio
            LEFT JOIN movimientotransferencia ON movimiento.folio = movimientotransferencia.folio
            WHERE movimiento.matricula = ${matricula} AND (movimiento.tipo_movimiento IN('INGRESO', 'EXTRACCION', 'SUPERVISION_SALIDA', 'PRESTAMO', 'DEVOLUCION'))
            AND (movimiento.folio IN (SELECT folio FROM movimientonormal) OR
                    movimiento.folio IN (SELECT folio FROM movimientoprestamo) OR
                    movimiento.folio IN (SELECT folio FROM movimientosupervision))
            GROUP BY movimiento.folio, movimiento.tipo_movimiento
            ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        return res.status(200).json(movimientosNormales);
    } 
    catch (e) {
        return res.status(400).json(e.message);
    }
});

movimientoRoutes.get('/buscarPorFolio/:folio', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { folio } = req.params;

        // Obtener los datos de movimiento
        const movimientos = await sequelize.query(
            `SELECT movimiento.*, usuario.nombre, usuario.apellidos FROM movimiento INNER JOIN usuario ON (movimiento.matricula = usuario.matricula) WHERE folio = ${folio};`,
            { type: sequelize.QueryTypes.SELECT }
        );
        
        if (!movimientos[0]) {
            return res.status(404).json('No existe el movimiento');
        }

        const movimiento = movimientos[0];

        // Obtener datos de cada movimiento específico
        if (TIPO_MOVIMIENTO.NORMAL[movimiento.tipo_movimiento]) {
            const movimientosNormales = await sequelize.query(
                `SELECT movimientonormal.*, expediente.nombre FROM movimientonormal INNER JOIN expediente ON (movimientonormal.nss = expediente.nss) WHERE folio = ${folio}`,
                { type: sequelize.QueryTypes.SELECT }
            );

            const movimientoNormal = movimientosNormales[0];

            return res.status(200).json({
                ...movimiento,
                movimientoNormal
            });
        }
        if (movimiento.tipo_movimiento === TIPO_MOVIMIENTO.PRESTAMO) {
            const movimientosPrestamos = await sequelize.query(
                `SELECT movimientoprestamo.*, expediente.nombre, usuario.nombre as nombre_receptor, usuario.apellidos as apellidos_receptor FROM movimientoprestamo INNER JOIN expediente ON (movimientoprestamo.nss = expediente.nss) INNER JOIN movimiento ON (movimientoprestamo.folio = movimiento.folio) INNER JOIN usuario ON (movimientoprestamo.matricula_receptor = usuario.matricula) WHERE movimiento.folio = ${folio}`,
                { type: sequelize.QueryTypes.SELECT }
            );

            const movimientoPrestamo = movimientosPrestamos[0];

            return res.status(200).json({
                ...movimiento,
                movimientoPrestamo
            });
        }

        if (movimiento.tipo_movimiento === TIPO_MOVIMIENTO.SUPERVISION_SALIDA) {
            const movimientosSupervision = await sequelize.query(
                `SELECT movimientosupervision.*, expediente.nombre FROM movimientosupervision INNER JOIN expediente ON (movimientosupervision.nss = expediente.nss) WHERE folio = ${folio}`,
                { type: sequelize.QueryTypes.SELECT }
            );

            return res.status(200).json({
                ...movimiento,
                movimientosSupervision
            });
        }
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});

// * OBTENER TODOS LOS MOVIMIENTOS DE UN USUARIO
movimientoRoutes.get('/obtenerMovimientosUsuario/:matricula', async (req, res) => {
    try {
        // Extraer las constantes
        const { matricula } = req.params;

        // Buscar todos los movimientos
        
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});

export default movimientoRoutes;