const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const Usuario = require('../models/Usuario');

// GET /api/usuarios: Obtiene todos los usuarios (solo administradores)
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ['id', 'nombre', 'email', 'rol'] });
    res.json(usuarios);
  } catch (error) {
    res.status(500).send('Error al obtener los usuarios.');
  }
});

// GET /api/usuarios/:id: Obtiene un usuario específico (solo administradores)
router.get('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { attributes: ['id', 'nombre', 'email', 'rol'] });
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado.');
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).send('Error al obtener el usuario.');
  }
});

// POST /api/usuarios: Crea un nuevo usuario (solo administradores)
// NOTA: Esta es una ruta para crear usuarios por parte de un admin.
// La ruta de registro para usuarios comunes está en routes/auth.js
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({ nombre, email, password: hashedPassword, rol });
    res.status(201).json({ id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol });
  } catch (error) {
    res.status(400).send('Error al crear el usuario. El email podría ya estar en uso.');
  }
});

// PUT /api/usuarios/:id: Actualiza un usuario (solo administradores)
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado.');
    }
    const { nombre, email, password, rol } = req.body;
    let datosActualizados = { nombre, email, rol };

    if (password) {
      datosActualizados.password = await bcrypt.hash(password, 10);
    }

    await usuario.update(datosActualizados);
    res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
  } catch (error) {
    res.status(400).send('Error al actualizar el usuario.');
  }
});

// DELETE /api/usuarios/:id: Elimina un usuario (solo administradores)
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const filasEliminadas = await Usuario.destroy({ where: { id: req.params.id } });
    if (filasEliminadas > 0) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).send('Usuario no encontrado.');
    }
  } catch (error) {
    res.status(500).send('Error al eliminar el usuario.');
  }
});

module.exports = router;