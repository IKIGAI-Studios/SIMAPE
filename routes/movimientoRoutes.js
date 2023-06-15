import express from 'express';
import sequelize from '../utils/DBconnection.js';

const movimientoRoutes = express.Router();

movimientoRoutes.get('/obtenerMisMovimientos', async (req, res) => {
    try {
        const { matricula } = req.session.user;

        const movimientosNormales = await sequelize.query(
            `SELECT movimiento.folio, matricula, motivo, fecha, tipo_movimiento, nss FROM movimiento INNER JOIN movimientoNormal ON (movimiento.folio = movimientoNormal.folio) WHERE movimiento.matricula = ${matricula} && movimientoNormal.pendiente != true && movimiento.tipo_movimiento IN('INGRESO', 'EXTRACCION') ORDER BY movimiento.fecha DESC LIMIT 5`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // const movimientosTransferencia = await sequelize.query(
        //     `SELECT movimiento.folio, matricula, motivo, fecha, tipo_movimiento, nss FROM movimiento INNER JOIN movimientoTransferencia ON (movimiento.folio = movimientoTransferencia.folio) WHERE movimiento.matricula = ${matricula} && movimientoTransferencia.pendiente != true ORDER BY movimiento.fecha DESC LIMIT 5`,
        //     { type: sequelize.QueryTypes.SELECT }
        // );

        // const movimientos = movimientosTransferencia.concat(movimientosNormales);

        return res.status(200).json(movimientosNormales);
    } 
    catch (e) {
        return res.status(400).json(e.message);
    }
});


export default movimientoRoutes;