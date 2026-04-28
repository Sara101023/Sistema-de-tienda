const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware para permitir JSON en las solicitudes
app.use(express.json()); // 🔧 IMPORTANTE para que funcione el req.body
app.use(cors());

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../front')));

// Rutas de API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/user.routes'));


// Ruta fallback para aplicaciones SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(` Servidor backend escuchando en: http://localhost:${port}`);
  console.log(` Frontend disponible en: http://localhost:${port}/login.html`);
});

const productRoutes = require('./routes/product.routes');
app.use(productRoutes);

const promoRoutes = require('./routes/promotions.routes');
app.use(promoRoutes);

