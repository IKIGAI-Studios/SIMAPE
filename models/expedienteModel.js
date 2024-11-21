import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import { CATEGORIA_EXPEDIENTE, ESTADO_EXPEDIENTE } from '../utils/constants.js';

// Modelo
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
        estado: DataTypes.STRING(20)
    },
    {
        tableName: "expediente",
        timestamps: false
    }
);

/**
 * Función para validar un expediente
 * @param {Object} expediente Objeto con los datos del expediente
 * @param {String} expediente.nss NSS
 * @param {String} expediente.nombre NSS
 * @param {String} expediente.categoria NSS
 * @param {Date} expediente.fecha_alta fecha_alta
 * @param {Date} expediente.fecha_baja fecha_baja
 * @param {String} expediente.delegacion delegacion
 * @param {String} expediente.ubicacion ubicacion
 * @param {Boolean} expediente.estatus estatus
 * @param {String} expediente.año año
 * @param {String} expediente.matricula matricula
 * @param {String} expediente.observaciones observaciones
 * @param {String} expediente.estado estado
 * @returns {Object} Objeto con dos propiedades, valido (bool) y un array de errores en caso de haber
 */
export async function validarExpediente({ nss, nombre, categoria, fecha_alta, fecha_baja, delegacion, ubicacion, estatus, año, matricula, observaciones, estado }) {
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

    if (!nombre || typeof nombre !== 'string' || nombre.length > 100) {
        valido = false;
        errores.push(new Error('Nombre no válido'));
    }

    if (!fecha_alta || !(fecha_alta instanceof Date)) {
        valido = false;
        errores.push(new Error('Fecha_alta no válida'));
    }

    if (!categoria || !CATEGORIA_EXPEDIENTE[categoria]) {
        valido = false;
        errores.push(new Error('Categoría no válida'));
    }

    if (!ESTADO_EXPEDIENTE[estado]) {
        valido = false;
        errores.push(new Error('Estado no válido'));
    }

    return {
        valido,
        errores
    }
}

/**
 * Función para comprobar si existe un expediente
 * @param {Object} filtro Filtro
 * @returns {Object} Objeto con las propiedades existe (bool) y expediente con los datos del mismo
 */
export async function existe(filtro) {
    const expediente = await Expediente.findOne({
        where: filtro
    });

    if (expediente) return {existe: true, expediente};
    return {existe: false};
}

export default { validarExpediente, existe };