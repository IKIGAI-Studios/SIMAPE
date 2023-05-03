const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.render('login');
});

module.exports = routes;