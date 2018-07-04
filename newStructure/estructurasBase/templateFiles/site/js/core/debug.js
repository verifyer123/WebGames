var localConsole = console;
console = (function(){
    var DEBUG_HEADER = "APP MSJ : ";
    var DEBUG_MSJ = APP.DEBUG;
    return {
        log : function(msg){
            if (DEBUG_MSJ) {
                localConsole.log(DEBUG_HEADER + msg);
            }
        },
        error : function(msg){
            if (DEBUG_MSJ) {
                localConsole.error(DEBUG_HEADER + msg);
            }
        },
        warn : function(msg){
            if (DEBUG_MSJ) {
                localConsole.warn(DEBUG_HEADER + msg);
            }
        },
        info : function(msg){
            if (DEBUG_MSJ) {
                localConsole.info(DEBUG_HEADER + msg);
            }
        },
    }
})()
