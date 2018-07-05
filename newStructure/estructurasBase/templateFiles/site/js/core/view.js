var APP = APP || {};

APP.view = function(name){
    var viewDOM = document.querySelector("[controller="+name.trim()+"]");
    return {
        update : function(key, toReplace){
            var toFind = "{{"+key.trim()+"}}"
            if (viewDOM.innerHTML.indexOf(toFind) != -1) {
                viewDOM.innerHTML = viewDOM.innerHTML.replace(toFind, "<ctrl-value name='"+key+"'>"+toReplace+"</ctrl-value>");
            }
            else if(viewDOM.querySelector("ctrl-value[name='"+key+"']") != null){
                viewDOM.querySelector("ctrl-value[name='"+key+"']").innerHTML = toReplace;
            }

        }
    }
}
