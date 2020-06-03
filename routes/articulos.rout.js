const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Articulo = require('../controllers/articulos.contr');

/* CREAR RUTAS HTTP */
app.get('/mostrar-articulo', Articulo.getArticulo);
app.post('/crear-articulo', Articulo.setArticulo);
app.put('/actualizar-articulo/:id', Articulo.updateArticulo);
app.delete('/borrar-articulo/:id', Articulo.deleteArticulo);

/* EXPORTAR LA RUTA */
module.exports = app;