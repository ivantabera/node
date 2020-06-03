/* IMPORTAMOS EL MODELO */
const Articulo = require('../models/articulos.mod');

/*
 *funcion GET 
 */
let getArticulo = (req, res) =>{

    // documentacion https://mongoosejs.com/docs/api.html#model_Model.find
    Articulo.find({}).exec((err, data)=>{
        
        if (err) {
            return res.json({
                status:500,
                mensaje: 'Error en la peticion '
            });        
        }

        //contar la cantidad de registros
        Articulo.countDocuments({}, (err, count ) => {

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
let setArticulo = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;

    //preguntamos si viene un archivo
    if(req.files){

        //capturamos el archivo
        let archivo = req.files.portada;

        //validamos el formato de la imagen
        if(archivo.mimetype == 'image/jpeg' || archivo.mimetype == 'image/png'){

            //validamos el peso de la imagen
            if(archivo.size < 2000000){

                //cambiar nombre al archivo
                let nombre = Math.floor(Math.random()*10000);

                //capturar la extension del archivo
                let extension = archivo.name.split('.').pop();

                //movemos el archivo a la carpeta
                archivo.mv(`./images/articulos/${nombre}.${extension}`, err => {
                    
                    if(err){
                        return res.json({
                            status:500,
                            mensaje: 'Error al guardar la imagen',
                            err
                        });  
                    }

                    //Obtener los datos del formulario para mandarlos al modelo
                    let articulo = new Articulo({

                        id: body.id,
                        portada: `${nombre}.${extension}`,
                        url: body.portada,
                        titulo: body.titulo,
                        intro: body.intro,
                        contenido: body.contenido
                    });

                    //Guardamos en MongoDB
                    //https://mongoosejs.com/docs/api.html#model_Model-save
                    articulo.save((err, data) => {

                        if (err) {
                            return res.json({
                                status:400,
                                mensaje: 'Error al almacenar el articulo',
                                err
                            });        
                        }

                        res.json({

                            status:200,
                            mensaje:'El articulo fue guardado con exito',
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
let updateArticulo = (req, res) =>{

     //Obtener el id del articulo a actualizar
    let id = req.params.id;
    
    //Obtener el cuerpo del formulario
    let body = req.body;

    /* VALIDAR QUE EL SLIDE EXISTA */

    //documentacion en https://mongoosejs.com/docs/api.html#model_Model.findById
    Articulo.findById(id, (err, data) =>{

        //validar que no hay error en ir a buscar en la BD
        if(err){

            return res.json({
                status:500,
                mensaje:"Error en el servidor",
                err
            })

        }

        //validar que el Articulo existe
        if(data){

            let rutaImagen = data.portada;

            /* VALIDAR EL CAMBIO DE IMAGEN */
        
        
            /* ACTUALIZAMOS LOS REGISTROS */
            let datosArticulo = {
                portada: rutaImagen,
                url: body.url,
                titulo: body.titulo,
                intro: body.intro,
                contenido: body.contenido
            }

            //Actualizamos en MongoDB
            //Documentacion https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
            Articulo.findByIdAndUpdate(id, datosArticulo, {new:true, runValidators:true}, (err, data) =>{

                if (err) {
                    return res.json({
                        status:400,
                        mensaje: 'Error al actualizar el articulo'
                    });  
                }

                res.json({

                    status:200,
                    mensaje:'El articulo fue actualizado con exito',
                    data
                })
            })

        } else {

            return res.json({
                status:400,
                mensaje:"El Articulo no existe en la base de datos"
            })

        }

    })


}

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getArticulo,
    setArticulo,
    updateArticulo
}