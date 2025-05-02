import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db'; 
import personaRoutes from './routes/personas.routes'; 
 
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



// Ruta de ejemplo
app.get('/', (_req, res) => {
  res.send('API funcionando!');
});

app.use('/api', personaRoutes);


const PORT = process.env.PORT || 3000;


/* app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); */

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Si no vas a modificar las tablas desde código, no uses sync
    // await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
};

startServer();