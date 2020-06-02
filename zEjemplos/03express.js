/* UBICAMOS REQUERIMIENTOS */
const express = require('express');

/* CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS */
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

/* SALIDA PUERTO HTTP */
app.listen(4000, () => {
    console.log('Habilitado el puerto 4000')
});