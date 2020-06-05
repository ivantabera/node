/* IMPORTAMOS EL MODELO */
const Galeria = require('../models/galeria.mod');

//Administrador de carpetas y archivos
const fs = require('fs');
//Permite trabajar con las rutas de los archivos en nuestro servidor
const path = require('path');

/*
 *funcion GET 
 */
let getGaleria = (req, res) =>{

    // documentacion https://mongoosejs.com/docs/api.html#model_Model.find
    Galeria.find({})
         .exec((err, data)=>{
        
        if (err) {
            return res.json({
                status:500,
                mensaje: 'Error en la peticion '
            });        
        }

        //contar la cantidad de registros
        Galeria.countDocuments({}, (err, count ) => {

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
let setGaleria = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;

    //preguntamos si viene un archivo
    if(req.files){

        //capturamos el archivo
        let archivo = req.files.foto;

        //validamos el formato de la imagen
        if(archivo.mimetype == 'image/jpeg' || archivo.mimetype == 'image/png'){

            //validamos el peso de la imagen
            if(archivo.size < 2000000){

                //cambiar nombre al archivo
                let nombre = Math.floor(Math.random()*10000);

                //capturar la extension del archivo
                let extension = archivo.name.split('.').pop();

                //movemos el archivo a la carpeta
                archivo.mv(`./images/galeria/${nombre}.${extension}`, err => {

                    if(err){
                        return res.json({
                            status:500,
                            mensaje: 'Error al guardar la imagen',
                            err
                        });  
                    }

                    //Obtener los datos del formulario para mandarlos al modelo
                    let galeria = new Galeria({

                        foto: `${nombre}.${extension}`

                    });

                    //Guardamos en MongoDB
                    //https://mongoosejs.com/docs/api.html#model_Model-save
                    galeria.save((err, data) => {


                        if (err) {
                            return res.json({
                                status:400,
                                mensaje: 'Error al almacenar la galeria',
                                err
                            });        
                        }

                        res.json({

                            status:200,
                            mensaje:'La galeria fue guardada con exito',
                            data
                        })

                    })
                
                })

            } else {
                return res.json({
                    status:400,
                    mensaje: 'Solo puedes subir imagenes que no superen los 2mb'
                });  
            }
        
        } else {
            return res.json({
                status:400,
                mensaje: 'El formato del archivo no es valido, solo se acepta jpg/png'
            });  
        }

    } else{

        return res.json({
            status:500,
            mensaje: 'La imagen no puede ir vacia'
        });  

    }

}

/*
 *funcion PUT 
 */
let updateGaleria = (req, res) =>{

    //Obtener el id del articulo a actualizar
   let id = req.params.id;
   
   //Obtener el cuerpo del formulario
   let body = req.body;

   //documentacion en https://mongoosejs.com/docs/api.html#model_Model.findById
   Galeria.findById(id, (err, data) =>{

       //validar que la Galeria exista
       if(data){

           //validar que no hay error en ir a buscar en la BD
           if(err){

               return res.json({
                   status:500,
                   mensaje:"Error en el servidor",
                   err
               })

           }

       } else {

           return res.json({
               status:400,
               mensaje:"La foto de Galeria no existe en la base de datos"
           })

       }


       let rutaImagen = data.foto;

       /* VALIDAR QUE EL HAYA CAMBIO DE IMAGEN */

       let validarCambioArchivo = (req, rutaImagen)=>{

           return new Promise((resolve, reject) => {
               
               if (req.files) {
                   
                   //capturamos el archivo
                   let archivo = req.files.foto;

                   //validamos el formato de la imagen
                   if(archivo.mimetype == 'image/jpeg' || archivo.mimetype == 'image/png'){

                       //validamos el peso de la imagen
                       if(archivo.size < 2000000){

                           //cambiar nombre al archivo
                           let nombre = Math.floor(Math.random()*10000);

                           //capturar la extension del archivo
                           let extension = archivo.name.split('.').pop();

                           //movemos el archivo a la carpeta
                           archivo.mv(`./images/galeria/${nombre}.${extension}`, err => {

                               if(err){
                                   
                                   let respuesta = {
                                       res: res,
                                       mensaje: "Error al guardar la foto de la galeria" 
                                   }
               
                                   reject(respuesta);

                               }

                               //Borrar imagen antigua
                               if(fs.existsSync(`./images/galeria/${rutaImagen}`)){

                                   fs.unlinkSync(`./images/galeria/${rutaImagen}`)
                               }

                               //Damos valor a la nueva ruta
                               rutaImagen = `${nombre}.${extension}`;

                               resolve(rutaImagen);

                           })
                           
                       } else {

                           let respuesta = {
                               res: res,
                               mensaje: "Solo puedes subir imagenes que no superen los 2mb" 
                           }
       
                           reject(respuesta);

                       }

                   } else {

                       let respuesta = {
                           res: res,
                           mensaje: "El formato del archivo no es valido, solo se acepta jpg/png" 
                       }

                       reject(respuesta);
                   }

               } else{

                   resolve(rutaImagen); 
               
               }
           })

       }

       /* ACTUALIZAMOS LOS REGISTROS */
       let cambiarRegistrosBD = (id, body, rutaImagen) =>{

           return new Promise((resolve, reject) => {
           
               let datosFoto = {
                   foto: rutaImagen
               }

               //Actualizamos en MongoDB
               //Documentacion https://mongoosejs.com/docs/api.html#model_Model.IdAndUpdate
               Galeria.findByIdAndUpdate(id, datosFoto, {new:true, runValidators:true}, (err, data) =>{

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
       validarCambioArchivo(req, rutaImagen).then(rutaImagen => {

           cambiarRegistrosBD(id, body, rutaImagen).then(respuesta => {

               respuesta["res"].json({
                   status:200,
                   data:respuesta["data"],
                   mensaje:"La foto de la Galeria fue actualizada con exito"
               })

           }).catch( respuesta => {

               respuesta["res"].json({
                   status:400,
                   err:respuesta["err"],
                   mensaje:"Error al actualizar la foto"
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
let deleteGaleria = (req, res) => {

    //Capturar el id que se va borrar
    let id = req.params.id;

    //Validamos que el articulo existe
    Galeria.findById(id, (err, data) =>{

        //validar que no hay error en ir a buscar en la BD
        if(err){

            return res.json({
                status:500,
                mensaje:"Error en el servidor",
                err
            })

        }

        //validar que el Articulo existe
        if(!data){

            return res.json({
                status:400,
                mensaje:"La imagen no existe en la base de datos"
            })

        } 

        //Borrar imagen antigua
        if(fs.existsSync(`./images/galeria/${data.foto}`)){

            fs.unlinkSync(`./images/galeria/${data.foto}`)
        }

        //borrar registro en mongoDB
        //documentacion https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
        Galeria.findByIdAndRemove(id, (err, data) => {
            
            //validar que no hay error en ir a buscar en la BD
            if(err){

                return res.json({
                    status:500,
                    mensaje:"Error al borrar la imagen",
                    err
                })

            }

            res.json({
                status:200, 
                mensaje: "El articulo fue borrado correctamente"
            })


        })

    })
}

/*
 * funcion GET para poder tener acceso a las imagenes
 */
let getImagen = (req, res) => {
    
    //tomamos el parametro imagen que viene del formulario
    let imagen = req.params.imagen;

    //generamos la imagen de donde estan las imagenes
    let rutaImagen = `./images/galeria/${imagen}`;

    //Comprobaremos que el archivo existe
    fs.exists(rutaImagen, exists => {
        
        if(!exists){
            return res.json({
                status:400,
                mensaje:"La imagen no existe"
            })
        }

        //Renderisamos el archivo en la vista
        res.sendFile(path.resolve(rutaImagen));

    })
}

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getGaleria, 
    setGaleria,
    updateGaleria,
    deleteGaleria,
    getImagen
}