import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import Expediente from './expedienteModel.js';

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
        finalizada: DataTypes.BOOLEAN
    },
    {
        tableName: "movimientoSupervision",
        timestamps: false
    }
);

export async function validarMovimientoSupervision({ folio, nssList, supervisor, finalizada }) {
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

    nssList.forEach( async nss => {
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
    });

    if (!supervisor || typeof supervisor !== 'string') {
        valido = false;
        errores.push(new Error('Supervisor no válido'));
    }

    if (typeof finalizada !== 'boolean') {
        valido = false;
        errores.push(new Error('Campo finalizada no es válido'));
    }

    return {
        valido,
        errores
    }
}

export async function existe(filtro) {
    const movimientoSupervision = await MovimientoSupervision.findOne({
        where: filtro
    });

    if (movimientoSupervision) return {existe: true, movimientoSupervision};
    return {existe: false};
}

export default { existe, validarMovimientoSupervision };