/* 
 *ESQUEMA PARA EL MODELO CONECTOR A MONGODB 
 */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let galeriaSchema = new Schema({
    foto:{
        type:String,
        required:[true, "foto es obligatoria"]
    }
});

//COMO PARAMETRO LE PASAMOS PRIMERO EL NOMBRE DE LA TABLA EN BD Y DESPUES EL SCHEMA
module.exports = mongoose.model('galerias', galeriaSchema);