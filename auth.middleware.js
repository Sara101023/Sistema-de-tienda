const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const jwtSecret = process.env.JWT_SECRET || 'secret_key';

// Middleware que requiere token obligatorio
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Error al verificar token:', err.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Middleware que permite continuar como invitado si no hay token
const optionalToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);
    req.user = user || null;
    next();
  } catch (err) {
    console.warn('Token inválido, continuando como invitado');
    req.user = null;
    next();
  }
};

// Solo permite si es administrador
const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.nombre_rol !== 'administrador') {
    return res.status(403).json({ error: 'Acceso solo para administradores' });
  }
  next();
};

// Solo permite si es cajero
const checkCajero = (req, res, next) => {
  if (!req.user || req.user.nombre_rol !== 'cajero') {
    return res.status(403).json({ error: 'Acceso solo para cajeros' });
  }
  next();
};

// Solo permite si es cliente (usuario final registrado)
const checkCliente = (req, res, next) => {
  if (!req.user || req.user.nombre_rol !== 'cliente') {
    return res.status(403).json({ error: 'Acceso solo para clientes registrados' });
  }
  next();
};

// Exportar todos los middlewares
module.exports = {
  verifyToken,
  optionalToken,
  checkAdmin,
  checkCajero,
  checkCliente
};
