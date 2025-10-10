const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Reporte = require('../models/Reporte');
const { verificarToken, verificarAdmin } = require('../middleware/auth'); // Importa el middleware desde la ubicación correcta
const { body, validationResult } = require('express-validator');

// Ruta de registro
router.post('/registro', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
  body('email').isEmail().withMessage('El email no es válido.'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nombre, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({ nombre, email, password: hashedPassword, rol: 'usuario' });
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.', error });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email: email } });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }
    const token = jwt.sign({ userId: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, rol: usuario.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// Ruta para obtener el perfil del usuario (protegida con el middleware)
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    // Se usa 'userId' en lugar de 'id'
    const user = await Usuario.findByPk(req.usuario.userId, { attributes: ['nombre', 'email', 'rol'] });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    // Se usa 'userId' en lugar de 'id'
    const numReportes = await Reporte.count({ where: { usuarioId: req.usuario.userId } });

    res.status(200).json({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      reportesRealizados: numReportes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor.', error });
  }
});

module.exports = router;