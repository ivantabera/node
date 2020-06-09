/* 
 *ESQUEMA PARA EL MODELO CONECTOR A MONGODB 
 */
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let usuariosSchema = new Schema({
    usuario:{
        type:String,
        required:[true, "usuario es obligatorio"],
        unique:true
    },
    password:{
        type:String,
        required:[true, "password es obligatorio"]
    },
    email:{
        type:String,
        required:[true, "email es obligatorio"],
        unique:true
    }
});

/* Evitar devolver en Data el campo password */
usuariosSchema.methods.toJSON = function() {
    
    let usuario = this;
    let usuarioObject = usuario.toObject();
    delete usuarioObject.password;

    return usuarioObject;
}

//COMO PARAMETRO LE PASAMOS PRIMERO EL NOMBRE DE LA TABLA EN BD Y DESPUES EL SCHEMA
module.exports = mongoose.model('usuarios', usuariosSchema);