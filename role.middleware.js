const checkRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    const rol = (req.user?.nombre_rol || '').toLowerCase().trim();
    console.log('🔐 Rol en req.user:', rol);
    console.log('🎯 Roles permitidos:', allowedRoles);

    if (!req.user || !allowedRoles.includes(rol)) {
      return res.status(403).json({ error: 'Acceso denegado: rol no permitido' });
    }

    next();
  };
};

module.exports = { checkRoles };
