import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import nocache from 'nocache'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/routes.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT;

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.use(cors());
app.use(nocache());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, 
  }));

app.use('/', routes);

const server = app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});


// cosas del front
app.use("/scss", express.static(join(__dirname, 'src/assets/scss')));
app.use("/imgs", express.static(join(__dirname, 'src/imgs')));
app.use("/icons", express.static(join(__dirname, 'src/icons')));
app.use("/fonts", express.static(join(__dirname, 'src/fonts')));
app.use("/js", express.static(join(__dirname, 'src/js')));

export { app, server };