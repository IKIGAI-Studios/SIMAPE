const routes = require('express').Router();
const Delegacion = require('../models/delegacionModel');
const Usuario = require('../models/usuarioModel');
//const dbConnection = require('../utils/DBconnection');

routes.get('/', (req, res) => {
    res.render('login');
});

routes.get('/test', async (req, res) => {
    try {
        const response = await Usuario.findAll();
        res.json(response);
    }
    catch (e) {
        res.json(`ERROR ${e}`);
    }
});

module.exports = routes;