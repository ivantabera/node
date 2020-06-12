/* IMPORTAMOS EL MODELO */
const Usuario = require('../models/usuarios.mod');

/* Modulo para encriptar contraseñas */
const bcrypt = require('bcrypt');

/* Modulo para generar token de autorizacion */
const jwt = require('jsonwebtoken');

/*
 *funcion GET 
 */
//ruta a la cual va reaccionar
let getUsuarios = (req, res) =>{

    // documentacion https://mongoosejs.com/docs/api.html#model_Model.find
    Usuario.find({})
         .exec((err, data)=>{
        
        if (err) {
            return res.json({
                status:500,
                mensaje: 'Error en la peticion'
            });        
        }

        //contar la cantidad de registros
        Usuario.countDocuments({}, (err, count ) => {

            if (err) {
                return res.json({
                    status:500,
                    mensaje: 'Error en la peticion'
                });        
            }

            res.json({
                status:200,
                count , 
                data
            })

        })
    });

}

/*
 *funcion POST 
 */
let setUsuario = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;

    //Obtener los datos del formulario para mandarlos al modelo
    let usuario = new Usuario({

        usuario: body.usuario,
        password: bcrypt.hashSync(body.password,10),
        email: body.email

    });

    //Guardamos en MongoDB
    //https://mongoosejs.com/docs/api.html#model_Model-save
    usuario.save((err, data) => {

        if (err) {
            return res.json({
                status:400,
                mensaje: err.message
            });        
        }

        res.json({

            status:200,
            mensaje:'El usuario fue guardado con exito',
            data
        })

    })

}


/*
 * funcion Login 
 */
let loginUsuario = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;

    //Recorremos la base de datos en busqueda del usuario
    Usuario.findOne({usuario:body.usuario}, (err, data) => {

        //validar que no exista error en el proceso
        if (err) {
            return res.json({
                status:500,
                mensaje: 'Error en la peticion '
            });        
        }

        //validar si el usuario existe
        if(!data){

            return res.json({
                status:400,
                mensaje:"El usuario es incorrecto"
            })

        }

        //validamos que la contraseña sea correcta
        if(!bcrypt.compareSync(body.password, data.password)){
            return res.json({
                status:400,
                mensaje:"La contraseña es incorrecta"
            })
        }

        //generamos el token de autorizacion
        let token = jwt.sign({
            data
        }, process.env.SECRET, {expiresIn: process.env.CADUCIDAD} )

        res.json({
            mensaje:"ok",
            status:200,
            token
        })

    })
}

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getUsuarios,
    setUsuario,
    loginUsuario
}