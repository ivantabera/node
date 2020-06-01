/* REQUERIMIENTOS */
const express = require('express');
const mongoose = require('mongoose');
const app = express();

/* PETICION GET */
app.get('/', (req, res) =>{

    /* res.send("hola mundo"); */
    let salida = {
        nombre: "Ivan",
        edad: 31,
        url: req.url
    }

    res.send(salida);

})

/* CONEXION A LA BASE DE DATOS */
mongoose.connect('mongodb://localhost:27017/apiRest', {useNewUrlParser: true,useUnifiedTopology: true},
(err, resp)=>{

    if (err) throw err;
    console.log("Conectado a la Base de Datos");
});
    

/* SALIDA PUERTO HTTP */
app.listen(4000, () => {
    console.log('Habilitado el puerto 4000')
});