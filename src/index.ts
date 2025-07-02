import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db';
import personaRoutes from './routes/personas.routes';
import clienteRoutes from './routes/clientes.routes';
import eventosRoutes from './routes/eventos.routes';
import discotecasRoutes from "./routes/discotecas.routes";
import PersonalRoutes from "./routes/personal.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



// Ruta de ejemplo
app.get('/', (_req, res) => {
  res.send('API funcionando!');
});

app.use('/persona', personaRoutes);
app.use('/cliente', clienteRoutes);
app.use('/personal', PersonalRoutes);
app.use('/eventos', eventosRoutes);
app.use('/discotecas', discotecasRoutes);


const PORT = parseInt(process.env.PORT || '3000', 10);



const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
};

startServer();