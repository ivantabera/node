const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Admin = require('../controllers/admin.contr');

/* CREAR RUTAS HTTP */
app.get('/mostrar-administrador', Admin.getAdmin);
app.post('/crear-administrador', Admin.setAdmin);
app.put('/actualizar-administrador/:id', Admin.updateAdmin);
app.delete('/borrar-administrador/:id', Admin.deleteAdmin);
app.post('/login', Admin.login);

/* EXPORTAR LA RUTA */
module.exports = app;