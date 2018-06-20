/**
 * Controlador principal
 * @param  {String} name Nombre del controlador
 * @param  {function} controllerExec Función del controlador. ctx corresponde al contexto del controlador
 * @return {undefined}
 */
APP.controller("index", function(ctx){
    ctx.size = 180
    ctx.size = 3000
    ctx.dog = 180;
    setTimeout(function(){
        ctx.size = 1000
    },4000);
    setTimeout(function(){
        ctx.dog = 10
    },2000);
})
