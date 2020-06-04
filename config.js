/* 
 * EL PROCESS ES UN OBJETO GLOBAL QUE CORRE EN TODO EL ENTORNO DE DESARROLLO DE NODE JS
 */
process.env.PORT = process.env.PORT || 4000;

//variable global para firma secreta de token
process.env.SECRET = "topsecret";

//caducidad del token (segundos, minutos, horas, dias)
process.env.CADUCIDAD = 60*60*24*30;