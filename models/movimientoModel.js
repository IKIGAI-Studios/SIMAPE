import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import { TIPO_MOVIMIENTO } from '../utils/constants.js';
import Usuario from './usuarioModel.js';

export const Movimiento = sequelize.define(
    'movimiento',
    {
        folio: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            allowNull: false
        },
        matricula: DataTypes.STRING(15),
        motivo: DataTypes.STRING(50),
        fecha: DataTypes.DATE,
        tipo_movimiento: DataTypes.STRING(20),
    },
    {
        tableName: "movimiento",
        timestamps: false
    }
);

export async function validarMovimiento({ folio, matricula, motivo, fecha, tipo_movimiento }) {
    let valido = true;
    let errores = [];
    
    if (!folio || typeof folio !== 'number') {
        valido: false;
        errores.push(new Error('Folio no es válido'));
    }

    const folioVal = await existe({ folio });
    if (folioVal.existe) {
        valido: false;
        errores.push(new Error('Folio ya existe'));
    }

    if (!matricula || typeof matricula !== 'string' || matricula.length > 15) {
        valido: false;
        errores.push(new Error('Matricula no es válida'));
    }

    const matriculaVal = await Usuario.existe({ matricula })
    if (!matriculaVal.existe) {
        valido = false;
        errores.push(new Error('Matricula no existe'));
    }

    if (!tipo_movimiento || (!TIPO_MOVIMIENTO[tipo_movimiento] && !TIPO_MOVIMIENTO.NORMAL[tipo_movimiento])) {
        valido: false;
        errores.push(new Error('Movimiento no válido'));
    }

    //TODO: Terminar las validaciones

    return {
        valido,
        errores
    }
}

export async function existe(filtro) {
    const movimiento = await Movimiento.findOne({
        where: filtro
    });

    if (movimiento) return {existe: true, movimiento};
    return {existe: false};
}

export default { validarMovimiento, existe };