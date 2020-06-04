const express = require('express');
const app = express();

/* IMPORTAR EL CONTROLADOR */
const Admin = require('../controllers/admin.contr');

/* IMPORTAMOS EL MIDDLEWARE */
const { verficaToken } = require('../middlewares/autenticacion');

/* CREAR RUTAS HTTP */
app.get('/mostrar-administrador', verficaToken, Admin.getAdmin);
app.post('/crear-administrador', verficaToken, Admin.setAdmin);
app.put('/actualizar-administrador/:id', verficaToken, Admin.updateAdmin);
app.delete('/borrar-administrador/:id', verficaToken, Admin.deleteAdmin);
app.post('/login', Admin.login);

/* EXPORTAR LA RUTA */
module.exports = app;