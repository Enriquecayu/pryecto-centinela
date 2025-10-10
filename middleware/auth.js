const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Acceso denegado. No hay token.');
  
  try {
    const verificado = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(400).send('Token no válido.');
  }
}

function verificarAdmin(req, res, next) {
  if (req.usuario.rol !== 'administrador') {
    return res.status(403).send('Acceso denegado. Se requiere rol de administrador.');
  }
  next();
}

module.exports = { verificarToken, verificarAdmin };