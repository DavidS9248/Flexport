const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/vehiculoController');

router.get('/',     ctrl.listar);       
router.get('/:id',  ctrl.obtener);       
router.post('/',    ctrl.crear);         
router.put('/:id',  ctrl.actualizar);   
router.delete('/:id', ctrl.eliminar);    
router.post('/:id/bid', ctrl.pujar);

module.exports = router; 