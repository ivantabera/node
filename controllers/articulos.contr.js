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

    //Obtener los datos del formulario para mandarlos al modelo
    let articulo = new Articulo({

        id: body.id,
        portada: body.portada,
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

}

/* EXPORTAR FUNCIONES DEL CONTROLADOR */
module.exports = {
    getArticulo,
    setArticulo
}