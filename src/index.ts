import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', userRoutes);

// Ruta de ejemplo
app.get('/', (_req, res) => {
  res.send('API funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});