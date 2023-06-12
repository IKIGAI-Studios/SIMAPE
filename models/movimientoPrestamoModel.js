import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const MovimientoPrestamo = sequelize.define(
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
        matricula_receptor: DataTypes.STRING(15)
    },
    {
        tableName: "movimientoPrestamo",
        timestamps: false
    }
);

export default MovimientoPrestamo;