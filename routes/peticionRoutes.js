import express from 'express';
import { Peticion } from '../models/peticionModel.js';
import sequelize from '../utils/DBconnection.js';

const peticionRoutes = express.Router();

peticionRoutes.get('/obtenerPeticiones', async (req, res) => {
    try {
        const peticiones = await sequelize.query(`
            SELECT peticion.folio, peticion.estado, peticion.tipo, movimiento.matricula, movimiento.fecha, movimientonormal.nss, usuario.nombre, usuario.apellidos
            FROM peticion INNER JOIN movimiento ON (peticion.folio = movimiento.folio) INNER JOIN usuario ON (movimiento.matricula = usuario.matricula) INNER JOIN 
            movimientonormal ON (movimiento.folio = movimientonormal.folio) ORDER BY movimiento.fecha DESC;
        `, { type: sequelize.QueryTypes.SELECT }
        );

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
            SELECT peticion.folio, peticion.estado, peticion.tipo, movimiento.matricula, movimiento.fecha, movimientonormal.nss, usuario.nombre, usuario.apellidos
            FROM peticion INNER JOIN movimiento ON (peticion.folio = movimiento.folio) INNER JOIN usuario ON (movimiento.matricula = usuario.matricula) INNER JOIN 
            movimientonormal ON (movimiento.folio = movimientonormal.folio) WHERE usuario.matricula = ${matricula} ORDER BY movimiento.fecha DESC;
        `, { type: sequelize.QueryTypes.SELECT }
        );

        return res.status(200).json(peticiones);
    } 
    catch (e) {
        return res.status(400).json('Error');
    }
});


export default peticionRoutes;