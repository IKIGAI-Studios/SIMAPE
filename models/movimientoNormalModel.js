import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import Expediente from './expedienteModel.js';
import { TIPO_MOVIMIENTO } from '../utils/constants.js';

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

export default { validarMovimientoNormal };