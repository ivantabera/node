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

    //Obtener los datos del formulario para mandarlos al modelo
    let slide = new Slide({

        imagen: body.imagen,
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

}

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getSlide,
    setSlide
}