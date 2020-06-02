/* IMPORTAMOS EL MODELO */
const Slide = require('../models/slide.mod');

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

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getSlide,
    setSlide
}