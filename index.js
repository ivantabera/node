/* 
 * REQUERIMIENTOS 
 */
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
 *ESQUEMA PARA EL MODELO CONECTOR A MONGODB 
 */
let Schema = mongoose.Schema;

let slideSchema = new Schema({
    imagen:{
        type:String,
        required:[true, "imagen es obligatoria"]
    },
    titulo:{
        type:String,
        required:[true, "titulo es obligatorio"]
    },
    descripcion:{
        type:String,
        required:false
    }
});

//COMO PARAMETRO LE PASAMOS PRIMERO EL NOMBRE DE LA TABLA EN BD Y DESPUES EL SCHEMA
const Slide = mongoose.model('slides', slideSchema);

/*
 *PETICION GET 
 */
//ruta a la cual va reaccionar
app.get('/', (req, res) =>{

    // documentacion https://mongoosejs.com/docs/api.html#model_Model.find
    Slide.find({})
         .exec((err, data)=>{
        
        if (err) {
            return res.json({
                status:500,
                mensaje: 'Error en la peticion '
            });        
        }

        res.json({
            status:200,
            data
        })
    });

})

/* 
 *PETICION POST 
 */
//ruta a la cual va reaccionar
app.post('/crear-slide', (req, res) => {

    let slide = req.body;
    res.json({
        slide
    })
})

/* 
 *PETICION PUT 
 */
//ruta a la cual va reaccionar
app.put('/actualizar-slide/:id', (req, res) => {

    let id = req.params.id;
    res.json({
        id
    })
})


/* 
 *PETICION DELETE 
 */
//ruta a la cual va reaccionar
app.delete('/borrar-slide/:id', (req, res) => {

    let id = req.params.id;
    res.json({
        id
    })
})

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
app.listen(4000, () => {
    console.log('Habilitado el puerto 4000')
});