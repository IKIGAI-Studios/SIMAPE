const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.render('login');
});

routes.get('/simape', (req, res) => {
    res.render('simape');
});

module.exports = routes;