import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import client from './services/db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de ejemplo
app.get('/', (_req, res) => {
  res.send('API funcionando!');
});

// Ruta para obtener usuarios desde la base de datos
app.get('/usuarios', async (_req, res) => {
  try {
    const result = await client.query('SELECT * FROM personas');
    res.json(result.rows);
  } catch (error) {

    console.error('Error al obtener usuarios:', error);
    res.status(500).send('Error al obtener los usuarios');

  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});