import { DataTypes } from 'sequelize';
import sequelize from '../utils/DBconnection.js';
import { TIPO_USUARIO } from '../utils/constants.js';

// Modelo
export const Usuario = sequelize.define(
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

/**
 * Función para validar un usuario
 * @param {Object} usuario Objeto con los datos del usuario
 * @param {String} usuario.matricula Matricula
 * @param {String} usuario.nombre nombre
 * @param {String} usuario.apellidos apellidos
 * @param {String} usuario.adscripcion adscripcion
 * @param {String} usuario.tipo_usuario tipo_usuario
 * @param {String} usuario.usuario usuario
 * @param {String} usuario.pass pass
 * @param {Boolean} usuario.estatus estatus
 * @param {Date} usuario.fecha_registro fecha_registro
 * @param {String} usuario.foto foto
 * @returns {Object} Objeto con las propiedades existe (bool) y movimientoTransferencia con los datos del mismo
 */
export async function validarUsuario({ matricula, nombre, apellidos, adscripcion, tipo_usuario, usuario, pass, estatus, fecha_registro, foto }) {
    // Variables a retornar
    let valido = true;
    let errores = [];

    if (!matricula || typeof matricula !== 'string' || matricula.length > 15) {
        valido = false;
        errores.push(new Error('Matrícula no válida'));
    }

    const matriculaVal = await existe({ matricula })
    if (matriculaVal.existe) {
        valido = false;
        errores.push(new Error('La matrícula ya está registrada'));
    }

    if (!nombre || typeof nombre !== 'string' || nombre.length > 50) {
        valido = false;
        errores.push(new Error('Nombre no válido'));
    }

    if (!apellidos || typeof apellidos !== 'string' || apellidos.length > 50) {
        valido = false;
        errores.push(new Error('Apellido no válido'));
    }

    if (!adscripcion || typeof adscripcion !== 'string' || adscripcion.length > 50) {
        valido = false;
        errores.push(new Error('Adscripción no válida'));
    }

    if (!tipo_usuario || !TIPO_USUARIO[tipo_usuario]) {
        valido = false;
        errores.push(new Error('Tipo_usuario no válido'));
    }

    if (!usuario || typeof usuario !== 'string' || usuario.length > 20) {
        valido = false;
        errores.push(new Error('Usuario no válido'));
    }

    const usuarioVal = await existe({ usuario })
    if (usuarioVal.existe) {
        valido = false;
        errores.push(new Error('El usuario ya existe'));
    }

    return {
        valido,
        errores
    }

}

/**
 * Función para comprobar si existe un usuario
 * @param {Object} filtro Filtro
 * @returns {Object} Objeto con las propiedades existe (bool) y usuario con los datos del mismo
 */
export async function existe(filtro) {
    const usuario = await Usuario.findOne({
        where: filtro
    });

    if (usuario) return {existe: true, usuario};
    return {existe: false};
}

export default { existe, validarUsuario };