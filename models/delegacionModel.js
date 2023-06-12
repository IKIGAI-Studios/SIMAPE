import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const Delegacion = sequelize.define(
    'delegacion',
    {
        id_delegacion: {
            type: DataTypes.STRING(10),
            primaryKey: true, 
            allowNull: false
        },
        n_delegacion: DataTypes.INTEGER,
        nom_delegacion: DataTypes.STRING(50),
        n_subdelegacion: DataTypes.INTEGER,
        nom_subdelegacion: DataTypes.STRING(50),
    },
    {
        tableName: "delegacion",
        timestamps: false
    }
);

export default Delegacion;