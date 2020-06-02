const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Galeria = require('../controllers/galeria.contr');

/* CREAR RUTAS HTTP */
app.get('/mostrar-galeria', Galeria.getGaleria);
app.post('/crear-galeria', Galeria.setGaleria);

/* EXPORTAR LA RUTA */
module.exports = app;