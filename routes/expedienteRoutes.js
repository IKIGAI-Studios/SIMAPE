import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';
import Expediente from '../models/expedienteModel.js';
import SuperDate from '../utils/Superdate.js';

const expedienteRoutes = express.Router();

expedienteRoutes.get('/buscarPorNSS/:nss', async (req, res) => {
    const expedienteEncontrado = await Expediente.findOne({
        where: { 
            nss: req.params.nss 
        }
    });

    if (expedienteEncontrado)
    {
        res.json(expedienteEncontrado);
        console.log(expedienteEncontrado);
        return;
    }
    res.json('Expediente no encontrado');
    return;
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
        console.log(req.session.user.matricula)
        console.log('Expediente registrado');
        res.json('Expediente registrado')
    }
    catch (e) {
        console.log(e);
        res.json(`ERROR ${e}`);
    }
});

export default expedienteRoutes;