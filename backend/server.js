// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares: CORS y JSON
app.use(cors());
app.use(express.json());

// Rutas API
const encuestasRouter = require('./routes/encuestas');
app.use('/api/encuestas', encuestasRouter);

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Ruta fallback para index.html (útil si tu frontend usa rutas SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Backend ejecutándose en http://localhost:${port}`);
});