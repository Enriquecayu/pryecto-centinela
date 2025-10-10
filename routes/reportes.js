const express = require('express');
const router = express.Router();
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const Reporte = require('../models/Reporte');
const Usuario = require('../models/Usuario');
const cloudinary = require('../middleware/cloudinary');
const multer = require('multer');
const fs = require('fs');

// Configuración de Multer para la subida de archivos
const upload = multer({ dest: 'uploads/' });

// POST: Crea un nuevo reporte con imagen (protegida para usuarios)
router.post('/', verificarToken, upload.single('imagen'), async (req, res) => {
  try {
    let fotoURL = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "reportes_hospital"
      });
      fs.unlinkSync(req.file.path); // Elimina el archivo local después de subirlo
      fotoURL = result.secure_url;
    }

    const nuevoReporte = await Reporte.create({
      ...req.body,
      fotoURL: fotoURL,
      // Se usa 'userId' en lugar de 'id'
      usuarioId: req.usuario.userId
    });

    res.status(201).json(nuevoReporte);
  } catch (error) {
    console.error(error);
    res.status(400).send('Datos de reporte no válidos.');
  }
});

// GET: Obtiene reportes (admin ve todos, usuario ve los suyos)
router.get('/', verificarToken, async (req, res) => {
  try {
    const opciones = req.usuario.rol === 'administrador'
      ? { include: Usuario }
      // Se usa 'userId' en lugar de 'id'
      : { where: { usuarioId: req.usuario.userId } };

    const reportes = await Reporte.findAll(opciones);
    res.json(reportes);
  } catch (error) {
    res.status(500).send('Error al obtener los reportes.');
  }
});

// 🚨 NUEVA RUTA UNIFICADA: PUT /api/reportes/:id 
// Permite actualizar CUALQUIER campo (estado, asignadoA, etc.)
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    // req.body contendrá { estado: 'Nuevo Estado' } o { asignadoA: 'Personal', estado: 'Asignado' }
    const updates = req.body; 
    const reporte = await Reporte.findByPk(req.params.id);
    
    if (!reporte) {
      return res.status(404).send('Reporte no encontrado.');
    }
    
    // Actualiza el reporte con todos los campos enviados en el body (updates)
    await reporte.update(updates); 
    res.json(reporte);
  } catch (error) {
    console.error(error);
    res.status(400).send('Error al actualizar el reporte. Datos no válidos.');
  }
});


// DELETE: Elimina un reporte (protegida para administradores)
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const filasEliminadas = await Reporte.destroy({ where: { id: req.params.id } });
    if (filasEliminadas > 0) {
      res.status(204).send();
    } else {
      res.status(404).send('Reporte no encontrado.');
    }
  } catch (error) {
    res.status(500).send('Error al eliminar el reporte.');
  }
});

module.exports = router;