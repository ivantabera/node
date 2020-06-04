/* 
 *ESQUEMA PARA EL MODELO CONECTOR A MONGODB 
 */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let adminSchema = new Schema({
    usuario:{
        type:String,
        required:[true, "Usuario es obligatorio"],
        unique:true
    },
    password:{
        type:String,
        required:[true, "Contraseña es obligatoria"]
    }
});

//COMO PARAMETRO LE PASAMOS PRIMERO EL NOMBRE DE LA TABLA EN BD Y DESPUES EL SCHEMA
module.exports = mongoose.model('admins', adminSchema);