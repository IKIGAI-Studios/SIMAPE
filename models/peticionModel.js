import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import { ESTADO_PETICION, TIPO_PETICION } from '../utils/constants.js';

export const Peticion = sequelize.define(
    'peticion',
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
        estado: DataTypes.STRING(15),
        tipo: DataTypes.STRING(15),
    },
    {
        tableName: "peticion",
        timestamps: false
    }
);

export async function validarPeticion({ folio, estado, tipo }) {
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

    const peticionVal = await existe({ folio });
    if (peticionVal.existe) {
        valido = false;
        errores.push(new Error('Ya existe una peticion para el expediente'));
    }

    if (!ESTADO_PETICION[estado]) {
        valido = false;
        errores.push(new Error('Estado no válido'));
    }

    if (!tipo || !TIPO_PETICION[tipo]) {
        valido: false;
        errores.push(new Error('Movimiento no válido'));
    }

    return {
        valido,
        errores
    }
}

export async function existe(filtro) {
    const peticion = await Peticion.findOne({
        where: filtro
    });

    if (peticion) return {existe: true, peticion};
    return {existe: false};
}

export default { validarPeticion, existe };