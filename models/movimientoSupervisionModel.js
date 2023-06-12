import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const MovimientoSupervision = sequelize.define(
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
    },
    {
        tableName: "movimientoSupervision",
        timestamps: false
    }
);

export default MovimientoSupervision;