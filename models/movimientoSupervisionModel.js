import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import Expediente from './expedienteModel.js';

// Modelo
export const MovimientoSupervision = sequelize.define(
    'movimientoSupervision',
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
        supervisor: DataTypes.STRING(80),
        pendiente: DataTypes.BOOLEAN,
        fecha_finalizacion: DataTypes.DATE
    },
    {
        tableName: "movimientoSupervision",
        timestamps: false
    }
);

/**
 * Validación para el movimiento de supervisión
 * @param {Object} movimiento Objecto con los datos del movimientoSupervisión
 * @param {Number} movimiento.folio Folio del movimiento
 * @param {Array<String>} movimiento.nssList Lista de NSS que conforman la supervisión
 * @param {String} movimiento.supervisor Supervisor
 * @param {Boolean} movimiento.pendiente Pendiente
 * @param {Date} [movimiento.fecha_finalizacion] Fecha de finalización
 * @returns {Object} Objeto con dos propiedades, valido (bool) y un array de errores en caso de haber
 */
export async function validarMovimientoSupervision({ folio, nssList, supervisor, pendiente, fecha_finalizacion }) {
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

    for (let i=0; i<nssList.length; i++) {
        const nss = nssList[i];

        if (!nss || typeof nss !== 'string') {
            valido = false;
            errores.push(new Error(`Nss "${nss}" no válido`));
        }

        const nssVal = await Expediente.existe({ nss });
        if (!nssVal.existe) {
            valido = false;
            errores.push(new Error(`Nss "${nss}" no existe`));
        }

        const nssSupervisionVal = await existe({ folio, nss });
        if (nssSupervisionVal.existe) {
            valido = false;
            errores.push(new Error('Nss registrado anteriormente'));
        }
    }

    if (!supervisor || typeof supervisor !== 'string') {
        valido = false;
        errores.push(new Error('Supervisor no válido'));
    }

    if (typeof pendiente !== 'boolean') {
        valido = false;
        errores.push(new Error('Campo pendiente no es válido'));
    }

    return {
        valido,
        errores
    }
}

/**
 * Función para comprobar si existe un movimiento supervisión
 * @param {Object} filtro Filtro
 * @returns {Object} Objeto con las propiedades existe (bool) y movimientoSupervision con los datos del mismo
 */
export async function existe(filtro) {
    const movimientoSupervision = await MovimientoSupervision.findOne({
        where: filtro
    });

    if (movimientoSupervision) return {existe: true, movimientoSupervision};
    return {existe: false};
}

export default { existe, validarMovimientoSupervision };