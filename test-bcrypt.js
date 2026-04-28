const bcrypt = require('bcryptjs');

const hash = '$2a$10$XTfYpryi7/YEFU9ATFgVs.h4zEkYMbMgxVu4uS4T2.ZeZ8tz1ik6G'; // Pon aquí el hash completo de tu base de datos
const contraseñaEnTextoPlano = 'Admin1234'; // La contraseña que crees que corresponde

bcrypt.compare(contraseñaEnTextoPlano, hash)
  .then(resultado => {
    console.log('¿Coincide?', resultado); // true o false
  })
  .catch(error => {
    console.error('Error al verificar:', error);
  });
