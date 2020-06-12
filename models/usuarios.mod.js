/* 
 *ESQUEMA PARA EL MODELO CONECTOR A MONGODB 
 */
const mongoose = require('mongoose');

/* Requerimos mongoose-unique-validator es un complemento que agrega validación previa al 
   guardado para campos únicos dentro de un esquema Mongoose. */
let uniqueValidator = require('mongoose-unique-validator');

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

/* Devolver mensaje personalizado para validaciones previa */
usuariosSchema.plugin(uniqueValidator, {message: 'El {PATH} ya esta registrado en la base de datos'});


//COMO PARAMETRO LE PASAMOS PRIMERO EL NOMBRE DE LA TABLA EN BD Y DESPUES EL SCHEMA
module.exports = mongoose.model('usuarios', usuariosSchema);