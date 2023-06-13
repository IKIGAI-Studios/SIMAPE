import express from 'express';
import { Delegacion } from '../models/delegacionModel.js';

const delegacionRoutes = express.Router();

delegacionRoutes.get('/obtenerDelegaciones', async (req, res) => {
    try {
        const delegaciones = await Delegacion.findAll();

        return res.status(200).json(delegaciones);
    } 
    catch (e) {
        return res.status(400).json('Error');
    }
});


export default delegacionRoutes;