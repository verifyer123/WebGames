
// DEPENDENCIAS DE GULP

var gulp = require('gulp'),
  obfuscate = require('gulp-javascript-obfuscator'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  gulpif = require('gulp-if'),
  htmlmin = require('gulp-htmlmin'),
  shell = require('gulp-shell'),
  file = require('gulp-file'),
  path = require('path'),
  fs = require('fs'),
  browserSync = require('browser-sync').create(),
  watch = require('gulp-watch'),
  cleanCSS = require('gulp-clean-css'),
  dom = require('gulp-dom');

// VARIABLES GLOBALES

var _QUANTRIX = {
  SERVER : {
    PORT : 3000,
    BASE_DIR : "../",
    START_PATH : "quantrix/src/"
  },
  FILE_WATCH : [
    '.html',
    '.js',
    '.css'
  ],
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
    CSS : [
      'dist/*',
      './node_modules/**'
    ],
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
      './src/js/**',
      './src/css/**'
    ]
  },
  BASE_CONFIG: {
    FOLDERS : "dist src/css src/js src/js/scenes src/js/ui src/js/model src/images  src/images/spines sounds",
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
  for (var i = 0; i < _QUANTRIX.BASE_CONFIG.FILES.length; i++) {
    var path = "",
    name = _QUANTRIX.BASE_CONFIG.FILES[i];
    if (_QUANTRIX.BASE_CONFIG.FILES[i].includes("/")) {
      path = _QUANTRIX.BASE_CONFIG.FILES[i].substring(0, _QUANTRIX.BASE_CONFIG.FILES[i].lastIndexOf("/")+1);
      name = _QUANTRIX.BASE_CONFIG.FILES[i].substring(_QUANTRIX.BASE_CONFIG.FILES[i].lastIndexOf("/")+1, _QUANTRIX.BASE_CONFIG.FILES[i].length);
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
      'mkdir -p ' + _QUANTRIX.BASE_CONFIG.FOLDERS
    ]));
}

/**
 * Remplaza los scripts que estén referenciados en la carpeta js/
 * y coloca un script con referencia al script de distribución.
 */

var replaceScripts = function(){
  var scripts = this.querySelectorAll('script[src^="'+_QUANTRIX.ROUTES.SRC.JS+'"]'),
  i = scripts.length,
  j = -1,
  tempNames = [];
  while(j++ <  i-1) {
    var src = scripts[j].getAttribute('src'),
    path = src.substring(0, src.lastIndexOf('/')+1);
    name = src.substring(src.lastIndexOf('/')+1, src.lastIndexOf('.js'));
    if (!src.includes('.min')) {
      var lib = this.createElement('script');
      lib.setAttribute('src', path+name+'.'+_QUANTRIX.ROUTES.MIN_JS.SUFIX+'.js');
      scripts[j].parentNode.insertBefore(lib, scripts[j].nextSibling);
      removeNode(scripts[j]);
    }
    else{
      // console.log("El archivo : " + name + "ya está minificado");
    }
  }
  return this;
}

/**
 * Remplaza los links que estén referenciados en la carpeta css/
 * y coloca un link con referencia al css de distribución.
 */

var replaceCss = function(){
  var references = this.querySelectorAll('link[href^="'+_QUANTRIX.ROUTES.SRC.CSS+'"]'),
  i = references.length,
  j = -1,
  tempNames = [];
  while(j++ <  i-1) {
    var href = references[j].getAttribute('href'),
    path = href.substring(0, href.lastIndexOf('/')+1);
    name = href.substring(href.lastIndexOf('/')+1, href.lastIndexOf('.css'));
    if (!href.includes('.min')) {
      var lib = this.createElement('link');
      lib.setAttribute('href', path+name+'.'+_QUANTRIX.ROUTES.MIN_CSS.SUFIX+'.css');
      lib.setAttribute('rel', 'stylesheet');
      references[j].parentNode.insertBefore(lib, references[j].nextSibling);
      removeNode(references[j]);
    }
    else{
      // console.log("El archivo : " + name + "ya está minificado");
    }
  }
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
  var conditions = [_QUANTRIX.ROUTES.SRC.HTML+'/**/*'];
  for (var i = 0; i < _QUANTRIX.FILE_EXCEPTIONS.CLONE.length; i++) {
    conditions.push("!"+_QUANTRIX.FILE_EXCEPTIONS.CLONE[i]);
  }
  return gulp.src(conditions)
    .pipe(rename(function(path){
    }))
    .pipe(gulp.dest(_QUANTRIX.ROUTES.DIST.HTML));
});

/**
 * Junta todos los archivos js en un solo archivo
 * ofuscado y minificado.
 */

gulp.task('prepareJsToDist', function(){
  console.log('PREPARANDO JS');
  var conditions = [_QUANTRIX.ROUTES.SRC.HTML+"/"+_QUANTRIX.ROUTES.SRC.JS+'/**/*.js'];
  for (var i = 0; i < _QUANTRIX.FILE_EXCEPTIONS.JS.length; i++) {
    conditions.push("!"+_QUANTRIX.FILE_EXCEPTIONS.JS[i]);
  }
  return gulp.src(conditions)
    .pipe(gulpif(_QUANTRIX.PROD_MODE , obfuscate(_QUANTRIX.DEPENDENCIES.OBFUSCATE)))
    .pipe(gulpif(_QUANTRIX.PROD_MODE, rename(function(path){
      if (!path.basename.includes('.min')) {
        path.extname=".min.js";
      }
    })))
    .pipe(gulp.dest("./"+_QUANTRIX.ROUTES.DIST.HTML+"/"+_QUANTRIX.ROUTES.DIST.JS));
});

/**
 * Minifica el css.
 */

gulp.task('prepareCssToDist', function(){
  console.log('PREPARANDO CSS');
  var conditions = [_QUANTRIX.ROUTES.SRC.HTML+"/"+_QUANTRIX.ROUTES.SRC.CSS+'/**/*.css'];
  for (var i = 0; i < _QUANTRIX.FILE_EXCEPTIONS.CSS.length; i++) {
    conditions.push("!"+_QUANTRIX.FILE_EXCEPTIONS.CSS[i]);
  }
  return gulp.src(conditions)
    .pipe(gulpif(_QUANTRIX.PROD_MODE, cleanCSS(_QUANTRIX.DEPENDENCIES.CLEAN_CSS)))
    .pipe(gulpif(_QUANTRIX.PROD_MODE, rename(function(path){
      if (!path.basename.includes('.min')) {
        path.extname=".min.css";
      }
    })))
    .pipe(gulp.dest("./"+_QUANTRIX.ROUTES.DIST.HTML+"/"+_QUANTRIX.ROUTES.DIST.CSS));
});

/**
 * Cambia las referencias a los scripts que se
 * minificaron/ofuscaron/concatenaron y la reemplaza
 * por una referencia al archivo ya editado
 */

gulp.task('changeHtmlReference', ['prepareJsToDist', 'prepareCssToDist', 'cloneFiles'], function () {
  console.log('CAMBIANDO REFERENCIA HTML');
  return gulp.src(_QUANTRIX.ROUTES.SRC.HTML+'/*.html')
    .pipe(dom(replaceScripts))
    .pipe(dom(replaceCss))
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(_QUANTRIX.ROUTES.DIST.HTML));
})

/**
 * Permite construir la base de carpetas desde la
 * terminal
 */

gulp.task('base', function () {
  if(!fs.existsSync(_QUANTRIX.ROUTES.DIST.HTML)){
    console.log('INICIANDO ESTRUCTURA BASE...');
    gulp.start('initBaseProject');
  }
})

/**
 * Permite hacer el minificado/ofuscado/ desde la
 * terminal
 */

gulp.task('build', function () {
  if(fs.existsSync(_QUANTRIX.ROUTES.DIST.HTML)){
    console.log('GENERANDO ARCHIVOS DE DISTRIBUCION...');
    gulp.start('changeHtmlReference');
  }
})

/**
 * Actualiza el navegador y genera los archivos
 * de distribucion.
 */

gulp.task('updateServer', function(done) {
  console.log('RECARGANDO...');
  browserSync.reload();
  gulp.start('changeHtmlReference');
  done();
});

/**
 * Inicia el servidor en el puerto indicado en al configuracion
 * e inicia el escuchador de eventos para cambios en los archivos.
 */

gulp.task('initServer', function(done) {
  var conditions = [];
  for (var i = 0; i < _QUANTRIX.FILE_WATCH.length; i++) {
    conditions.push(_QUANTRIX.ROUTES.SRC.HTML+"/**/*"+_QUANTRIX.FILE_WATCH[i]);
  }
  browserSync.init({
    port : _QUANTRIX.SERVER.PORT,
    startPath: _QUANTRIX.SERVER.START_PATH,
    server: {
      baseDir: _QUANTRIX.SERVER.BASE_DIR
      // baseDir: _QUANTRIX.ROUTES.SRC.HTML
    }
  });
  console.log('ESCUCHANDO CAMBIOS...');
  gulp.watch(conditions, ['updateServer']);
});


//Gulp principal task.

gulp.task('default', function () {
  if(!fs.existsSync(_QUANTRIX.ROUTES.DIST.HTML)){
    console.log('INICIANDO ESTRUCTURA BASE...');
    gulp.start('initBaseProject');
    gulp.start('initServer');
  }
  else{
    console.log('GENERANDO ARCHIVOS DE DISTRIBUCION...');
    gulp.start('initServer');
  }
})
