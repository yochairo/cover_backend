import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Conexión a PostgreSQL establecida.'))
  .catch((err: any) => console.error('Error de conexión a PostgreSQL:', err));

export default client;