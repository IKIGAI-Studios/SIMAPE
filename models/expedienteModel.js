import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import { CATEGORIA_EXPEDIENTE } from '../utils/constants.js';

export const Expediente = sequelize.define(
    'expediente',
    {
        nss: {
            type: DataTypes.STRING(15),
            primaryKey: true, 
            allowNull: false
        },        
        nombre: DataTypes.STRING(100),
        categoria: DataTypes.STRING(10),
        fecha_alta: DataTypes.DATEONLY,
        fecha_baja: DataTypes.DATEONLY,
        delegacion: DataTypes.STRING(10),
        ubicacion: DataTypes.STRING(10),
        estatus: DataTypes.BOOLEAN,
        año: DataTypes.INTEGER,
        matricula: DataTypes.STRING(15),
        observaciones: DataTypes.STRING(100),
        extraido: DataTypes.BOOLEAN
    },
    {
        tableName: "expediente",
        timestamps: false
    }
);

export async function validarExpediente({ nss, nombre, categoria, fecha_alta, fecha_baja, delegacion, ubicacion, estatus, año, matricula, observaciones, extraido }) {
    // Variables a retornar
    let valido = true;
    let errores = [];

    if (!nss || typeof nss !== 'string' || nss.length > 15) {
        valido = false;
        errores.push(new Error('Nss no válido'));
    }

    const nssVal = await existe({ nss });
    if (nssVal.existe) {
        valido = false;
        errores.push(new Error('Nss ya existe'));
    }

    if (!categoria || !CATEGORIA_EXPEDIENTE[categoria]) {
        valido = false;
        errores.push(new Error('Categoría no válida'));
    }
    
    //TODO Realizar validaciones XD

    return {
        valido,
        errores
    }
}

export async function existe(filtro) {
    const expediente = await Expediente.findOne({
        where: filtro
    });

    if (expediente) return {existe: true, expediente};
    return {existe: false};
}

export default { validarExpediente, existe };