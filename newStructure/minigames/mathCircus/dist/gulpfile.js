
// Gulp dependencies.

var gulp = require('gulp'),
  obfuscate = require('gulp-javascript-obfuscator'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  dom = require('gulp-dom');


// Global static variables

var _ROUTES = {
  MIN_JS : {
    NAME :  "script",
    SUFIX : "min"
  },
  MIN_CSS : {
    NAME :  "styles",
    SUFIX : "min"
  },
  DIST : {
    HTML : "dist",
    JS : "dist/js",
    CSS : "dist/css"
  }
}

var _FILES = {
  _EXCEPTIONS : [
    '!package.json',
    '!package-lock.json',
    '!gulpfile.js',
    '!./node_modules/**',
    '!./js/**',
    '!index.html'
  ]
}

var _OBFUSCATE_OPT = {
  compact: true,
  controlFlowFlattening: false,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: false,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false
}

// Controller functions.

/**
 * Copia todos los archivos del proyecto original en la carpeta
 * de distribución salvo los que estén definidos en las
 * excepciones globales.
 * @return {[type]} [description]
 */

var cloneFiles = function(){
  var conditions = ['**/*'];
  for (var i = 0; i < _FILES._EXCEPTIONS.length; i++) {
    conditions.push(_FILES._EXCEPTIONS[i]);
  }
  return gulp.src(conditions)
    .pipe(gulp.dest(_ROUTES.DIST.HTML));
}

/**
 * Junta todos los archivos js en un solo archivo
 * ofuscado y minificado.
 * @return {Buffer} [Node Buffer Object]
 */

var prepareJsToDist = function(){
  return gulp.src('js/**/*.js')
  .pipe(concat(_ROUTES.MIN_JS.NAME+'.js'))
  .pipe(obfuscate(_OBFUSCATE_OPT))
  .pipe(rename(_ROUTES.MIN_JS.NAME+'.'+_ROUTES.MIN_JS.SUFIX+'.js'))
  .pipe(gulp.dest(_ROUTES.DIST.JS));
}

/**
 * Remueve un nodo del DOM
 * @param  {DOMNode} node Nodo a remover
 * @return {void}
 */

 var removeNode = function(node) {
     var parent = node.parentNode;
     parent.removeChild(node);
 }

/**
 * Remplaza los scripts que estén en la carpeta js/
 * y coloca un script con referencia al script de distribución.
 * @return {void}
 */

 var replaceLocalScripts = function(){
   var scripts = this.querySelectorAll('script[src^="js"]'),
     i 		= scripts.length;
     while(i--) {
       removeNode(scripts[i]);
     }
   var lib = this.createElement('script');
     lib.setAttribute('src', 'js/'+_ROUTES.MIN_JS.NAME+'.'+_ROUTES.MIN_JS.SUFIX+'.js');
     this.body.appendChild(lib);
     return this;
 }

 /**
  * Cambia las referencias a los scripts que se
  * minificaron/ofuscaron/concatenaron y la reemplaza
  * por una referencia al archivo ya editado
  * @return {Buffer} [Node Buffer Object]
  */

var changeHtmlReference = function(){
  return gulp.src('index.html')
    .pipe(dom(replaceLocalScripts))
    .pipe(gulp.dest(_ROUTES.DIST.HTML));
}

//Gulp principal task.

/**
 * Inicia la ejecución del script
 */

gulp.task('default', function () {
  cloneFiles();
  prepareJsToDist();
  changeHtmlReference();
})
