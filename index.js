/* 
 * REQUERIMIENTOS 
 */
require ('./config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/*
 *VARIABLE PARA TENER TODAS LAS FUNCIONES DE EXPRESS 
 */
const app = express();

/* 
 *MIDDLEWARE PARA BODYPARSER 
 */
//parse application/x-www-form-urlencoded, para llenado de formulario
app.use(bodyParser.urlencoded({ extended:false }));

//parse application/json, respuesta a json
app.use(bodyParser.json());

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