const express = require('express');
const dotenv = require('dotenv');
const conectarDB = require('./config/db');
const vehiculoRoutes = require('./routes/vehiculoRoutes');

dotenv.config();
conectarDB(); 

const app = express();
app.use(express.json());

app.use('/vehiculos', vehiculoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
