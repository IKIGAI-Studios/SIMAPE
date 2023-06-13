import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import Expediente from './expedienteModel.js';
import Delegacion from './delegacionModel.js';
import { TIPO_MOVIMIENTO } from '../utils/constants.js';

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

    console.log('asjdajsd');
    console.log('folio', 'nss', 'pendiente', 'del_destino', 'tipo_movimiento');
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

export default { validarMovimientoTransferencia };