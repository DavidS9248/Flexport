// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('strictQuery', true);

const conectarDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ Falta MONGO_URI en el .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('✅ Conexión a MongoDB exitosa');

    mongoose.connection.on('error', err => console.error('❌ Mongo error:', err));
    mongoose.connection.on('disconnected', () => console.warn('⚠️ Mongo desconectado'));

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Conexión Mongo cerrada por SIGINT');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;