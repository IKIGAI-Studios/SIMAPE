import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import Movimiento from './movimientoModel.js';
import { ESTADO_PETICION, TIPO_PETICION } from '../utils/constants.js';

// Modelo
export const Peticion = sequelize.define(
    'peticion',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nss: DataTypes.STRING(15),
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

/**
 * 
 * @param {Object} peticion Objeto con los datos de la petición
 * @param {String} peticion.nss NSS
 * @param {String} peticion.folio Folio del movimiento
 * @param {String} peticion.estado Estado de la petición
 * @param {String} peticion.nss Tipo de petición
 * @returns {Object} Objeto con dos propiedades, valido (bool) y un array de errores en caso de haber
 */
export async function validarPeticion({ nss, folio, estado, tipo }) {
    let valido = true;
    let errores = [];

    if (!folio || typeof folio !== 'number') {
        valido = false;
        errores.push(new Error('Folio no válido'));
    }

    const folioVal = await Movimiento.existe({ folio });
    if (!folioVal.existe) {
        valido = false;
        errores.push(new Error('Folio no existe'));
    }

    const peticionVal = await existe({ folio });
    if (peticionVal.existe) {
        valido = false;
        errores.push(new Error('Ya existe una peticion para el expediente'));
    }

    if (!ESTADO_PETICION[estado]) {
        valido = false;
        errores.push(new Error('Estado no válido'));
    }

    if (!tipo || !TIPO_PETICION[tipo]) {
        valido: false;
        errores.push(new Error('Movimiento no válido'));
    }

    return {
        valido,
        errores
    }
}

/**
 * Función para comprobar si existe una petición
 * @param {Object} filtro Filtro
 * @returns {Object} Objeto con las propiedades existe (bool) y peticion con los datos de la misma
 */
export async function existe(filtro) {
    const peticion = await Peticion.findOne({
        where: filtro
    });

    if (peticion) return {existe: true, peticion};
    return {existe: false};
}

export default { validarPeticion, existe };