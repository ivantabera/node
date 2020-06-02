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
                mensaje: 'Error en la peticion'
            });        
        }

        //contar la cantidad de registros
        Usuario.countDocuments({}, (err, count ) => {

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
let setUsuario = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;

    //Obtener los datos del formulario para mandarlos al modelo
    let usuario = new Usuario({

        usuario: body.usuario,
        password: body.password

    });

    //Guardamos en MongoDB
    //https://mongoosejs.com/docs/api.html#model_Model-save
    usuario.save((err, data) => {

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

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getUsuarios,
    setUsuario
}