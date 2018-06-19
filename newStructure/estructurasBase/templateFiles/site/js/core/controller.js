var APP = APP || {};

APP.superController = ( function(){

    var controllers, dataBind ;

    controllers = [];
    dataBind = null;

    return {
        setController : function(name){
            controllers.push(name);
        },
        getControllers : function(){
            return controllers;
        }
    }

})();

APP.controller = function(name, controllerExec){

    var reference, view, context ;

    reference = {};
    try {
        view = APP.view(name);
    } catch (e) {
        console.warn("View Class not loaded");
    }
    context = new Proxy(reference,  {
        set: function(target, prop, value) {
            if (view) {
                view.update(prop, value);
            }
        }
    });

    APP.superController.setController(name);
    controllerExec(context);

}
