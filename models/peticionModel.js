import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const Peticion = sequelize.define(
    'peticion',
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
        estado: DataTypes.STRING(15),
        tipo: DataTypes.STRING(15),
    },
    {
        tableName: "peticion",
        timestamps: false
    }
);

export default Peticion;