const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Slide = require('../controllers/slide.contr');

/* CREAR RUTAS HTTP */
app.get('/mostrar-slide', Slide.getSlide);
app.post('/crear-slide', Slide.setSlide);

/* EXPORTAR LA RUTA */
module.exports = app;