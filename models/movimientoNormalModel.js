import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import Expediente from './expedienteModel.js';
import { TIPO_MOVIMIENTO } from '../utils/constants.js';

// Modelo
export const MovimientoNormal = sequelize.define(
    'movimientoNormal',
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
        pendiente: DataTypes.BOOLEAN
    },
    {
        tableName: "movimientoNormal",
        timestamps: false,
    }
);

/**
 * Función para validar un movimiento normal
 * @param {Object} movimientoNormal Objeto con los datos del movimiento normal 
 * @param {String} movimientoNormal.folio Folio
 * @param {String} movimientoNormal.nss nss
 * @param {Boolean} movimientoNormal.pendiente pendiente
 * @param {String} movimientoNormal.tipo_movimiento tipo_movimiento
 * @returns {Object} Objeto con dos propiedades, valido (bool) y un array de errores en caso de haber
 */
export async function validarMovimientoNormal({ folio, nss, pendiente, tipo_movimiento }) {
    let valido = true;
    let errores = [];

    if (!folio || typeof folio !== 'number') {
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
        errores.push(new Error('Nss no válido'));
    }

    const nssVal = await Expediente.existe({ nss });
    if (!nssVal.existe) {
        valido = false;
        errores.push(new Error('Nss no existe'));
    }

    if (typeof pendiente !== 'boolean') {
        valido = false;
        errores.push(new Error('Pendiente no válido'));
    }

    if (!tipo_movimiento || !TIPO_MOVIMIENTO.NORMAL[tipo_movimiento]) {
        valido = false;
        errores.push(new Error('Movimiento no válido'));
    }

    return {
        valido,
        errores
    }
}

/**
 * Función para comprobar si existe un movimiento normal
 * @param {Object} filtro Filtro
 * @returns {Object} Objeto con las propiedades existe (bool) y movimientoNormal con los datos del mismo
 */
export async function existe(filtro) {
    const movimientoNormal = await MovimientoNormal.findOne({
        where: filtro
    });

    if (movimientoNormal) return {existe: true, movimientoNormal};
    return {existe: false};
}

export default { validarMovimientoNormal, existe };