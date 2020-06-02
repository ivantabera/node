/* IMPORTAMOS EL MODELO */
const Usuario = require('../models/usuarios.mod');

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
    getUsuarios
}