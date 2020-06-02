const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Articulo = require('../controllers/articulos.contr');

/* CREAR RUTAS HTTP */
app.get('/mostrar-articulo', Articulo.getArticulo);

/* EXPORTAR LA RUTA */
module.exports = app;