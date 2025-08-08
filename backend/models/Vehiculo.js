const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  año: { type: Number, required: true },
  precioInicial: { type: Number, required: true },
  imagenUrl: { type: String },
  fechaSubasta: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema);
