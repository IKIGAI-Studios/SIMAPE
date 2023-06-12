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
        motivo: DataTypes.STRING(50),
        fecha: DataTypes.DATE,
        tipo_movimiento: DataTypes.STRING(20),
    },
    {
        tableName: "movimiento",
        timestamps: false
    }
);

export default Movimiento;