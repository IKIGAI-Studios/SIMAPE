const cookieParser = require('cookie-parser');
//const cors = require('cors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const routes = require('./routes/routes');


const app = express();
dotenv.config()

//app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, 
  }));

app.use('/', routes);


PORT = process.env.PORT;
app.listen(PORT, () => {
    console.info(`Servidor activo en el puerto ${PORT}`);
});


// cosas del front
app.use("/scss", express.static(path.join(__dirname, 'src/assets/scss')));
app.use("/imgs", express.static(path.join(__dirname, 'src/imgs')));
app.use("/icons", express.static(path.join(__dirname, 'src/icons')));
app.use("/fonts", express.static(path.join(__dirname, 'src/fonts')));
app.use("/js", express.static(path.join(__dirname, 'src/js')));