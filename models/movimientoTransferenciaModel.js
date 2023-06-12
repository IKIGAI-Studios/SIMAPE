import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import { TIPO_MOVIMIENTO } from '../utils/constants.js';

const MovimientoTransferencia = sequelize.define(
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

// * ACCIONES
async function crearMovimientoTransferencia({ folio, matricula, motivo, fecha, tipo_movimiento, nss, pendiente, del_destino }) {
    try {
        if (tipo_movimiento !== TIPO_MOVIMIENTO.TRANSFERENCIA) throw new Error('El tipo de movimiento no es válido');
        
        const delegacion = await Delegacion.findOne({id_delegacion: del_destino});
        if (!delegacion) throw new Error('Delegación no válida');

        const movimiento = await Movimiento.create({
            folio,
            matricula,
            motivo,
            fecha,
            tipo_movimiento
        });

        const movimientoTransferencia = await MovimientoTransferencia.create({
            folio,
            nss,
            pendiente,
            del_destino
        });
    }
    catch (e) {
        return e;
    }
}

export default MovimientoTransferencia;