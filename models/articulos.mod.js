/* 
 *ESQUEMA PARA EL MODELO CONECTOR A MONGODB 
 */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articulosSchema = new Schema({
    portada:{
        type:String,
        required:[true, "portada es obligatoria"]
    },
    url:{
        type:String,
        required:false
    },
    titulo:{
        type:String,
        required:[true, "titulo es obligatorio"]
    },
    intro:{
        type:String,
        required:false
    },
    contenido:{
        type:String,
        required:[true, "contenido es obligatorio"]
    }
});

//COMO PARAMETRO LE PASAMOS PRIMERO EL NOMBRE DE LA TABLA EN BD Y DESPUES EL SCHEMA
module.exports = mongoose.model('articulos', articulosSchema);