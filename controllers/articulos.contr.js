/* IMPORTAMOS EL MODELO */
const Articulo = require('../models/articulos.mod');

/*
 *funcion GET 
 */
//ruta a la cual va reaccionar
let getArticulo = (req, res) =>{

    // documentacion https://mongoosejs.com/docs/api.html#model_Model.find
    Articulo.find({})
         .exec((err, data)=>{
        
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
                    status:400,
                    mensaje: 'No hay documentos '
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

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getArticulo
}