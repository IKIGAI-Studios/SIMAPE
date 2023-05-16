import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const Expediente = sequelize.define(
    'expediente',
    {
        nss: {
            type: DataTypes.STRING(15), // TODO: Cambiar luego por la longitud y tipo correcto
            primaryKey: true, 
            allowNull: false
        },        
        nombre: DataTypes.STRING(100),
        categoria: DataTypes.STRING(10),
        fecha_alta: DataTypes.DATE,
        fecha_baja: DataTypes.DATE,
        delegacion: DataTypes.STRING(10),
        ubicacion: DataTypes.STRING(10),
        estatus: DataTypes.BOOLEAN,
        año: DataTypes.INTEGER,
        matricula: DataTypes.STRING(15)
    },
    {
        tableName: "expediente",
        timestamps: false
    }
);

export default Expediente;