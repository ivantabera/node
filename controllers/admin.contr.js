/* IMPORTAMOS EL MODELO */
const Admins = require('../models/admin.mod');

/*
 * funcion GET 
 */
let getAdmin = (req, res) => {

    // documentacion https://mongoosejs.com/docs/api.html#model_Model.find
    Admins.find({}).exec((err, data)=>{
    
        if (err) {
            return res.json({
                status:500,
                mensaje: 'Error en la peticion '
            });        
        }

        //contar la cantidad de registros
        Admins.countDocuments({}, (err, count ) => {

            if (err) {
                return res.json({
                    status:500,
                    mensaje: 'Error en la peticion'
                });        
            }

            res.json({
                status:200,
                count, 
                data
            })

        })

    });

}

/*
 *funcion POST 
 */
let setAdmin = (req, res) => {

    //Obtener el cuerpo del formulario
    let body = req.body;


    //Obtener los datos del formulario para mandarlos al modelo
    let admin = new Admins({

        usuario: body.usuario,
        password: body.password
    });

    //Guardamos en MongoDB
    //https://mongoosejs.com/docs/api.html#model_Model-save
    admin.save((err, data) => {

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

/*
 * Exportar funciones del controlador
 */
module.exports = {
    getAdmin,
    setAdmin
}