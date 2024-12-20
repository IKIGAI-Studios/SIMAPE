import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import Expediente from './expedienteModel.js';
import Delegacion from './delegacionModel.js';
import { TIPO_MOVIMIENTO } from '../utils/constants.js';

// Modelo
export const MovimientoTransferencia = sequelize.define(
    'movimientoTransferencia',
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
        pendiente: DataTypes.BOOLEAN,
        del_destino: DataTypes.STRING(10)
    },
    {
        tableName: "movimientoTransferencia",
        timestamps: false
    }
);

/**
 * Validación para el movimiento de transferencia
 * @param {Object} movimiento Objeto con los datos del movimientoTransferencia
 * @param {Number} movimiento.folio Folio del movimiento
 * @param {String} movimiento.nss NSS
 * @param {Boolean} movimiento.pendiente Pendiente
 * @param {Number} movimiento.del_destino Id de la delegación de destino
 * @param {String} movimiento.tipo_movimiento Tipo de movimiento
 * @returns {Object} Objeto con dos propiedades, valido (bool) y un array de errores en caso de haber
 */
export async function validarMovimientoTransferencia({ folio, nss, pendiente, del_destino, tipo_movimiento }) {
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

    if (!del_destino || typeof del_destino !== 'string' || del_destino.length > 10) {
        valido = false;
        errores.push(new Error('Del_destino no válida'));
    }

    const del_destinoVal = await Delegacion.existe({ id_delegacion: del_destino });
    console.log(del_destinoVal);
    if (!del_destinoVal.existe) {
        valido = false;
        errores.push(new Error('Del_destino no existe'));
    }

    if (!tipo_movimiento || tipo_movimiento !== TIPO_MOVIMIENTO.TRANSFERENCIA) {
        valido = false;
        errores.push(new Error('Movimiento no válido'));
    }

    return {
        valido,
        errores
    }
}

/**
 * Función para comprobar si existe un movimiento transferencia
 * @param {Object} filtro Filtro
 * @returns {Object} Objeto con las propiedades existe (bool) y movimientoTransferencia con los datos del mismo
 */
export async function existe(filtro) {
    const movimientoTransferencia = await MovimientoTransferencia.findOne({
        where: filtro
    });

    if (movimientoTransferencia) return {existe: true, movimientoTransferencia};
    return {existe: false};
}

export default { validarMovimientoTransferencia, existe };