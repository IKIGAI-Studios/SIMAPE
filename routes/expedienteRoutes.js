import express from 'express';
import Usuario from '../models/usuarioModel.js';
import Expediente, { Expediente as ExpedienteModel } from '../models/expedienteModel.js';
import Movimiento, { Movimiento as MovimientoModel } from '../models/movimientoModel.js';
import MovimientoNormal, { MovimientoNormal as MovimientoNormalModel } from '../models/movimientoNormalModel.js';
import MovimientoTransferencia, { MovimientoTransferencia as MovimientoTransferenciaModel } from '../models/movimientoTransferenciaModel.js';
import MovimientoSupervision, { MovimientoSupervision as MovimientoSupervisionModel } from '../models/movimientoSupervisionModel.js';
import MovimientoPrestamo, {MovimientoPrestamo as MovimientoPrestamoModel} from '../models/movimientoPrestamoModel.js';
import Peticion, {Peticion as PeticionModel } from '../models/peticionModel.js';
import { imprimirTicket } from '../utils/print.js';
import { fn, col, where } from 'sequelize';
import { ESTADO_PETICION, TIPO_MOVIMIENTO, TIPO_PETICION, TIPO_USUARIO } from '../utils/constants.js';
import sequelize from '../utils/DBconnection.js';


const expedienteRoutes = express.Router();

// * Dar de alta un expediente
expedienteRoutes.post('/altaExpediente', async (req, res) => {
    try {
        // Obtener datos
        const { nss, nombre, categoria, delegacion, ubicacion, observaciones, año } = req.body;
        const { matricula } = req.session.user;

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

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

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            await expedienteCreado.destroy();
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);

        // * Validar movimientoAlta
        const movimientoAltaVal = await MovimientoNormal.validarMovimientoNormal(nuevoMovimientoAlta);
        if (!movimientoAltaVal.valido) {
            await expedienteCreado.destroy();
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoAltaVal.errores.join(' '));
        }

        // Crear movimientoAlta
        const movimientoAltaCreado = await MovimientoNormalModel.create(nuevoMovimientoAlta);

        // Devolver respuesta
        res.status(201).json(nuevoExpediente);
    }
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
})

// * Buscar un expediente por su nss
expedienteRoutes.get('/buscarPorNSS/:nss', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss } = req.params;

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        // Buscar el expediente
        const expedienteBD = await Expediente.existe({ nss });

        if (!expedienteBD.existe) {
            return res.status(404).json('Expediente no encontrado');
        }

        // Buscar los movimientos del expediente
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
// * OBTENER ÚLTIMO MOVIMIENTO
expedienteRoutes.get('/ultimoMovimiento/:nss', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss } = req.params;

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        // Buscar el expediente
        const expedienteBD = await Expediente.existe({ nss });

        if (!expedienteBD.existe) {
            return res.status(404).json('Expediente no encontrado');
        }

        // Obtener último movimiento del expediente
        const ultimoMovimiento = await sequelize.query(
            `SELECT movimiento.* FROM movimiento INNER JOIN movimientoNormal ON (movimiento.folio = movimientoNormal.folio) WHERE movimientoNormal.nss=${nss} && movimiento.tipo_movimiento='EXTRACCION' ORDER BY fecha DESC LIMIT 1`,
            { type: sequelize.QueryTypes.SELECT }
        );

        if (!ultimoMovimiento[0]) {
            return res.status(200).json(false);
        }

        return ultimoMovimiento[0].matricula === matricula
            ?   res.status(200).json(true)
            :   res.status(200).json(false);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * OBTENER ÚLTIMO PRÉSTAMO
expedienteRoutes.get('/ultimoPrestamo/:nss', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss } = req.params;

        let realizoPrestamo = false;

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        // Buscar el expediente
        const expedienteBD = await Expediente.existe({ nss });

        if (!expedienteBD.existe) {
            return res.status(404).json('Expediente no encontrado');
        }
        if (!expedienteBD.expediente.prestado) {
            return res.json({
                realizoPrestamo
            });
        }

        // Obtener último movimiento del expediente
        const ultimoPrestamo = await sequelize.query(
            `SELECT movimiento.*, movimientoPrestamo.matricula_receptor FROM movimiento INNER JOIN movimientoPrestamo ON (movimiento.folio = movimientoPrestamo.folio) WHERE movimientoPrestamo.nss=${nss} && movimiento.tipo_movimiento='PRESTAMO' && movimientoPrestamo.pendiente = TRUE ORDER BY fecha DESC LIMIT 1`,
            { type: sequelize.QueryTypes.SELECT }
        );

        if (!ultimoPrestamo[0]) {
            return res.json({
                realizoPrestamo
            });
        }

        console.log(matricula);
        console.log(ultimoPrestamo[0].matricula_receptor);

        realizoPrestamo = ultimoPrestamo[0].matricula_receptor === matricula;
        
        const data = {
            prestamo: ultimoPrestamo[0],
            realizoPrestamo
        }

        return res.status(200).json(data);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * INGRESO
expedienteRoutes.post('/movimiento/ingreso', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss, motivo } = req.body;

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

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

        // * Validar movimientoIngreso
        const movimientoIngresoVal = await MovimientoNormal.validarMovimientoNormal(nuevoMovimientoIngreso);
        if (!movimientoIngresoVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoIngresoVal.errores.join(' '));
        }

        // Crear movimientoIngreso
        const movimientoIngresoCreado = await MovimientoNormalModel.create(nuevoMovimientoIngreso);

        // Actualizar expediente
        const expedienteBD = (await Expediente.existe({ nss })).expediente;
        await expedienteBD.update({
            extraido: false
        });

        try {
            // Imprimir ticket
            await imprimirTicket({
                movimiento: TIPO_MOVIMIENTO.NORMAL.INGRESO,
                folio,
                expediente: expedienteBD.nss,
                nombreExpediente: expedienteBD.nombre,
                matricula,
                nombreUsuario: `${usuarioVal.usuario.nombre} ${usuarioVal.usuario.apellidos}`,
                fecha: movimientoCreado.fecha.toLocaleString()
            });
        } 
        catch (e) {
            
        }

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

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

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

        // * Validar movimientoExtraccion
        const movimientoExtraccionVal = await MovimientoNormal.validarMovimientoNormal(nuevoMovimientoExtraccion);
        if (!movimientoExtraccionVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoExtraccionVal.errores.join(' '));
        }

        // Crear movimientoAlta
        const movimientoExtraccionCreado = await MovimientoNormalModel.create(nuevoMovimientoExtraccion);

        // Actualizar expediente
        const expedienteBD = (await Expediente.existe({ nss })).expediente;
        await expedienteBD.update({
            extraido: true
        });

        try {     
            // Imprimir ticket
            await imprimirTicket({
                movimiento: TIPO_MOVIMIENTO.NORMAL.EXTRACCION,
                folio,
                expediente: expedienteBD.nss,
                nombreExpediente: expedienteBD.nombre,
                matricula,
                nombreUsuario: `${usuarioVal.usuario.nombre} ${usuarioVal.usuario.apellidos}`,
                fecha: movimientoCreado.fecha.toLocaleString()
            });
        } 
        catch (e) {
            
        }

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

        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo, 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.NORMAL.BAJA
        };

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

        // * Validar movimientoBaja
        const movimientoBajaVal = await MovimientoNormal.validarMovimientoNormal(nuevoMovimientoBaja);
        if (!movimientoBajaVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoBajaVal.errores.join(' '));
        }

        // Crear movimientoBaja
        const movimientoBajaCreado = await MovimientoNormalModel.create(nuevoMovimientoBaja);


        // Si el usuario es operativo, realizar la petición
        if (usuarioVal.usuario.tipo_usuario === TIPO_USUARIO.OPERATIVO) {
            const peticionVal = await Peticion.validarPeticion(nuevaPeticion);

            if (!peticionVal.valido) {
                await movimientoCreado.destroy();
                await movimientoBajaCreado.destroy();

                return res.status(400).json(peticionVal.errores.join(' '));
            }
            
            const peticionCreada = await PeticionModel.create(nuevaPeticion);
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
        
        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

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
            pendiente: usuarioVal.usuario.tipo_usuario === TIPO_USUARIO.OPERATIVO,
            del_destino,
            tipo_movimiento: TIPO_MOVIMIENTO.TRANSFERENCIA,
        }

        const nuevaPeticion = {
            folio,
            estado: ESTADO_PETICION.PENDIENTE,
            tipo: TIPO_PETICION.TRANSFERENCIA
        }

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);

        // * Validar movimientoTransferencia
        const movimientoTransferenciaVal = await MovimientoTransferencia.validarMovimientoTransferencia(nuevoMovimientoTransferencia);
        if (!movimientoTransferenciaVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoTransferenciaVal.errores.join(' '));
        }

        // Crear movimientoTransferencia
        const movimientoTransferenciaCreado = await MovimientoTransferenciaModel.create(nuevoMovimientoTransferencia);

        // Si el usuario es operativo, realizar la petición
        if (usuarioVal.usuario.tipo_usuario === TIPO_USUARIO.OPERATIVO) {
            const peticionVal = await Peticion.validarPeticion(nuevaPeticion);

            if (!peticionVal.valido) {
                await movimientoCreado.destroy();
                await movimientoTransferenciaCreado.destroy();

                return res.status(400).json(peticionVal.errores.join(' '));
            }
            
            const peticionCreada = await PeticionModel.create(nuevaPeticion);
            // Devolver respuesta
            return res.status(201).json('Petición de transferencia realizada con éxito');
        }

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

// * SUPERVISIONES
expedienteRoutes.post('/movimiento/supervision', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { supervisor, motivo } = req.body;
        let { nssList } = req.body;

        // Convertir la lista separada por comas en un array
        nssList = nssList.split(',');
        
        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo, 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.SUPERVISION
        };

        const nuevoMovimientoSupervision = {
            folio,
            nssList,
            supervisor,
            pendiente: true
        }

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);

        // * Validar movimientoSupervision
        const movimientoSupervisionVal = await MovimientoSupervision.validarMovimientoSupervision(nuevoMovimientoSupervision);
        if (!movimientoSupervisionVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoSupervisionVal.errores.join(' '));
        }

        // Crear movimientoSupervision
        for (let i=0; i<nssList.length; i++) {
            const nss = nssList[i];

            const movimientoSupervisionCreado = await MovimientoSupervisionModel.create({
                folio: nuevoMovimientoSupervision.folio,
                nss,
                supervisor: nuevoMovimientoSupervision.supervisor
            });
            console.log(`Supervision: ${nss}`);
    
            // Actualizar expediente
            const expedienteBD = (await Expediente.existe({ nss })).expediente;
            await expedienteBD.update({
                extraido: true
            });
        }
        
        // Devolver respuesta
        return res.status(201).json('Extracciones realizadas con éxito');
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

expedienteRoutes.post('/movimiento/ingresarSupervision', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { folio } = req.body;
        
        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        // Obtener supervision
        const supervisiones = await MovimientoSupervisionModel.findAll({
            where: {
                folio
            }
        });

        // Actualizar los expedientes
        for (let i=0; i<supervisiones.length; i++) {
            const supervision = supervisiones[i];

            const expediente = await ExpedienteModel.findOne({
                where: {
                    nss: supervision.nss
                }
            });

            // Actualizar expediente
            await expediente.update({
                extraido: false
            });

            // Actualizar supervision
            await supervision.update({
                pendiente: false,
                fecha_finalizacion: new Date()
            });
        }

        // Devolver respuesta
        return res.status(201).json('Ingreso de expedientes realizado con éxito');
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

expedienteRoutes.get('/obtenerSupervisiones', async (req, res) => {
    try {
        const supervisiones = await sequelize.query(
            `SELECT movimiento.folio, nss, supervisor, pendiente, fecha FROM movimientoSupervision INNER JOIN movimiento ON (movimientoSupervision.folio = movimiento.folio) WHERE pendiente = TRUE GROUP BY movimiento.folio ORDER BY fecha DESC`,
            { type: sequelize.QueryTypes.SELECT }
        );

        if (supervisiones) {
            return res.status(200).json(supervisiones);
        }

        return res.status(200).json('No hay supervisiones activas');
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * PRÉSTAMOS
expedienteRoutes.post('/movimiento/prestamo', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { nss, matricula_receptor, motivo } = req.body;
        
        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo, 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.PRESTAMO
        };

        const nuevoMovimientoPrestamo = {
            folio,
            nss,
            matricula_receptor,
            pendiente: true
        }

        // * Validar movimiento
        const movimientoVal = await Movimiento.validarMovimiento(nuevoMovimiento);

        if (!movimientoVal.valido) {
            return res.status(400).json(movimientoVal.errores.join(' '));
        }

        // Crear el movimiento
        const movimientoCreado = await MovimientoModel.create(nuevoMovimiento);

        // * Validar movimientoPrestamo
        const movimientoPrestamoVal = await MovimientoPrestamo.validarMovimientoPrestamo(nuevoMovimientoPrestamo);
        if (!movimientoPrestamoVal.valido) {
            await movimientoCreado.destroy();
            return res.status(400).json(movimientoPrestamoVal.errores.join(' '));
        }

        // Crear movimientoPrestamo
        const movimientoPrestamoCreado = await MovimientoPrestamoModel.create(nuevoMovimientoPrestamo);

        // Obtener expediente
        const expediente = (await Expediente.existe({ nss })).expediente;

        // Actualizar expediente
        await expediente.update({
           prestado: true
        });

        // Devolver respuesta
        return res.status(201).json('Prestamo realizado con éxito');
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

expedienteRoutes.post('/movimiento/ingresarPrestamo', async (req, res) => {
    try {
        const { matricula } = req.session.user;
        const { folio } = req.body;
        
        // Validar usuario
        const usuarioVal = await Usuario.existe({ matricula });

        if (!usuarioVal.existe) {
            return res.status(400).json('Error de autenticación');
        }

        // Obtener prestamo
        const prestamo = await MovimientoPrestamo.existe({ folio });

        if (!prestamo.existe) {
            return res.status(400).json('El préstamo no existe');
        }

        // Actualizar préstamo
        await prestamo.movimientoPrestamo.update({
            pendiente: false,
            fecha_finalizacion: new Date()
        });

        // Obtener expediente
        const expediente = (await Expediente.existe({ nss:prestamo.movimientoPrestamo.nss })).expediente;

        // Actualizar expediente
        await expediente.update({
           prestado: false 
        });
        
        // Devolver respuesta
        return res.status(201).json('Devuelta realizada con éxito');
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