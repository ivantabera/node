const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Usuarios = require('../controllers/usuarios.contr');

/* CREAR RUTAS HTTP */
app.get('/mostrar-usuario', Usuarios.getUsuarios);
app.post('/crear-usuario', Usuarios.setUsuario);

/* EXPORTAR LA RUTA */
module.exports = app;