import dotenv from 'dotenv';
import path from 'path';

const ENV = process.env.NODE_ENV || 'test'; 
dotenv.config({
  path: path.resolve(__dirname, `../env/.env.${ENV}`)
});

export default class Enviroment{
    public static BASE_URL = process.env.BASE_URL
    public static USERNAME = process.env.USERNAME
    public static PASSWORD = process.env.PWD
}