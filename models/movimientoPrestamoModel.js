import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Usuario from './usuarioModel.js';
import Movimiento from './movimientoModel.js';
import Expediente from './expedienteModel.js';

// Modelo
export const MovimientoPrestamo = sequelize.define(
    'movimientoPrestamo',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        folio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nss: DataTypes.STRING(15),
        matricula_emisor: DataTypes.STRING(15),
        matricula_receptor: DataTypes.STRING(15),
        pendiente: DataTypes.BOOLEAN,
        fecha_finalizacion: DataTypes.DATE
    },
    {
        tableName: "movimientoPrestamo",
        timestamps: false
    }
);

/**
 * Función para validar un movimiento préstamo
 * @param {Object} movimientoPrestamo Objeto con los datos del movimiento normal 
 * @param {Number} movimientoPrestamo.folio Folio
 * @param {String} movimientoPrestamo.nss nss
 * @param {String} movimientoPrestamo.matricula_emisor matricula_emisor
 * @param {String} movimientoPrestamo.matricula_receptor matricula_receptor
 * @param {Boolean} movimientoPrestamo.pendiente pendiente
 * @returns {Object} Objeto con dos propiedades, valido (bool) y un array de errores en caso de haber
 */
export async function validarMovimientoPrestamo({ folio, nss, matricula_emisor, matricula_receptor, pendiente }) {
    let valido = true;
    let errores = [];

    if (!folio || typeof folio !== 'number') {
        console.log(folio);
        valido = false;
        errores.push(new Error('Folio no válido'));
    }

    const folioVal = await Movimiento.existe({ folio });
    if (!folioVal.existe) {
        valido = false;
        errores.push(new Error('Folio no existe'));
    }

    if (!nss || typeof nss !== 'string') {
        valido = false;
        errores.push(new Error(`Nss no válido`));
    }

    const nssVal = await Expediente.existe({ nss });
    if (!nssVal.existe) {
        valido = false;
        errores.push(new Error(`Nss no existe`));
    }

    if (!matricula_receptor || typeof matricula_receptor !== 'string') {
        valido = false;
        errores.push(new Error(`Matricula_receptor no válida`));
    }

    if (!matricula_emisor || typeof matricula_emisor !== 'string') {
        valido = false;
        errores.push(new Error(`Matricula_emisor no válida`));
    }

    const matricula_receptorVal = await Usuario.existe({ matricula:matricula_receptor });
    if (!matricula_receptorVal.existe) {
        valido = false;
        errores.push(new Error(`Matricula_receptor no existe`));
    }

    return {
        valido,
        errores
    }
}

/**
 * Función para comprobar si existe un movimiento préstamo
 * @param {Object} filtro Filtro
 * @returns {Object} Objeto con las propiedades existe (bool) y movimientoPrestamo con los datos del mismo
 */
export async function existe(filtro) {
    const movimientoPrestamo = await MovimientoPrestamo.findOne({
        where: filtro
    });

    if (movimientoPrestamo) return {existe: true, movimientoPrestamo};
    return {existe: false};
}

export default { validarMovimientoPrestamo, existe };