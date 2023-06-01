import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_NAME : process.env.DB_NAME;
console.log(dbName);

const sequelize = new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_LANG,
  port: process.env.DB_PORT,
  logging: false,
  timezone: 'America/Mexico_City'
});

export default sequelize;