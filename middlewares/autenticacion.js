const jwt = require('jsonwebtoken');

/* Verificar token */
let verficaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, "topsecret", (err, decoded) => {

        if(err){
            return res.json({
                status:401, 
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    })
}

module.exports = {
    verficaToken
}