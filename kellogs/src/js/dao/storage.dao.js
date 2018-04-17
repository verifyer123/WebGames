
_QUANTRIX.Storage  = {}

_QUANTRIX.Storage.replaceInLocalstorage = function(name, item){
    console.log(name + ": "+ item);
  localStorage.setItem(name, item);
}

_QUANTRIX.Storage.getInLocalstorage = function(item){
  return localStorage.getItem(item);
}
