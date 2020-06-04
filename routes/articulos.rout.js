const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Articulo = require('../controllers/articulos.contr');

/* IMPORTAMOS EL MIDDLEWARE */
const { verficaToken } = require('../middlewares/autenticacion');

/* CREAR RUTAS HTTP */
app.get('/mostrar-articulo', Articulo.getArticulo);
app.post('/crear-articulo', verficaToken, Articulo.setArticulo);
app.put('/actualizar-articulo/:id', verficaToken, Articulo.updateArticulo);
app.delete('/borrar-articulo/:id', verficaToken, Articulo.deleteArticulo);

/* EXPORTAR LA RUTA */
module.exports = app;