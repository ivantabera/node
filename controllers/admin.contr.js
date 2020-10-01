/* IMPORTAMOS EL MODELO */
const Admins = require('../models/admin.mod');

/* Modulo para encriptar contraseñas */
const bcrypt = require('bcrypt');

/* Modulo para generar token de autorizacion */
const jwt = require('jsonwebtoken');

/*
 * funcion GET 
 */
let getAdmin = (req, res) => {

    // documentacion https://mongoosejs.com/docs/api.html#model_Model.find
    Admins.find({}).exec((err, data)=>{
    
        if (err) {
            return res.json({
                status:500,
                mensaje: 'Error en la peticion '
            });        
        }

        //contar la cantidad de registros
        Admins.countDocuments({}, (err, count ) => {

            if (err) {
                return res.json({
                    status:500,
                    mensaje: 'Error en la peticion'
                });        
            }

            res.json({
                status:200,
                count, 
                data
            })

        })

    });

}

/*
 *funcion POST 
 */
let setAdmin = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;


    //Obtener los datos del formulario para mandarlos al modelo
    let admin = new Admins({

        usuario: body.usuario.toLowerCase(),
        password: bcrypt.hashSync(body.password,10)
    });

    //Guardamos en MongoDB
    //https://mongoosejs.com/docs/api.html#model_Model-save
    admin.save((err, data) => {

        if (err) {
            return res.json({
                status:400,
                mensaje: 'Error al almacenar el usuario',
                err
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
 *funcion PUT 
 */
let updateAdmin = (req, res) => {

    //Obtener el id del articulo a actualizar
   let id = req.params.id;
   
   //Obtener el cuerpo del formulario
   let body = req.body;

    //validar que el Administrador existe
   //documentacion en https://mongoosejs.com/docs/api.html#model_Model.findById
   Admins.findById(id, (err, data) =>{


        //validar que no hay error en ir a buscar en la BD
        if(err){

            return res.json({
                status:500,
                mensaje:"Error en el servidor",
                err
            })

        }

        if(!data){
           return res.json({
               status:400,
               mensaje:"El Administrador no existe en la base de datos"
           })
        }

        let pass = data.password;

        /* VALIDAR QUE EL HAYA CAMBIO DE contraseña */

        let validarCambioPassword = (body, pass)=>{

            return new Promise((resolve, reject) => {

                if(body.password == undefined){
                    resolve(pass);
                } else {
                    pass = bcrypt.hashSync(body.password,10);
                    resolve(pass);
                }
            })

        }


       /* ACTUALIZAMOS LOS REGISTROS */
       let cambiarRegistrosBD = (id, body, pass) =>{

           return new Promise((resolve, reject) => {
           
               let datosAdmin = {
                   usuario: body.usuario,
                   password: pass
               }

               //Actualizamos en MongoDB
               //Documentacion https://mongoosejs.com/docs/api.html#model_Model.IdAndUpdate
               Admins.findByIdAndUpdate(id, datosAdmin, {new:true, runValidators:true}, (err, data) =>{

                   if (err) {

                       let respuesta = {
                           res:res,
                           error:error
                       }

                       reject(respuesta);

                   }

                   let respuesta = {
                       res:res,
                       data:data
                   }

                   resolve(respuesta);

               })

           })

       }

        /* SINCRONIZAR TAREAS  */
        validarCambioPassword(body, pass).then(pass => {

            cambiarRegistrosBD(id, body, pass).then(respuesta => {

                respuesta["res"].json({
                    status:200,
                    data:respuesta["data"],
                    mensaje:"El administrador fue actualizado con exito"
                })

            }).catch( respuesta => {

                respuesta["res"].json({
                    status:400,
                    err:respuesta["err"],
                    mensaje:"Error al actualizar el administrador"
                })

            })

        }).catch(respuesta => {
            
            respuesta["res"].json({
                status:400,
                err:respuesta["err"],
                mensaje:respuesta["mensaje"]
            })

        })
   })

}

/*
 *funcion DELETE 
 */
let deleteAdmin = (req, res) => {

    //Capturar el id que se va borrar
    let id = req.params.id;

    /* Evitar borrar unico administrador */
    Admins.find({}).exec((err, data)=>{

        //contar la cantidad de registros
        Admins.countDocuments({}, (err, total ) => {

            if (total == 1) {
                return res.json({
                    status:400,
                    mensaje: 'No se puede borrar el unico administrador que existe'
                });        
            }

            //Validamos que el administrador existe
            Admins.findById(id, (err, data) =>{

                //validar que no hay error en ir a buscar en la BD
                if(err){

                    return res.json({
                        status:500,
                        mensaje:"Error en el servidor",
                        err
                    })

                }

                //validar que el administrador existe
                if(!data){

                    return res.json({
                        status:400,
                        mensaje:"El Administrador no existe en la base de datos"
                    })

                } 

                //borrar registro en mongoDB
                //documentacion https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
                Admins.findByIdAndRemove(id, (err, data) => {
                    
                    //validar que no hay error en ir a buscar en la BD
                    if(err){

                        return res.json({
                            status:500,
                            mensaje:"Error al borrar el administrador",
                            err
                        })

                    }

                    res.json({
                        status:200, 
                        mensaje: "El administrador fue borrado correctamente"
                    })


                })

            })

        })

    });
}

/*
 * funcion Login 
 */
let login = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;

    //Recorremos la base de datos en busqueda del usuario
    Admins.findOne({usuario:body.usuario}, (err, data) => {

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
            status:200,
            token,
            data
        })

    })
}

/*
 * Exportar funciones del controlador
 */
module.exports = {
    getAdmin,
    setAdmin,
    updateAdmin,
    deleteAdmin,
    login
}