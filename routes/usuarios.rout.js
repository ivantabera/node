const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Usuarios = require('../controllers/usuarios.contr');

/* CREAR RUTAS HTTP */
app.get('/mostrar-usuario', Usuarios.getUsuarios);

/* EXPORTAR LA RUTA */
module.exports = app;