
// DEPENDENCIAS DE GULP

var gulp = require('gulp'),
  obfuscate = require('gulp-javascript-obfuscator'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  gulpif = require('gulp-if'),
  htmlmin = require('gulp-htmlmin'),
  shell = require('gulp-shell'),
  file = require('gulp-file'),
  fs = require('fs'),
  dom = require('gulp-dom');

// VARIABLES GLOBALES

var _MINIGAME = {
  PROD_MODE : true,
  ROUTES : {
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
      JS : "js",
      CSS : "css"
    },
    SRC : {
      HTML : "src",
      JS : "js",
      CSS : "css"
    }
  },
  FILE_EXCEPTIONS : {
    JS : [
      'dist/*',
      './node_modules/**',
      'gulpfile.js',
    ],
    CLONE : [
      'gulpfile.js',
      './dist/',
      './dist/**',
      '**/dist/',
      './node_modules/',
      './node_modules/**',
      'package.json',
      './src/js/**'
    ]
  },
  BASE_CONFIG: {
    FOLDERS : "src src/css src/images src/images/spines src/js src/js/scenes dist",
    FILES : ["src/index.html", "src/js/main.js", "src/css/index.css"]
  },
  DEPENDENCIES : {
    OBFUSCATE : {
      compact: true,
      controlFlowFlattening: false,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: false,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: false
    }
  }
}

//
//FUNCIONES AUXILIARES
//

/**
 * Inicia las carpetas y archivos base segun la
 * configuracion
 */

var initBaseProject = function(){
  initBaseDirectories();
  for (var i = 0; i < _MINIGAME.BASE_CONFIG.FILES.length; i++) {
    var path = "",
    name = _MINIGAME.BASE_CONFIG.FILES[i];
    if (_MINIGAME.BASE_CONFIG.FILES[i].includes("/")) {
      path = _MINIGAME.BASE_CONFIG.FILES[i].substring(0, _MINIGAME.BASE_CONFIG.FILES[i].lastIndexOf("/")+1);
      name = _MINIGAME.BASE_CONFIG.FILES[i].substring(_MINIGAME.BASE_CONFIG.FILES[i].lastIndexOf("/")+1, _MINIGAME.BASE_CONFIG.FILES[i].length);
    }
    initBaseFile(name, path);
  }
}

/**
 * Inicia los archivos base segun la
 * configuracion
 */

var initBaseFile = function(name, path){
  return file(name, "//void", { src: true })
    .pipe(gulp.dest(path));
}

/**
 * Inicia las carpetas base segun la
 * configuracion
 */

var initBaseDirectories = function(){
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      'mkdir -p ' + _MINIGAME.BASE_CONFIG.FOLDERS
    ]));
}

/**
 * Remplaza los scripts que estén referenciados en la carpeta js/
 * y coloca un script con referencia al script de distribución.
 */

var replaceScripts = function(){
  var scripts = this.querySelectorAll('script[src^="js"]'),
  i = scripts.length;
  while(i--) {
    removeNode(scripts[i]);
  }
  var lib = this.createElement('script');
    lib.setAttribute('src', 'js/'+_MINIGAME.ROUTES.MIN_JS.NAME+'.'+_MINIGAME.ROUTES.MIN_JS.SUFIX+'.js');
    this.body.appendChild(lib);
  return this;
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

//
//GULP TASKS
//

/**
 * Inicia el proyecto base y sus carpetas y archivos
 */

gulp.task('initBaseProject', function(){
  initBaseProject();
});

/**
 * Copia todos los archivos del proyecto original en la carpeta
 * de distribución salvo los que estén definidos en las
 * excepciones globales.
 */

gulp.task('cloneFiles', function(){
  console.log('CLONANDO');
  var conditions = [_MINIGAME.ROUTES.SRC.HTML+'/**/*'];
  for (var i = 0; i < _MINIGAME.FILE_EXCEPTIONS.CLONE.length; i++) {
    conditions.push("!"+_MINIGAME.FILE_EXCEPTIONS.CLONE[i]);
  }
  return gulp.src(conditions)
    .pipe(rename(function(path){
    }))
    .pipe(gulp.dest(_MINIGAME.ROUTES.DIST.HTML));
});

/**
 * Junta todos los archivos js en un solo archivo
 * ofuscado y minificado.
 */

gulp.task('prepareJsToDist', function(){
  console.log('PREPARANDO JS');
  var conditions = [_MINIGAME.ROUTES.SRC.HTML+"/"+_MINIGAME.ROUTES.SRC.JS+'/**/*.js'];
  for (var i = 0; i < _MINIGAME.FILE_EXCEPTIONS.JS.length; i++) {
    conditions.push("!"+_MINIGAME.FILE_EXCEPTIONS.JS[i]);
  }
  return gulp.src(conditions)
    .pipe(gulpif(_MINIGAME.PROD_MODE, obfuscate(_MINIGAME.DEPENDENCIES.OBFUSCATE)))
    .pipe(gulpif(_MINIGAME.PROD_MODE, rename(function(path){
      path.extname=".min.js";
    })))
    .pipe(concat(_MINIGAME.ROUTES.MIN_JS.NAME+"."+_MINIGAME.ROUTES.MIN_JS.SUFIX+'.js'))
    .pipe(gulp.dest("./"+_MINIGAME.ROUTES.DIST.HTML+"/"+_MINIGAME.ROUTES.DIST.JS));
});

/**
 * Cambia las referencias a los scripts que se
 * minificaron/ofuscaron/concatenaron y la reemplaza
 * por una referencia al archivo ya editado
 */

gulp.task('changeHtmlReference', ['cloneFiles', 'prepareJsToDist'], function () {
  console.log('CAMBIANDO REFERENCIA HTML');
  return gulp.src(_MINIGAME.ROUTES.SRC.HTML+'/'+'index.html')
    .pipe(dom(replaceScripts))
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(_MINIGAME.ROUTES.DIST.HTML));
})

/**
 * Permite construir la base de carpetas desde la
 * terminal
 */

gulp.task('base', function () {
  if(!fs.existsSync(_MINIGAME.ROUTES.DIST.HTML)){
    console.log('INICIANDO ESTRUCTURA BASE...');
    gulp.start('initBaseProject');
  }
})

/**
 * Permite hacer el minificado/ofuscado/ desde la
 * terminal
 */

gulp.task('build', function () {
  if(fs.existsSync(_MINIGAME.ROUTES.DIST.HTML)){
    console.log('GENERANDO ARCHIVOS DE DISTRIBUCION...');
    gulp.start('changeHtmlReference');
  }
})

//Gulp principal task.

gulp.task('default', function () {
   if(!fs.existsSync(_MINIGAME.ROUTES.DIST.HTML)){
     console.log('INICIANDO ESTRUCTURA BASE...');
     gulp.start('initBaseProject');
   }
   else{
     console.log('GENERANDO ARCHIVOS DE DISTRIBUCION...');
     gulp.start('changeHtmlReference');
   }
//  var response = request('GET', "https://raw.githubusercontent.com/geovanniYogome/playYogome/master/README.md?token=AjuQOQQGLiFvLRClVyBJNC5I_1MnN8GVks5a45prwA%3D%3D");
//  fs.writeFileSync("read.md",response.getBody());

})
