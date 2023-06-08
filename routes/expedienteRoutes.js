import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';
import Expediente from '../models/expedienteModel.js';
import Movimiento from '../models/movimientoModel.js';
import SuperDate from '../utils/Superdate.js';
import { fn, col } from 'sequelize';

const expedienteRoutes = express.Router();

// * Dar de alta un expediente
expedienteRoutes.post('/altaExpediente', async (req, res) => {
    try {
        const {nss, nombre, categoria, delegacion, ubicacion, observaciones, año} = req.body;

        // Validar que el usuario sea único
        const expedienteRegistrado = await Expediente.findOne({ 
            where: { 
                nss
            },
            attributes: ['nss']
        });

        if (expedienteRegistrado) {
            throw new Error('El expediente ya ha sido registrado');
        }

        const nuevoExpediente = await Expediente.create({
            nss,
            nombre,
            categoria,
            fecha_alta: new Date(),
            delegacion,
            ubicacion,
            estatus: true,
            año,
            matricula: req.session.user.matricula,
            observaciones
        });

        res.statusMessage = 'Expediente registrado correctamente';
        res.json('Expediente registrado')
    }
    catch (e) {
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
})

// * Baja expediente
expedienteRoutes.post('/bajaExpediente', async (req, res) => {
    // TODO: Comprobar el tipo de usuario para realizar la petición en caso de ser operativo
    try {
        const { nss } = req.params;

        // Buscar el expediente
        const expediente = await Expediente.findOne({
            where: {
                nss
            }
        });

        if (!expediente) {
            throw new Error('Expediente no encontrado');
        }

        expediente.update({
            fecha_baja: new Date(),
            estatus: false
        });

        res.statusMessage = 'Expediente dado de baja correctamente';
        return res.json(expediente);
    } 
    catch (e) {
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
});

// * Buscar un expediente por su nss
expedienteRoutes.get('/buscarPorNSS/:nss', async (req, res) => {
    try {
        const { nss } = req.params;

        // Buscar el expediente
        const expediente = await Expediente.findOne({
            where: {
                nss
            }
        });

        if (!expediente) {
            throw new Error('Expediente no encontrado');
        }

        // Buscar los movimientos del expediente
        const movimientos = await Movimiento.findAll({
            where: {
                nss
            },
            order: [['fecha', 'DESC']],
            limit: 5
        });

        // Regresar todos los datos
        return res.json({
            expediente,
            movimientos
        });
    } 
    catch (e) {
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
});

// * Extraer/Ingresar un expediente
expedienteRoutes.post('/movimiento', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss, tipo_movimiento, motivo } = req.body;

        // Validar que el tipo de movimiento sea válido
        if (!TIPO_MOVIMIENTO[tipo_movimiento]) {
            throw new Error('Tipo de movimiento inválido');
        }

        // Obtener numero de folios
        const numFolios = await Movimiento.findAll({
            attributes: [
              [fn('COUNT', col('folio')), 'numeroMovimientos']
            ]
        });

        const folio = numFolios[0].get('numeroMovimientos');

        // Buscar el expediente
        const expedienteEncontrado = await Expediente.findOne({ 
            where: { 
                nss
            },
            attributes: ['nss', 'extraido']
        });

        // TODO: Comprobar si el movimiento se puede realizar
        // Actualizar el estado del expediente
        await expedienteEncontrado.update(
            { extraido: tipo_movimiento === TIPO_MOVIMIENTO.EXTRACCION }
        );
        
        // Crear nuevo movimiento
        const nuevoMovimiento = await Movimiento.create({
            matricula,
            nss,
            tipo_movimiento,
            fecha: new Date(),
            folio,
            motivo
        });
        
        return res.json('Movimiento realizado con éxito');
    } 
    catch (e) {
        console.log(e);
    }
});

const TIPO_MOVIMIENTO = {
    EXTRACCION: 'EXTRACCION',
    INGRESO: 'INGRESO'
}


export default expedienteRoutes;