import express from 'express';
import bcrypt from 'bcrypt';
import Delegacion from '../models/delegacionModel.js';
import Usuario from '../models/usuarioModel.js';
import Expediente from '../models/expedienteModel.js';

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

export default expedienteRoutes;