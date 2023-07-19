import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Usuario from './usuarioModel.js';
import Movimiento from './movimientoModel.js';
import Expediente from './expedienteModel.js';

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
        matricula_receptor: DataTypes.STRING(15),
        pendiente: DataTypes.BOOLEAN,
        fecha_finalizacion: DataTypes.DATE
    },
    {
        tableName: "movimientoPrestamo",
        timestamps: false
    }
);

export async function validarMovimientoPrestamo({ folio, nss, matricula_receptor, pendiente }) {
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

    const matricula_receptorVal = await Usuario.existe({ matricula:matricula_receptor });
    if (!matricula_receptorVal.existe) {
        valido = false;
        errores.push(new Error(`Matricula_receptor no existe`));
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

export async function existe(filtro) {
    const movimientoPrestamo = await MovimientoPrestamo.findOne({
        where: filtro
    });

    if (movimientoPrestamo) return {existe: true, movimientoPrestamo};
    return {existe: false};
}

export default { validarMovimientoPrestamo, existe };