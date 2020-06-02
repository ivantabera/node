/* 
 *ESQUEMA PARA EL MODELO CONECTOR A MONGODB 
 */
const mongoose = require('mongoose');

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
module.exports = mongoose.model('slides', slideSchema);