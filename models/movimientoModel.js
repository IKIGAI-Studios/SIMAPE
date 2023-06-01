import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const Movimiento = sequelize.define(
    'movimiento',
    {
        folio: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            allowNull: false
        },
        matricula: DataTypes.STRING(15),
        nss: DataTypes.STRING(15),
        tipo_movimiento: DataTypes.STRING(20),
        fecha: DataTypes.DATE,
        motivo: DataTypes.STRING(50)
    },
    {
        tableName: "movimiento",
        timestamps: false
    }
);

export default Movimiento;