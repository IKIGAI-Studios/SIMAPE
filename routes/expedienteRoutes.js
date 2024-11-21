import express from 'express';
import Usuario from '../models/usuarioModel.js';
import Expediente, { Expediente as ExpedienteModel } from '../models/expedienteModel.js';
import Movimiento, { Movimiento as MovimientoModel } from '../models/movimientoModel.js';
import MovimientoNormal, { MovimientoNormal as MovimientoNormalModel } from '../models/movimientoNormalModel.js';
import MovimientoTransferencia, { MovimientoTransferencia as MovimientoTransferenciaModel } from '../models/movimientoTransferenciaModel.js';
import MovimientoSupervision, { MovimientoSupervision as MovimientoSupervisionModel } from '../models/movimientoSupervisionModel.js';
import MovimientoPrestamo, {MovimientoPrestamo as MovimientoPrestamoModel} from '../models/movimientoPrestamoModel.js';
import Peticion, {Peticion as PeticionModel } from '../models/peticionModel.js';
import { fn, col } from 'sequelize';
import { ESTADO_EXPEDIENTE, ESTADO_PETICION, TIPO_MOVIMIENTO, TIPO_PETICION, TIPO_USUARIO } from '../utils/constants.js';
import sequelize from '../utils/DBconnection.js';
import { validarUsuario } from './validarUsuario.js';

const expedienteRoutes = express.Router();

// Middleware para validar usuario
expedienteRoutes.use('/*', async (req, res, next) => {
    // Comprobar si existe una sesión de usuario
    if (!req.session.user) {
        return res.redirect('/');
    }

    // Extraer las constantes necesarias
    const { matricula } = req.session.user;

    // Validar usuario
    const esValido = await validarUsuario(matricula);
    
    // Si no es válido, retornar el error
    if (!esValido) {
        return res.status(400).json('Error de autenticación');
    }

    // Si todo salió bien, pasar a la función de la ruta
    next();
});

// * Dar de alta un expediente
expedienteRoutes.post('/altaExpediente', async (req, res) => {
    try {
        // Extraer las constantes necesarias
        const { nss, nombre, categoria, delegacion, ubicacion, observaciones, año } = req.body;
        const { matricula } = req.session.user;

        // Declarar el expediente y los movimientos
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
            estado: ESTADO_EXPEDIENTE.INGRESADO
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
            pendiente: false,
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
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { nss } = req.params;

        // Buscar el expediente
        const expedienteBD = await Expediente.existe({ nss });

        if (!expedienteBD.existe) {
            return res.status(404).json('Expediente no encontrado');
        }

        // Buscar los movimientos del expediente
        const movimientos = await sequelize.query(
            `SELECT movimiento.*, usuario.nombre, usuario.apellidos FROM movimiento INNER JOIN usuario ON (movimiento.matricula = usuario.matricula) WHERE 
            folio IN(SELECT folio FROM movimientonormal WHERE nss = ${nss} AND movimientonormal.pendiente = FALSE) || 
            folio IN(SELECT folio FROM movimientoprestamo WHERE nss = ${nss}) ||
            folio IN(SELECT folio FROM movimientosupervision WHERE nss = ${nss}) || 
            folio IN (SELECT folio FROM movimientotransferencia WHERE nss = ${nss} AND movimientotransferencia.pendiente = FALSE) ORDER BY fecha DESC LIMIT 5`,
            { type: sequelize.QueryTypes.SELECT }
        );

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
// * RUTA PARA OBTENER SI EL ÚLTIMO MOVIMIENTO DE EXTRACCIÓN LO REALIZÓ EL USUARIO
expedienteRoutes.get('/ultimoMovimiento/:tipoMovimiento/:nss', async (req, res) => {
    try {
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { tipoMovimiento, nss } = req.params;

        // Buscar el expediente
        const expedienteBD = await Expediente.existe({ nss });

        if (!expedienteBD.existe) {
            return res.status(404).json('Expediente no encontrado');
        }

        // Obtener último movimiento del expediente
        const ultimoMovimiento = await sequelize.query(
            `SELECT movimiento.* FROM movimiento INNER JOIN movimientoNormal ON (movimiento.folio = movimientoNormal.folio) WHERE movimientoNormal.nss=${nss} && movimiento.tipo_movimiento='${tipoMovimiento}' ORDER BY fecha DESC LIMIT 1`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Si no existe, retornamos false
        if (!ultimoMovimiento[0]) {
            return res.status(200).json(false);
        }

        // Comparar si la matricula del último movimiento es la del usuario
        return ultimoMovimiento[0].matricula === matricula
            ?   res.status(200).json(true)
            :   res.status(200).json(false);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * OBTENER ÚLTIMO PRÉSTAMO Y SI LO RECIBIÓ EL USUARIO O NO
expedienteRoutes.get('/ultimoPrestamo/:nss', async (req, res) => {
    try {
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { nss } = req.params;

        let recibioPrestamo = false;

        // Buscar el expediente
        const expedienteBD = await Expediente.existe({ nss });

        if (!expedienteBD.existe) {
            return res.status(404).json('Expediente no encontrado');
        }

        // Si no está prestamo, retornar false
        if (expedienteBD.expediente.estado !== ESTADO_EXPEDIENTE.PRESTADO) {
            return res.json({
                recibioPrestamo
            });
        }

        // Obtener último movimiento del expediente
        const ultimoPrestamo = await sequelize.query(
            `SELECT movimiento.*, movimientoPrestamo.matricula_receptor FROM movimiento INNER JOIN movimientoPrestamo ON (movimiento.folio = movimientoPrestamo.folio) WHERE movimientoPrestamo.nss=${nss} && movimiento.tipo_movimiento='PRESTAMO' && movimientoPrestamo.pendiente = TRUE ORDER BY fecha DESC LIMIT 1`,
            { type: sequelize.QueryTypes.SELECT }
        );
        
        // Verificar si existe el movimiento préstamo
        if (!ultimoPrestamo[0]) {
            return res.json({
                recibioPrestamo
            });
        }

        // Comprobar si el último préstamo lo recibió el usuario
        recibioPrestamo = ultimoPrestamo[0].matricula_receptor === matricula;
        
        // Devolver el último préstamo y si lo recibió el usuario
        return res.status(200).json({
            prestamo: ultimoPrestamo[0],
            recibioPrestamo
        });
    }
    catch(e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * INGRESO
expedienteRoutes.post('/movimiento/ingreso', async (req, res) => {
    try {
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { nss, motivo } = req.body;

        // Declarar los movimientos
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
            pendiente: false,
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
            estado: ESTADO_EXPEDIENTE.INGRESADO
        });

        // Devolver respuesta
        return res.json({
            message: 'Ingreso realizado con éxito',
            folio
        });
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

// * EXTRACCION
expedienteRoutes.post('/movimiento/extraccion', async (req, res) => {
    try {
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { nss, motivo } = req.body;

        // Inicializar los movimientos
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
            estado: ESTADO_EXPEDIENTE.EXTRAIDO
        });

        // Devolver respuesta
        return res.json({
            message: 'Extracción realizada con éxito',
            folio
        });

    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});
// * BAJA
expedienteRoutes.post('/movimiento/baja', async (req, res) => {
    try {
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { nss, motivo } = req.body;

        // Obtener usuario
        const usuarioVal = await Usuario.existe({ matricula });

        // Obtener expediente
        const expedienteBD = (await Expediente.existe({ nss })).expediente;

        if (expedienteBD.estado !== ESTADO_EXPEDIENTE.INGRESADO) {
            return res.status(400).json('El expediente no ha sido ingresado');
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
            nss,
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
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { nss, del_destino, motivo } = req.body;
        
        // Obtener usuario
        const usuarioVal = await Usuario.existe({ matricula });

        // Obtener expediente
        const expedienteBD = (await Expediente.existe({ nss })).expediente;

        if (expedienteBD.estado !== ESTADO_EXPEDIENTE.INGRESADO) {
            return res.status(400).json('El expediente no ha sido ingresado');
        }

        // Inicializar los movimientos
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
            nss,
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
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { supervisor, motivo } = req.body;
        let { nssList } = req.body;

        // Convertir la lista separada por comas en un array
        nssList = nssList.split(',');

        const folio = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio, 
            matricula, 
            motivo, 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.SUPERVISION_SALIDA
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
                supervisor: nuevoMovimientoSupervision.supervisor,
                pendiente: true
            });
    
            // Actualizar expediente
            const expedienteBD = (await Expediente.existe({ nss })).expediente;
            await expedienteBD.update({
                estado: ESTADO_EXPEDIENTE.SUPERVISADO
            });
        }
        
        // Devolver respuesta
        return res.json({
            message: 'Extracciones realizadas con éxito',
            folio
        });
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

expedienteRoutes.post('/movimiento/ingresarSupervision', async (req, res) => {
    try {
        // Inicializar las constantes necesarias
        const { matricula } = req.session.user;
        const { folio } = req.body;

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
                estado: ESTADO_EXPEDIENTE.INGRESADO
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
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { nss, matricula_receptor, motivo } = req.body;

        // Inicializar los movimientos
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
            matricula_emisor: matricula,
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
           estado: ESTADO_EXPEDIENTE.PRESTADO
        });

        // Devolver respuesta
        return res.json({
            message: 'Prestamo realizado con éxito',
            folio
        });
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

expedienteRoutes.post('/movimiento/ingresarPrestamo', async (req, res) => {
    try {
        // Extraer las constantes necesarias
        const { matricula } = req.session.user;
        const { folio } = req.body;

        // Obtener prestamo
        const prestamo = await MovimientoPrestamo.existe({ folio });

        
        if (!prestamo.existe) {
            return res.status(400).json('El préstamo no existe');
        }

        // Obtener expediente
        const expediente = (await Expediente.existe({ nss:prestamo.movimientoPrestamo.nss })).expediente;

        // Inicializar los movimientos
        const folioNuevo = await obtenerNumeroFolio() + 1;
        const nuevoMovimiento = {
            folio: folioNuevo, 
            matricula, 
            motivo: 'Devolución de expediente', 
            fecha: new Date(),
            tipo_movimiento: TIPO_MOVIMIENTO.DEVOLUCION
        };

        // Obtener usuario emisor del expediente

        const nuevoMovimientoPrestamo = {
            folio: folioNuevo,
            nss: expediente.nss,
            matricula_emisor: matricula,
            matricula_receptor: prestamo.movimientoPrestamo.matricula_emisor
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

        // Actualizar préstamo
        await prestamo.movimientoPrestamo.update({
            pendiente: false,
            fecha_finalizacion: new Date()
        });

        // Actualizar expediente
        await expediente.update({
           estado: ESTADO_EXPEDIENTE.EXTRAIDO
        });
        
        // Devolver respuesta
        return res.json({
            message: 'Devuelta realizada con éxito',
            folio
        });
    } 
    catch (e) {
        console.log(e);
        return res.status(400).json(e.message);
    }
});

/**
 * Función para obtener el último folio registrado en la base de datos referente
 * a los movimientos.
 * @returns {Promise<Number>} Folio actual de los movimientos
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