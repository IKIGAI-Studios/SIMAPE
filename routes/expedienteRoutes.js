import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';
import Expediente from '../models/expedienteModel.js';
import SuperDate from '../utils/Superdate.js';

const expedienteRoutes = express.Router();

expedienteRoutes.get('/buscarPorNSS/:nss', async (req, res) => {
    try {
        const expedienteEncontrado = await Expediente.findOne({
            where: { 
                nss: req.params.nss
            }
        });
        console.log(expedienteEncontrado);
    
        if (expedienteEncontrado)
        {
            res.json(expedienteEncontrado);
            res.end();
        }

        res.statusMessage = 'Expediente no encontrado';
        res.json('Expediente no encontrado');
        res.end();
    } 
    catch (e) {
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
});

expedienteRoutes.post('/nuevoExpediente', async (req, res) => {
    try {
        const {nss, nombre, categoria, delegacion, ubicacion, observaciones, año} = req.body;

        // Validar que el usuario sea único
        const expedienteRegistrado = await Expediente.findOne({ 
            where: { 
                nss
            },
            attributes: ['nss']
        });

        if (expedienteRegistrado) {
            throw new Error('El expediente ya ha sido registrado');
        }

        const nuevoExpediente = await Expediente.create({
            nss,
            nombre,
            categoria,
            fecha_alta: SuperDate.today(),
            delegacion,
            ubicacion,
            estatus: true,
            año,
            matricula: req.session.user.matricula,
            observaciones
        });

        res.statusMessage = 'Expediente registrado correctamente';
        res.json('Expediente registrado')
    }
    catch (e) {
        res.statusCode = 420;
        res.statusMessage = e.message;
        res.end();
    }
})

export default expedienteRoutes;