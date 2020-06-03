/* IMPORTAMOS EL MODELO */
const Slide = require('../models/slide.mod');

//Administrador de carpetas y archivos
const fs = require('fs');
const { exit } = require('process');

/*
 *funcion GET 
 */
//ruta a la cual va reaccionar
let getSlide = (req, res) =>{

    // documentacion https://mongoosejs.com/docs/api.html#model_Model.find
    Slide.find({})
         .exec((err, data)=>{
        
        if (err) {
            return res.json({
                status:500,
                mensaje: 'Error en la peticion'
            });        
        }

        //contar la cantidad de registros
        Slide.countDocuments({}, (err, count ) => {

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
let setSlide = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;

    //preguntamos si viene un archivo
    if(req.files){

        //capturamos el archivo
        let archivo = req.files.imagen;

        //validamos el formato de la imagen
        if(archivo.mimetype == 'image/jpeg' || archivo.mimetype == 'image/png'){

            //validamos el peso de la imagen
            if(archivo.size < 2000000){

                //cambiar nombre al archivo
                let nombre = Math.floor(Math.random()*10000);

                //capturar la extension del archivo
                let extension = archivo.name.split('.').pop();

                //movemos el archivo a la carpeta
                archivo.mv(`./images/slide/${nombre}.${extension}`, err => {

                    if(err){
                        return res.json({
                            status:500,
                            mensaje: 'Error al guardar la imagen',
                            err
                        });  
                    }

                    //Obtener los datos del formulario para mandarlos al modelo
                    let slide = new Slide({

                        imagen: `${nombre}.${extension}`,
                        titulo: body.titulo,
                        descripcion: body.descripcion

                    });

                    //Guardamos en MongoDB
                    //https://mongoosejs.com/docs/api.html#model_Model-save
                    slide.save((err, data) => {

                        if (err) {
                            return res.json({
                                status:400,
                                mensaje: 'Error al almacenar el slide',
                                err
                            });        
                        }

                        res.json({

                            status:200,
                            mensaje:'El slide fue guardada con exito',
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
let updateSlide = (req, res) =>{

    //Obtener el id del articulo a actualizar
   let id = req.params.id;

   //Obtener el cuerpo del formulario
   let body = req.body;

   //documentacion en https://mongoosejs.com/docs/api.html#model_Model.findById
   Slide.findById(id, (err, data) =>{

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
               mensaje:"La foto del Slide no existe en la base de datos"
           })

       }

       let rutaImagen = data.imagen;

       /* VALIDAR QUE EL HAYA CAMBIO DE IMAGEN */

       let validarCambioArchivo = (req, rutaImagen)=>{

           return new Promise((resolve, reject) => {
               
               if (req.files) {
                   
                   //capturamos el archivo
                   let archivo = req.files.imagen;

                   //validamos el formato de la imagen
                   if(archivo.mimetype == 'image/jpeg' || archivo.mimetype == 'image/png'){

                       //validamos el peso de la imagen
                       if(archivo.size < 2000000){

                           //cambiar nombre al archivo
                           let nombre = Math.floor(Math.random()*10000);

                           //capturar la extension del archivo
                           let extension = archivo.name.split('.').pop();

                           //movemos el archivo a la carpeta
                           archivo.mv(`./images/slide/${nombre}.${extension}`, err => {

                               if(err){
                                   
                                   let respuesta = {
                                       res: res,
                                       mensaje: "Error al guardar la foto del slide" 
                                   }
               
                                   reject(respuesta);

                               }

                               //Borrar imagen antigua
                               if(fs.existsSync(`./images/slide/${rutaImagen}`)){
                                   
                                   fs.unlinkSync(`./images/slide/${rutaImagen}`)

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
                   imagen: rutaImagen
               }

               //Actualizamos en MongoDB
               //Documentacion https://mongoosejs.com/docs/api.html#model_Model.IdAndUpdate
               Slide.findByIdAndUpdate(id, datosFoto, {new:true, runValidators:true}, (err, data) =>{

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
                   mensaje:"La foto del slide fue actualizada con exito"
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
let deleteSlide = (req, res) => {

    //Capturar el id que se va borrar
    let id = req.params.id;

    //Validamos que el articulo existe
    Slide.findById(id, (err, data) =>{

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
                mensaje:"El slide no existe en la base de datos"
            })

        } 

        //Borrar imagen antigua
        if(fs.existsSync(`./images/slide/${data.imagen}`)){

            fs.unlinkSync(`./images/slide/${data.imagen}`)
        }

        //borrar registro en mongoDB
        //documentacion https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
        Slide.findByIdAndRemove(id, (err, data) => {
            
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
                mensaje: "El slide fue borrado correctamente"
            })


        })

    })
}

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getSlide,
    setSlide,
    updateSlide,
    deleteSlide
}