/* IMPORTAMOS EL MODELO */
const Galeria = require('../models/galeria.mod');

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

    //Obtener los datos del formulario para mandarlos al modelo
    let galeria = new Galeria({

        foto: body.foto

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

}

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getGaleria, 
    setGaleria
}