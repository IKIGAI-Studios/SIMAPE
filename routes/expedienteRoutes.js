import express from 'express';
import Expediente, { Expediente as ExpedienteModel } from '../models/expedienteModel.js';
import Movimiento, { Movimiento as MovimientoModel } from '../models/movimientoModel.js';
import MovimientoNormal, { MovimientoNormal as MovimientoNormalModel } from '../models/movimientoNormalModel.js';
import MovimientoTransferencia from '../models/movimientoTransferenciaModel.js';
import { fn, col } from 'sequelize';
import { TIPO_MOVIMIENTO } from '../utils/constants.js';
import movimientoNormalModel from '../models/movimientoNormalModel.js';
import sequelize from '../utils/DBconnection.js';

const expedienteRoutes = express.Router();

// * Dar de alta un expediente
expedienteRoutes.post('/altaExpediente', async (req, res) => {
    try {
        // Obtener datos
        const { nss, nombre, categoria, delegacion, ubicacion, observaciones, año } = req.body;
        const { matricula } = req.session.user;

        const nuevoExpediente = {
            nss,
            nombre,
            categoria,
            fecha_alta: new Date(),
            fecha_baja: null,
            delegacion,
            ubicacion,
            estatus: true,
            año,
            matricula,
            observaciones,
            extraido: false
        };

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo: 'Alta expediente', 
            fecha: new Date(), 
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.ALTA
        };

        const nuevoMovimientoAlta = {
            folio,
            nss,
            pendiente: false, //TODO: Cambiar dependiendo del sujeto
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.ALTA,
        }

        // * Validar expediente
        const expedienteVal = await Expediente.validarExpediente(nuevoExpediente);

        if (!expedienteVal.valido) {
            return res.status(400).json(expedienteVal.errores.join(' '));
        }

        // Crear el expediente
        const expedienteCreado = await ExpedienteModel.create(nuevoExpediente);
        console.log('Expediente creado: \n', expedienteCreado);

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            await expedienteCreado.destroy();
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);
        console.log('Movimiento creado: \n',movimientoCreado);

        // * Validar movimientoAlta
        const movimientoAltaVal = await MovimientoNormal.validarMovimientoNormal(nuevoMovimientoAlta);
        if (!movimientoAltaVal.valido) {
            await expedienteCreado.destroy();
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoAltaVal.errores.join(' '));
        }

        // Crear movimientoAlta
        const movimientoAltaCreado = await MovimientoNormalModel.create(nuevoMovimientoAlta);
        console.log('Movimiento alta creado: \n',movimientoAltaCreado);

        // Devolver respuesta
        res.status(201).json(nuevoExpediente);
    }
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
})

// * Baja expediente
expedienteRoutes.post('/bajaExpediente', async (req, res) => {
    // TODO: Comprobar el tipo de usuario para realizar la petición en caso de ser operativo
    try {
        const { nss } = req.params;

        // Comprobar que existe el expediente
        const resExpediente = await Expediente.exists({ nss });
        if (!resExpediente.exists) throw new Error('El expediente no existe');

        resExpediente.expediente.update({
            fecha_baja: new Date(),
            estatus: false
        });

        res.statusMessage = 'Expediente dado de baja correctamente';
        return res.json(resExpediente.expediente);
    } 
    catch (e) {
        res.statusCode = 400;
        res.statusMessage = e.message;
        res.end();
    }
});

// * Buscar un expediente por su nss
expedienteRoutes.get('/buscarPorNSS/:nss', async (req, res) => {
    try {
        const { nss } = req.params;

        // Buscar el expediente
        const expediente = await ExpedienteModel.findOne({
            where: {
                nss
            }
        });

        if (!expediente) {
            throw new Error('Expediente no encontrado');
        }

        // Buscar los movimientos del expediente
        //TODO: Hacer esto con el ORM
        const movimientos = await sequelize.query(
            `SELECT movimiento.folio, matricula, motivo, fecha, tipo_movimiento FROM movimiento INNER JOIN movimientoNormal ON (movimiento.folio = movimientoNormal.folio) WHERE movimientoNormal.nss = ${nss} && movimientoNormal.pendiente != true;`,
            { type: sequelize.QueryTypes.SELECT }    
        );

        // const movimientos = await MovimientoModel.findAll({
        //     include: [{
        //         model: MovimientoNormalModel,
        //         where: {
        //             nss
        //         }
        //     }],
        //     order: [['fecha', 'DESC']],
        //     limit: 5
        // });

        // Regresar todos los datos
        return res.json({
            expediente,
            movimientos
        });
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * RUTAS DE MOVIMIENTOS
// * INGRESO
expedienteRoutes.post('/movimiento/ingreso', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss, motivo } = req.body;

        const resExpediente = await Expediente.exists({nss});
        if (resExpediente.exists) throw new Error('El expediente ya existe');

        // Obtener numero de folio
        const numFolios = await Movimiento.findAll({
            attributes: [
              [fn('COUNT', col('folio')), 'numeroMovimientos']
            ]
        });

        const folio = numFolios[0].get('numeroMovimientos') + 1;
        
        // Crear el movimiento nuevo movimiento
        crearMovimientoNormal({
            folio, 
            matricula, 
            motivo, 
            fecha, 
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.ALTA,
            nss, 
            pendiente: false
        })
        
        return res.json('Movimiento realizado con éxito');
    } 
    catch (e) {
        console.log(e);
    }
});

// * EXTRACCIÓN




function altaExpediente() {

}

/**
 * función que se encarga de generar únicamente el movimiento
 */




async function obtenerNumeroFolio() {
    // Obtener numero de folio
    const numFolios = await MovimientoModel.findAll({
        attributes: [
          [fn('COUNT', col('folio')), 'numeroMovimientos']
        ]
    });

    return numFolios[0].get('numeroMovimientos');
}





export default expedienteRoutes;