const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Slide = require('../controllers/slide.contr');

/* IMPORTAMOS EL MIDDLEWARE */
const { verficaToken } = require('../middlewares/autenticacion');

/* CREAR RUTAS HTTP */
app.get('/mostrar-slide', Slide.getSlide);
app.post('/crear-slide', verficaToken, Slide.setSlide);
app.put('/actualizar-slide/:id', verficaToken, Slide.updateSlide);
app.delete('/borrar-slide/:id', verficaToken, Slide.deleteSlide)
//se creo la ruta para mostrar imagenes en los componentes y vista html de angular
app.get('/mostrar-img-slide/:imagen', Slide.getImagen);

/* EXPORTAR LA RUTA */
module.exports = app;