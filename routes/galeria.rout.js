const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Galeria = require('../controllers/galeria.contr');

/* IMPORTAMOS EL MIDDLEWARE */
const { verficaToken } = require('../middlewares/autenticacion');

/* CREAR RUTAS HTTP */
app.get('/mostrar-galeria', Galeria.getGaleria);
app.post('/crear-galeria', verficaToken, Galeria.setGaleria);
app.put('/actualizar-galeria/:id', verficaToken, Galeria.updateGaleria);
app.delete('/borrar-galeria/:id', verficaToken, Galeria.deleteGaleria);

/* EXPORTAR LA RUTA */
module.exports = app;