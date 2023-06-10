import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const Ubicacion = sequelize.define(
    'ubicacion',
    {
        nombre: {
            type: DataTypes.STRING(15),
            primaryKey: true, 
            allowNull: false
        }
    },
    {
        tableName: "ubicacion",
        timestamps: false
    }
);

export default Ubicacion;