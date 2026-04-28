const bcrypt = require('bcryptjs');

const password = 'Admin1234';

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('Nuevo hash generado:');
    console.log(hash);
  })
  .catch(err => {
    console.error('Error al generar hash:', err);
  });
