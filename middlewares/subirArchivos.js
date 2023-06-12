import multer, { diskStorage } from "multer";

// Rutas por tipo
const ROUTES = Object.freeze({
    usuario: 'src/uploads'
});

// Filtro de subida
const MIME_EXTENSION = Object.freeze({
    'image/jpeg': '.jpg',
    'image/png': '.png'
});

export function obtenerNombre(req, file) {
    const ext = MIME_EXTENSION[file.mimetype];
    return `${req.body.nombre}_foto${ext}`;
}

/**
 * Subir un archivo tipo imagen a la carpeta en el servidor
 * @param type Tipo de subida para establecer la ruta.
 * @param fieldName Nombre del campo en el formulario donde
 * se encuentra la imagen.
 */
export const subirArchivo = (type, fieldName) => {
    const route = ROUTES[type];

    const storage = diskStorage({
        destination: route,
        filename: function (req, file, cb) {
            
            cb(null, obtenerNombre(req, file));
        }
    });

    return multer({ 
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (!MIME_EXTENSION[file.mimetype]) {
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single(fieldName);
}

export default subirArchivo;