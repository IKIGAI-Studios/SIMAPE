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
                        WHEN movimiento.tipo_movimiento = 'SUPERVISION_ENTRADA' OR movimiento.tipo_movimiento = 'SUPERVISION_SALIDA' THEN GROUP_CONCAT(COALESCE(movimientoNormal.nss, movimientoPrestamo.nss, movimientoSupervision.nss, movimientoTransferencia.nss) SEPARATOR ', ') 
                        ELSE COALESCE(movimientoNormal.nss, movimientoPrestamo.nss, movimientoSupervision.nss, movimientoTransferencia.nss) 
                    END AS nss
            FROM movimiento
            INNER JOIN usuario ON movimiento.matricula = usuario.matricula
            LEFT JOIN movimientoNormal ON movimiento.folio = movimientoNormal.folio
            LEFT JOIN movimientoPrestamo ON movimiento.folio = movimientoPrestamo.folio
            LEFT JOIN movimientoSupervision ON movimiento.folio = movimientoSupervision.folio
            LEFT JOIN movimientoTransferencia ON movimiento.folio = movimientoTransferencia.folio
            WHERE movimiento.matricula = ${matricula} AND (movimiento.tipo_movimiento IN('INGRESO', 'EXTRACCION', 'SUPERVISION_SALIDA', 'PRESTAMO', 'DEVOLUCION'))
            AND (movimiento.folio IN (SELECT folio FROM movimientoNormal) OR
                    movimiento.folio IN (SELECT folio FROM movimientoPrestamo) OR
                    movimiento.folio IN (SELECT folio FROM movimientoSupervision))
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
        if (movimiento.tipo_movimiento === TIPO_MOVIMIENTO.PRESTAMO || movimiento.tipo_movimiento === TIPO_MOVIMIENTO.DEVOLUCION) {
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

// * OBTENER TODOS LOS MOVIMIENTOS POR FECHA
movimientoRoutes.get('/obtenerMovimientosFecha', async (req, res) => {
    try {
        // Extraer las constantes
        const { fechaInicio, fechaFin, categoria } = req.query;
        let tipos = req.query.tipos;
        tipos = tipos.split(',');

        let movimientos = {};
        // Buscar todos los movimientos
        if (tipos.includes('ALTAS')) {
            const movimientosAlta = await sequelize.query(
                `SELECT movimientonormal.*, movimiento.fecha, usuario.nombre, usuario.apellidos FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio INNER JOIN usuario ON movimiento.matricula = usuario.matricula INNER JOIN expediente ON movimientonormal.nss = expediente.nss WHERE ${categoria !== 'todas' ? 'expediente.categoria = "'+ categoria +'" AND' : '' } movimiento.fecha > "${fechaInicio}" AND movimiento.fecha <= "${fechaFin}" AND movimiento.tipo_movimiento = 'ALTA' ORDER BY movimiento.fecha DESC`,
                { type: sequelize.QueryTypes.SELECT }
            );

            movimientos.altas = movimientosAlta;
        }

        if (tipos.includes('BAJAS')) {
            const movimientosBaja = await sequelize.query(
                `SELECT movimientonormal.*, movimiento.fecha, usuario.nombre, usuario.apellidos FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio INNER JOIN usuario ON movimiento.matricula = usuario.matricula INNER JOIN expediente ON movimientonormal.nss = expediente.nss WHERE ${categoria !== 'todas' ? 'expediente.categoria = "'+ categoria +'" AND' : '' } movimiento.fecha > "${fechaInicio}" AND movimiento.fecha <= "${fechaFin}" AND movimiento.tipo_movimiento = 'BAJA' ORDER BY movimiento.fecha DESC`,
                { type: sequelize.QueryTypes.SELECT }
            );

            movimientos.bajas = movimientosBaja;
        }

        if (tipos.includes('TRANSFERENCIAS')) {
            const movimientosTransferencia = await sequelize.query(
                `SELECT movimientotransferencia.*, movimiento.fecha, usuario.nombre, usuario.apellidos, delegacion.n_delegacion, delegacion.n_subdelegacion, delegacion.nom_delegacion, delegacion.nom_subdelegacion FROM movimientotransferencia INNER JOIN movimiento ON movimientotransferencia.folio = movimiento.folio INNER JOIN delegacion ON movimientotransferencia.del_destino = delegacion.id_delegacion INNER JOIN usuario ON movimiento.matricula = usuario.matricula INNER JOIN expediente ON movimientotransferencia.nss = expediente.nss  WHERE ${categoria !== 'todas' ? 'expediente.categoria = "'+ categoria +'" AND' : '' } movimiento.fecha > "${fechaInicio}" AND movimiento.fecha <= "${fechaFin}" AND movimiento.tipo_movimiento = 'TRANSFERENCIA' ORDER BY movimiento.fecha DESC`,
                { type: sequelize.QueryTypes.SELECT }
            );

            movimientos.transferencias = movimientosTransferencia;
        }

        return res.json(movimientos);
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
        const movimientosAlta = await sequelize.query(
            `SELECT movimientonormal.*, movimiento.fecha FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio WHERE movimiento.matricula = ${matricula} AND movimiento.tipo_movimiento = 'ALTA' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientosBaja = await sequelize.query(
            `SELECT movimientonormal.*, movimiento.fecha FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio WHERE movimiento.matricula = ${matricula} AND movimiento.tipo_movimiento = 'BAJA' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientosTransferencia = await sequelize.query(
            `SELECT movimientotransferencia.*, movimiento.fecha, delegacion.n_delegacion, delegacion.n_subdelegacion, delegacion.nom_delegacion, delegacion.nom_subdelegacion FROM movimientotransferencia INNER JOIN movimiento ON movimientotransferencia.folio = movimiento.folio INNER JOIN delegacion ON movimientotransferencia.del_destino = delegacion.id_delegacion WHERE movimiento.matricula = ${matricula} AND movimiento.tipo_movimiento = 'TRANSFERENCIA' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );
        
        const movimientosExtraccion = await sequelize.query(
            `SELECT movimientonormal.*, movimiento.fecha FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio WHERE movimiento.matricula = ${matricula} AND movimiento.tipo_movimiento = 'EXTRACCION' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientosIngreso = await sequelize.query(
            `SELECT movimientonormal.*, movimiento.fecha FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio WHERE movimiento.matricula = ${matricula} AND movimiento.tipo_movimiento = 'INGRESO' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientosPrestamo = await sequelize.query(
            `SELECT movimientoprestamo.*, movimiento.fecha, usuarioE.nombre, usuarioE.apellidos, usuarioR.nombre AS receptor_nombre, usuarioR.apellidos AS receptor_apellidos FROM movimientoprestamo INNER JOIN movimiento ON movimientoprestamo.folio = movimiento.folio INNER JOIN usuario AS usuarioE ON movimiento.matricula = usuarioE.matricula INNER JOIN usuario AS usuarioR ON movimientoprestamo.matricula_receptor = usuarioR.matricula WHERE movimiento.matricula = ${matricula} AND movimiento.tipo_movimiento = 'PRESTAMO'`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientosSupervision= await sequelize.query(
            `SELECT movimientosupervision.*, movimiento.fecha FROM movimientosupervision INNER JOIN movimiento ON movimientosupervision.folio = movimiento.folio WHERE movimiento.matricula = ${matricula} AND movimiento.tipo_movimiento = 'SUPERVISION_SALIDA' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Retornar todos los movimientos
        return res.status(200).json({
            altas: movimientosAlta,
            bajas: movimientosBaja,
            transferencias: movimientosTransferencia,
            extracciones: movimientosExtraccion,
            ingresos: movimientosIngreso,
            prestamos: movimientosPrestamo,
            supervisiones: movimientosSupervision
        });
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});

// * OBTENER TODOS LOS MOVIMIENTOS DE UN EXPEDIENTE
movimientoRoutes.get('/obtenerMovimientosExpediente/:nss', async (req, res) => {
    try {
        // Extraer las constantes
        const { nss } = req.params;

        // Buscar todos los movimientos
        let movimientoAlta = await sequelize.query(
            `SELECT movimientonormal.*, movimiento.fecha, usuario.nombre, usuario.apellidos FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio INNER JOIN usuario ON movimiento.matricula = usuario.matricula WHERE movimientonormal.nss = ${nss} AND movimiento.tipo_movimiento = 'ALTA' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );
        movimientoAlta = movimientoAlta[0];

        let movimientoBaja = await sequelize.query(
            `SELECT movimientonormal.*, movimiento.fecha, usuario.nombre, usuario.apellidos FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio INNER JOIN usuario ON movimiento.matricula = usuario.matricula WHERE movimientonormal.nss = ${nss} AND movimiento.tipo_movimiento = 'BAJA' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );
        movimientoBaja = movimientoBaja[0];

        let movimientoTransferencia = await sequelize.query(
            `SELECT movimientotransferencia.*, movimiento.fecha, usuario.nombre, usuario.apellidos, delegacion.n_delegacion, delegacion.n_subdelegacion, delegacion.nom_delegacion, delegacion.nom_subdelegacion FROM movimientotransferencia INNER JOIN movimiento ON movimientotransferencia.folio = movimiento.folio INNER JOIN delegacion ON movimientotransferencia.del_destino = delegacion.id_delegacion INNER JOIN usuario ON movimiento.matricula = usuario.matricula WHERE movimientotransferencia.nss = ${nss} AND movimiento.tipo_movimiento = 'TRANSFERENCIA' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );
        movimientoTransferencia = movimientoTransferencia[0];
        
        const movimientosExtraccion = await sequelize.query(
            `SELECT movimientonormal.*, movimiento.fecha, usuario.nombre, usuario.apellidos FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio INNER JOIN usuario ON movimiento.matricula = usuario.matricula WHERE movimientonormal.nss = ${nss} AND movimiento.tipo_movimiento = 'EXTRACCION' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientosIngreso = await sequelize.query(
            `SELECT movimientonormal.*, movimiento.fecha, usuario.nombre, usuario.apellidos FROM movimientonormal INNER JOIN movimiento ON movimientonormal.folio = movimiento.folio INNER JOIN usuario ON movimiento.matricula = usuario.matricula WHERE movimientonormal.nss = ${nss} AND movimiento.tipo_movimiento = 'INGRESO' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientosPrestamo = await sequelize.query(
            `SELECT movimientoprestamo.*, movimiento.fecha, usuarioE.nombre, usuarioE.apellidos, usuarioR.nombre AS receptor_nombre, usuarioR.apellidos AS receptor_apellidos FROM movimientoprestamo INNER JOIN movimiento ON movimientoprestamo.folio = movimiento.folio INNER JOIN usuario AS usuarioE ON movimiento.matricula = usuarioE.matricula INNER JOIN usuario AS usuarioR ON movimientoprestamo.matricula_receptor = usuarioR.matricula WHERE movimientoprestamo.nss = ${nss} AND movimiento.tipo_movimiento = 'PRESTAMO' ORDER BY movimiento.fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientosSupervision= await sequelize.query(
            `SELECT movimientosupervision.*, movimiento.fecha, usuario.nombre, usuario.apellidos FROM movimientosupervision INNER JOIN movimiento ON movimientosupervision.folio = movimiento.folio INNER JOIN usuario ON movimiento.matricula = usuario.matricula WHERE movimientosupervision.nss = ${nss} AND movimiento.tipo_movimiento = 'SUPERVISION_SALIDA' ORDER BY fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Retornar todos los movimientos
        return res.status(200).json({
            alta: movimientoAlta,
            baja: movimientoBaja,
            transferencia: movimientoTransferencia,
            extracciones: movimientosExtraccion,
            ingresos: movimientosIngreso,
            prestamos: movimientosPrestamo,
            supervisiones: movimientosSupervision
        });
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
});

export default movimientoRoutes;