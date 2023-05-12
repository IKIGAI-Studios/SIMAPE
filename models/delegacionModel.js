import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const Delegacion = sequelize.define(
    'delegacion',
    {
        idDelegacion: DataTypes.STRING(10),
        n_delegacion: DataTypes.INTEGER,
        nom_delegacion: DataTypes.STRING(50),
        n_subdelegacion: DataTypes.INTEGER,
        nom_subdelegacion: DataTypes.STRING(50),
    },
    {
        tableName: "delegacion"
    }
);

export default Delegacion;