/* 
 *ESQUEMA PARA EL MODELO CONECTOR A MONGODB 
 */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let usuariosSchema = new Schema({
    usuario:{
        type:String,
        required:[true, "usuario es obligatorio"]
    },
    password:{
        type:String,
        required:[true, "password es obligatorio"]
    }
});

//COMO PARAMETRO LE PASAMOS PRIMERO EL NOMBRE DE LA TABLA EN BD Y DESPUES EL SCHEMA
module.exports = mongoose.model('usuarios', usuariosSchema);