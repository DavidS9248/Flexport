const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const conectarDB = require('./config/db');
const vehiculoRoutes = require('./routes/vehiculoRoutes');

dotenv.config();

async function bootstrap() {
  try {
    
    await conectarDB();

   
    const app = express();

    
    app.use(express.json());

    
    app.use(cors({
      origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        process.env.CORS_ORIGIN 
      ].filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    
    if (process.env.NODE_ENV !== 'production') {
      app.use(morgan('dev'));
    }

 
    app.get('/', (_req, res) => res.send('API funcionando'));
    app.use('/vehiculos', vehiculoRoutes);

    
    app.use((_req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' });
    });

    
    app.use((err, _req, res, _next) => {
      console.error(err);
      res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
    });

   
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Error iniciando la aplicación:', err);
    process.exit(1);
  }
}

bootstrap();
