import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const MovimientoNormal = sequelize.define(
    'movimientoNormal',
    {
        folio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nss: DataTypes.STRING(15),
        pendiente: DataTypes.BOOLEAN
    },
    {
        tableName: "movimientoNormal",
        timestamps: false
    }
);

export default MovimientoNormal;