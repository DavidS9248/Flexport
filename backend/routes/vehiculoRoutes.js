const express = require('express');
const router = express.Router();
const vehiculoController = require('../controllers/vehiculoController');


router.get('/', vehiculoController.listarVehiculos);
router.post('/', vehiculoController.crearVehiculo);


router.put('/:id', vehiculoController.actualizarVehiculo);
router.delete('/:id', vehiculoController.eliminarVehiculo);

module.exports = router;
