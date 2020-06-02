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

        res.json({
            status:200,
            data
        })
    });

}

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getGaleria
}