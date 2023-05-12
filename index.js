import cookieParser from 'cookie-parser';
//const cors = require('cors');
import express from 'express';
import session from 'express-session';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/routes.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT;

dotenv.config();
const app = express();

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

app.listen(PORT, () => {
    console.info(`Servidor activo en el puerto ${PORT}`);
});


// cosas del front
app.use("/scss", express.static(join(__dirname, 'src/assets/scss')));
app.use("/imgs", express.static(join(__dirname, 'src/imgs')));
app.use("/icons", express.static(join(__dirname, 'src/icons')));
app.use("/fonts", express.static(join(__dirname, 'src/fonts')));
app.use("/js", express.static(join(__dirname, 'src/js')));