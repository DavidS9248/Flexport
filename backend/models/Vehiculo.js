const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema(
  {
    marca:   { type: String, required: true, trim: true },
    modelo:  { type: String, required: true, trim: true },
    anio:    { type: Number, required: true, min: 1950, max: new Date().getFullYear() + 1 },
    precioInicial: { type: Number, required: true, min: 0 },
    imagenUrl: { type: String, trim: true },
    fechaSubasta: { type: Date, default: Date.now },   // ← coma aquí
    ofertaActual: { type: Number, min: 0, default: 0 },
    postorActual: { type: String, trim: true, default: '' },
    incrementoMinimo: { type: Number, min: 1, default: 100 }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Vehiculo', vehiculoSchema);