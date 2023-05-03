const express = require('express');
const routes = require('./routes/routes');

const dotenv = require('dotenv').config();
const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use('/', routes);

PORT = process.env.PORT;
app.listen(PORT, () => {
    console.info(`Servidor activo en el puerto ${PORT}`);
});