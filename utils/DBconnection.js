import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2';

dotenv.config();

const dbName = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_NAME : process.env.DB_NAME;
console.log(dbName);

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: dbName,
  dialect: 'mysql',
  dialectModule: mysql2, // Si descomento esto no funciona en vercel
  port: process.env.DB_PORT,
  logging: console.log,
  //timezone: 'America/Mexico_City'
});

export default sequelize;