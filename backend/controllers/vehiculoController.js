
const Vehiculo = require('../models/Vehiculo');


const listarVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar los vehículos', error });
  }
};


const crearVehiculo = async (req, res) => {
  try {
    const nuevoVehiculo = new Vehiculo(req.body); 
    await nuevoVehiculo.save(); 
    res.status(201).json({
      mensaje: 'Vehículo registrado correctamente',
      vehiculo: nuevoVehiculo
    });
  } catch (error) {
    res.status(400).json({
      mensaje: 'Error al registrar el vehículo',
      error: error.message
    });
  }
};


const actualizarVehiculo = async (req, res) => {
  try {
    const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );

    if (!vehiculoActualizado) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json({ mensaje: 'Vehículo actualizado correctamente', vehiculo: vehiculoActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el vehículo', error });
  }
};


const eliminarVehiculo = async (req, res) => {
  try {
    const vehiculoEliminado = await Vehiculo.findByIdAndDelete(req.params.id);

    if (!vehiculoEliminado) {
      return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
    }

    res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar el vehículo', error });
  }
};

module.exports = {
  listarVehiculos,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
};