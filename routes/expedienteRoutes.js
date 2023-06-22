import express from 'express';
import Usuario from '../models/usuarioModel.js';
import Expediente, { Expediente as ExpedienteModel } from '../models/expedienteModel.js';
import Movimiento, { Movimiento as MovimientoModel } from '../models/movimientoModel.js';
import MovimientoNormal, { MovimientoNormal as MovimientoNormalModel } from '../models/movimientoNormalModel.js';
import MovimientoTransferencia, { MovimientoTransferencia as MovimientoTransferenciaModel } from '../models/movimientoTransferenciaModel.js';
import { Peticion as PeticionModel } from '../models/peticionModel.js';
import { fn, col } from 'sequelize';
import { ESTADO_PETICION, TIPO_MOVIMIENTO, TIPO_PETICION, TIPO_USUARIO } from '../utils/constants.js';
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
        const resExpediente = await Expediente.existe({ nss });
        if (!resExpediente.existe) {
            return res.status(404).json('')
        }

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
        const expedienteBD = await Expediente.existe({ nss });

        if (!expedienteBD.existe) {
            return res.status(404).json('Expediente no encontrado');
        }

        // Buscar los movimientos del expediente
        //TODO: Hacer esto con el ORM
        const movimientosNormales = await sequelize.query(
            `SELECT movimiento.folio, matricula, motivo, fecha, tipo_movimiento FROM movimiento INNER JOIN movimientoNormal ON (movimiento.folio = movimientoNormal.folio) WHERE movimientoNormal.nss = ${nss} && movimientoNormal.pendiente != true ORDER BY movimiento.fecha DESC LIMIT 5`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const transferencia = await sequelize.query(
            `SELECT movimiento.folio, matricula, motivo, fecha, tipo_movimiento FROM movimiento INNER JOIN movimientoTransferencia ON (movimiento.folio = movimientoTransferencia.folio) WHERE movimientoTransferencia.nss = ${nss} && movimientoTransferencia.pendiente != true ORDER BY movimiento.fecha DESC LIMIT 5;`,
            { type: sequelize.QueryTypes.SELECT }
        );

        const movimientos = transferencia.concat(movimientosNormales);

        // Regresar todos los datos
        return res.json({
            expediente: expedienteBD.expediente,
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

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo, 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.INGRESO
        };

        const nuevoMovimientoIngreso = {
            folio,
            nss,
            pendiente: false, //TODO: Cambiar dependiendo del sujeto
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.INGRESO,
        }

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);
        console.log('Movimiento creado: \n',movimientoCreado);

        // * Validar movimientoIngreso
        const movimientoIngresoVal = await MovimientoNormal.validarMovimientoNormal(nuevoMovimientoIngreso);
        if (!movimientoIngresoVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoIngresoVal.errores.join(' '));
        }

        // Crear movimientoAlta
        const movimientoIngresoCreado = await MovimientoNormalModel.create(nuevoMovimientoIngreso);
        console.log('Movimiento ingreso creado: \n',movimientoIngresoCreado);

        // Actualizar expediente
        const expedienteBD = (await Expediente.existe({ nss })).expediente;
        await expedienteBD.update({
            extraido: false
        });

        // Devolver respuesta
        return res.status(201).json('Ingreso realizado con éxito');
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * EXTRACCION
expedienteRoutes.post('/movimiento/extraccion', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss, motivo } = req.body;

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo, 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.EXTRACCION
        };

        const nuevoMovimientoExtraccion = {
            folio,
            nss,
            pendiente: false,
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.EXTRACCION,
        }

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);
        console.log('Movimiento creado: \n',movimientoCreado);

        // * Validar movimientoExtraccion
        const movimientoExtraccionVal = await MovimientoNormal.validarMovimientoNormal(nuevoMovimientoExtraccion);
        if (!movimientoExtraccionVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoExtraccionVal.errores.join(' '));
        }

        // Crear movimientoAlta
        const movimientoExtraccionCreado = await MovimientoNormalModel.create(nuevoMovimientoExtraccion);
        console.log('Movimiento extracción creado: \n',movimientoExtraccionCreado);

        // Actualizar expediente
        const expedienteBD = (await Expediente.existe({ nss })).expediente;
        await expedienteBD.update({
            extraido: true
        });

        // Devolver respuesta
        return res.status(201).json('Extracción realizada con éxito');
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});
// * BAJA
expedienteRoutes.post('/movimiento/baja', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss, motivo } = req.body;

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo, 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.BAJA
        };
        
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        const nuevoMovimientoBaja = {
            folio,
            nss,
            pendiente: usuarioVal.usuario.tipo_usuario === TIPO_USUARIO.OPERATIVO, 
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.BAJA,
        }

        const nuevaPeticion = {
            folio,
            estado: ESTADO_PETICION.PENDIENTE,
            tipo: TIPO_PETICION.BAJA
        }

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);
        console.log('Movimiento creado: \n',movimientoCreado);

        // * Validar movimientoBaja
        const movimientoBajaVal = await MovimientoNormal.validarMovimientoNormal(nuevoMovimientoBaja);
        if (!movimientoBajaVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoBajaVal.errores.join(' '));
        }

        // Crear movimientoBaja
        const movimientoBajaCreado = await MovimientoNormalModel.create(nuevoMovimientoBaja);
        console.log('Movimiento baja creado: \n',movimientoBajaCreado);


        // Si el usuario es operativo, realizar la petición
        if (usuarioVal.usuario.tipo_usuario === TIPO_USUARIO.OPERATIVO) {
            const peticionCreada = await PeticionModel.create(nuevaPeticion);
            console.log('Peticion creada: \n',peticionCreada);
            // Devolver respuesta
            return res.status(201).json('Petición de baja realizada con éxito');
        }

        // Actualizar expediente
        const expedienteBD = (await Expediente.existe({ nss })).expediente;
        await expedienteBD.update({
            estatus: false
        });

        // Devolver respuesta
        return res.status(201).json('Baja realizada con éxito');
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * TRANSFERENCIA
expedienteRoutes.post('/movimiento/transferencia', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss, del_destino, motivo } = req.body;
        console.log('DELEGACION: ', del_destino);

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo, 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.TRANSFERENCIA
        };

        const nuevoMovimientoTransferencia = {
            folio,
            nss,
            pendiente: false, // TODO: CAMBIAR DESPUÉS
            del_destino,
            tipo_movimiento: TIPO_MOVIMIENTO.TRANSFERENCIA,
        }

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);
        console.log('Movimiento creado: \n',movimientoCreado);

        // * Validar movimientoTransferencia
        const movimientoTransferenciaVal = await MovimientoTransferencia.validarMovimientoTransferencia(nuevoMovimientoTransferencia);
        if (!movimientoTransferenciaVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoTransferenciaVal.errores.join(' '));
        }
        console.log('antes de crear');
        // Crear movimientoTransferencia
        const movimientoTransferenciaCreado = await MovimientoTransferenciaModel.create(nuevoMovimientoTransferencia);
        console.log('Movimiento transferencia creado: \n',movimientoTransferenciaCreado);

        // Actualizar expediente
        const expedienteBD = (await Expediente.existe({ nss })).expediente;
        await expedienteBD.update({
            delegacion: del_destino,
            estatus: false,
            ubicacion: 'TRANSFERIDO'
        });

        // Devolver respuesta
        return res.status(201).json('Transferencia realizada con éxito');
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

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