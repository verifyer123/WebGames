
/**
* Función de llamada ajax para validar el token de sesión.
* @param  {[Object]} config [Objeto con la configuración]
* {
*  data: {},
*  onSuccess : function(){},
*  onError : function(){}
* }
*/

APP.NotifyPlayed =  function(config){
    $.ajax({
        type: "POST",
        url: APP.SERVICES.GAME_PLAYED,
        data:  JSON.stringify(config.data),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response){
            config.onSuccess(response);
        },
        error: function(){
            alert('error game played');
            config.onError();
        }
    });
}

/**
* Función de llamada ajax para validar el token de sesión.
* @param  {[Object]} config [Objeto con la configuración]
* {
*  data: {},
*  onSuccess : function(){},
*  onError : function(){}
* }
*/

APP.GameAvailable =  function(config){
    $.ajax({
        type: "POST",
        url: APP.SERVICES.GAME_AVAILABLE,
        data:  JSON.stringify(config.data),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response){
            config.onSuccess(response);
        },
        error: function(){
            // alert('error game available');
            config.onError();
        }
    });
}

/**
* Función TEMPORAL de llamada ajax para hacer login.
* @param  {[Object]} config [Objeto con la configuración]
* {
*  onSuccess : function(){}
* }
*/

APP.Login =  function(config){
    $.ajax({
        type: "POST",
        url: APP.SERVICES.LOGIN,
        data: {
            "nickname": "nick",
            "pin": 1234
        },
        success: function(response){
            console.log(response);
            config.onSuccess(response);
        },
        error: function(){
            alert('error login');
        }
    });
}
