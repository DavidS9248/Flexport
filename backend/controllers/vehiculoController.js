const Vehiculo = require('../models/Vehiculo');

const handle = (res, fn) =>
  fn().catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Error interno', detalle: err.message });
  });

exports.listar = (req, res) => handle(res, async () => {
  const { marca, modelo } = req.query;
  const filtro = {};
  if (marca)  filtro.marca  = new RegExp(`^${marca}$`, 'i');
  if (modelo) filtro.modelo = new RegExp(`^${modelo}$`, 'i');
  const items = await Vehiculo.find(filtro).sort({ fechaSubasta: 1, createdAt: -1 });
  res.json(items);
});

exports.pujar = (req, res) => handle(res, async () => {
  const { id } = req.params;
  const { monto, postor } = req.body;

  if (!Number.isFinite(monto) || monto <= 0) {
    return res.status(400).json({ error: 'Monto inválido' });
  }

  const v = await Vehiculo.findById(id);
  if (!v) return res.status(404).json({ error: 'Vehículo no encontrado' });

  const base = Math.max(v.precioInicial || 0, v.ofertaActual || 0);
  const minimo = v.ofertaActual > 0
    ? v.ofertaActual + (v.incrementoMinimo || 0)
    : Math.max(v.precioInicial || 0, 0);

  if (monto < minimo) {
    return res.status(409).json({
      error: 'Oferta muy baja',
      detalle: `La oferta mínima actual es ${minimo}`
    });
  }

  v.ofertaActual = monto;
  v.postorActual = (postor || '').toString().slice(0, 80);
  await v.save();

  res.json({
    mensaje: 'Oferta aceptada',
    vehiculo: v
  });
});

exports.obtener = (req, res) => handle(res, async () => {
  const v = await Vehiculo.findById(req.params.id);
  if (!v) return res.status(404).json({ error: 'No encontrado' });
  res.json(v);
});

exports.crear = (req, res) => handle(res, async () => {
  const { marca, modelo, anio, precioInicial, imagenUrl, fechaSubasta } = req.body;
  const v = await Vehiculo.create({ marca, modelo, anio, precioInicial, imagenUrl, fechaSubasta });
  res.status(201).json(v);
});

exports.actualizar = (req, res) => handle(res, async () => {
  const { marca, modelo, anio, precioInicial, imagenUrl, fechaSubasta } = req.body;
  const v = await Vehiculo.findByIdAndUpdate(
    req.params.id,
    { marca, modelo, anio, precioInicial, imagenUrl, fechaSubasta },
    { new: true, runValidators: true }
  );
  if (!v) return res.status(404).json({ error: 'No encontrado' });
  res.json(v);
});

exports.eliminar = (req, res) => handle(res, async () => {
  const v = await Vehiculo.findByIdAndDelete(req.params.id);
  if (!v) return res.status(404).json({ error: 'No encontrado' });
  res.json({ mensaje: 'Eliminado' });
});