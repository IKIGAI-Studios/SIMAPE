import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';

const Usuario = sequelize.define(
    'usuario',
    {
        matricula: {
            type: DataTypes.STRING(15),
            primaryKey: true, 
            allowNull: false
        },        
        nombre: DataTypes.STRING(50),
        apellidos: DataTypes.STRING(50),
        adscripcion: DataTypes.STRING(50),
        tipo_usuario: DataTypes.STRING(20),
        usuario: DataTypes.STRING(20),
        pass: DataTypes.STRING(80),
        estatus: DataTypes.BOOLEAN,
        fecha_registro: DataTypes.DATEONLY,
        foto: DataTypes.STRING(100)
    },
    {
        tableName: "usuario",
        timestamps: false
    }
);

export default Usuario;