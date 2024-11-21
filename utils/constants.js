/**
 * Constantes para tipos de movimientos
 */
export const TIPO_MOVIMIENTO = {
    NORMAL: {
        EXTRACCION: 'EXTRACCION',
        INGRESO: 'INGRESO',
        ALTA: 'ALTA',
        BAJA: 'BAJA',
    },
    TRANSFERENCIA: 'TRANSFERENCIA',
    SUPERVISION_SALIDA: 'SUPERVISION_SALIDA',
    SUPERVISION_ENTRADA: 'SUPERVISION_ENTRADA',
    PRESTAMO: 'PRESTAMO',
    DEVOLUCION: 'DEVOLUCION',
}

/**
 * Constantes para tipos de usuario
 */
export const TIPO_USUARIO = {
    ADMINISTRADOR: 'ADMINISTRADOR',
    OPERATIVO: 'OPERATIVO'
}

/**
 * Constantes para tipos de petición
 */
export const TIPO_PETICION = {
    BAJA: 'BAJA',
    TRANSFERENCIA: 'TRANSFERENCIA'
}

/**
 * Constantes para tipos de estado de petición
 */
export const ESTADO_PETICION = {
    PENDIENTE: 'PENDIENTE',
    ACEPTADO: 'ACEPTADO',
    RECHAZADO: 'RECHAZADO'
}

/**
 * Constantes para tipos de estado de un expediente
 */
export const ESTADO_EXPEDIENTE = {
    INGRESADO: 'INGRESADO',
    EXTRAIDO: 'EXTRAIDO',
    SUPERVISADO: 'SUPERVISADO',
    PRESTADO: 'PRESTADO'
}
{/**
 * Constantes para categorias de expediente
 */}
export const CATEGORIA_EXPEDIENTE = {
    '97 - CE': '97 - CE',
    '97 - VE': '97 - VE',
    '97 - ASC': '97 - ASC',
    '97 - OR': '97 - OR',
    '97 - VI': '97 - VI',
    '97 - VO': '97 - VO',
    '97 - IPP': '97 - IPP',
    '97 - INV': '97 - INV',
    '97 - IG': '97 - IG',
    '73 - CE': '73 - CE',
    '73 - VE': '73 - VE',
    '73 - ASC': '73 - ASC',
    '73 - OR': '73 - OR',
    '73 - VI': '73 - VI',
    '73 - VO': '73 - VO',
    '73 - IPT': '73 - IPT',
    '73 - INV': '73 - INV',
    '73 - IG': '73 - IG'
}