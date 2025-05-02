import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import  {initModels}  from '../models/init-models';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: false,
});

const db = initModels(sequelize);


export  {sequelize,db};
