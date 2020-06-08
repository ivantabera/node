const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Usuarios = require('../controllers/usuarios.contr');

/* CREAR RUTAS HTTP */
app.get('/mostrar-usuario', Usuarios.getUsuarios);
app.post('/crear-usuario', Usuarios.setUsuario);
app.post('/login-usuario', Usuarios.loginUsuario);

/* EXPORTAR LA RUTA */
module.exports = app;