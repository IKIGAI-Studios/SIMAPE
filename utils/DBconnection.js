import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_LANG,
  port: process.env.DB_PORT
});

sequelize.sync({force:false})
.then(() => {
    console.info("Conectado a MYSQL");
})
.catch((e) => {
    console.error(`Error: ${e}`);
});

export default sequelize;