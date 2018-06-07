
APP.Storage  = {}

APP.Storage.replaceInLocalstorage = function(name, item){
    console.log(name + ": "+ item);
  localStorage.setItem(name, item);
}

APP.Storage.getInLocalstorage = function(item){
  return localStorage.getItem(item);
}
