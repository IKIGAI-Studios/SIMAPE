const { DataTypes } = require('sequelize');
const sequelize = require('../utils/DBconnection');

const Usuario = sequelize.define(
    'usuario',
    {
        matricula: {
            type: DataTypes.STRING(15), // TODO: Cambiar luego por la longitud y tipo correcto
            primaryKey: true, 
            allowNull: false
        },        
        nombre: DataTypes.STRING(100),
        adscripcion: DataTypes.STRING(50),
        tipo_usuario: DataTypes.STRING(20),
        usuario: DataTypes.STRING(20),
        pass: DataTypes.STRING(50),
        estatus: DataTypes.BOOLEAN
    },
    {
        tableName: "usuario",
        timestamps: false
    }
);

module.exports = Usuario;