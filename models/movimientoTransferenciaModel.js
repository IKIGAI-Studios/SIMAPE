import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const MovimientoTransferencia = sequelize.define(
    'movimientoTranferencia',
    {
        folio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nss: DataTypes.STRING(15),
        pendiente: DataTypes.BOOLEAN,
        del_destino: DataTypes.STRING(10)
    },
    {
        tableName: "movimientoTranferencia",
        timestamps: false
    }
);

export default MovimientoTransferencia;