/* UBICAMOS LOS REQUERIMIENTOS */
const http = require('http');

/* SALIDA DEL PUERTO HTTP */
http.createServer((req, res) =>{

    /* SALIDA JSON */
    res.writeHead(200, {'Content-Type':'application/json'})
    
    let salida = {
    nombre: "Ivan",
        edad: 31,
        url: req.url
    }

    res.write(JSON.stringify(salida));
    res.end();

}).listen(4000);

console.log("habilitado el puerto 4000");