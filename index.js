/* 
 * REQUERIMIENTOS 
 */
require ('./config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

/*
 *VARIABLE PARA TENER TODAS LAS FUNCIONES DE EXPRESS 
 */
const app = express();

/* 
 *MIDDLEWARE PARA BODYPARSER 
 */
//parse application/x-www-form-urlencoded, para llenado de formulario
app.use(bodyParser.urlencoded({ limit:'10mb', extended:true }));

//parse application/json, respuesta a json
app.use(bodyParser.json({ limit:'10mb', extended:true }));

/* 
 *MIDDLEWARE PARA fileUpload "subir archivos al servidor" 
 */
app.use(fileUpload());

/* 
 * Mongoose deprecations
 */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

/*
 *IMPORTAR LAS RUTAS
 */
app.use(require('./routes/slide.rout'));
app.use(require('./routes/articulos.rout'));
app.use(require('./routes/galeria.rout'));
app.use(require('./routes/usuarios.rout'));
app.use(require('./routes/admin.rout'));

/*
 *CONEXION A LA BASE DE DATOS 
 */
mongoose.connect('mongodb://localhost:27017/apiRest', {useNewUrlParser: true,useUnifiedTopology: true},
(err, resp)=>{

    if (err) throw err;
    console.log("Conectado a la Base de Datos");
});

/* 
 *SALIDA PUERTO HTTP 
 */
app.listen(process.env.PORT, () => {
    console.log(`Habilitado el puerto  ${process.env.PORT}`)
});