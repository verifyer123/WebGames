
// Gulp dependencies.

var gulp = require('gulp'),
obfuscate = require('gulp-javascript-obfuscator'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
dom = require('gulp-dom'),
path = require('path'),
fs = require('fs'),
gulpif = require('gulp-if'),
htmlmin = require('gulp-htmlmin');


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
    },
    FILES_PATH: '../../minigames',

}

var _FILES = {
    CLONE_EXCEPTIONS : [
        '!package.json',
        '!package-lock.json',
        '!gulpfile.js',
        '!./node_modules/**',
        './js/**',
        'index.html',
        './js/**',
        './dist/**',
        './dist/',
        './dist',
        '.dist/',
        '**/dist/',
        'dist',
        '{dist,dist/**}',
        './js/**',
        './js/**',
        './js/',
        './js',
        '.js/',
        '**/js/',
        'js',
        '{js,js/**}',
        'js/**'
    ],
    JS_EXCEPTIONS : [
        'phaser*'
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

var cloneFiles = function(folder){
    var conditions = [_ROUTES.FILES_PATH+"/"+folder+'/**/*'];
    conditions.push('!minigames/**/dist');
    for (var i = 0; i < _FILES.CLONE_EXCEPTIONS.length; i++) {
        conditions.push("!"+_ROUTES.FILES_PATH+"/"+folder+"/"+_FILES.CLONE_EXCEPTIONS[i]);
        console.log("!"+_ROUTES.FILES_PATH+"/"+folder+"/"+_FILES.CLONE_EXCEPTIONS[i]);
    }
    return gulp.src(conditions)
    .pipe(rename(function(path){
        console.log(path);
    }))
    .pipe(gulp.dest(_ROUTES.FILES_PATH+"/"+folder+"/"+_ROUTES.DIST.HTML));
}

var isMinified = function(file){
    // console.log(file.path);
    var isMin = !file.path.includes('.min');
    // console.log(isMin);
    return true;
}

/**
* Junta todos los archivos js en un solo archivo
* ofuscado y minificado.
* @return {Buffer} [Node Buffer Object]
*/

var prepareJsToDist = function(folder, unique){
    folder = folder || "";
    unique = unique || false;
    var conditions = [_ROUTES.FILES_PATH+"/"+folder+"/"+'*.js'];
    for (var i = 0; i < _FILES.JS_EXCEPTIONS.length; i++) {
        conditions.push("!"+_ROUTES.FILES_PATH+"/"+folder+"/"+_FILES.JS_EXCEPTIONS[i]);
        console.log("!"+_ROUTES.FILES_PATH+"/"+folder+"/"+_FILES.JS_EXCEPTIONS[i]);
    }
    if (unique) {
        //ejecucion para todos los archivos
        console.log(_ROUTES.FILES_PATH+"/"+folder+"/"+'*.js');
        return gulp.src(conditions)
        .pipe(gulpif(isMinified, obfuscate(_OBFUSCATE_OPT)))
        .pipe(rename(function(path){
            path.extname=".min.js"
            console.log(path);
        }))
        .pipe(gulp.dest(function(file){return file.base;console.log(file.base);}));
    }
    else {
        //ejecucion para una lista de folders
        return gulp.src(_ROUTES.FILES_PATH+"/"+folder+"/"+'js/**/*.js')
        .pipe(gulpif(isMinified, obfuscate(_OBFUSCATE_OPT)))
        .pipe(concat(_ROUTES.MIN_JS.NAME+'.js'))
        .pipe(rename(_ROUTES.MIN_JS.NAME+'.'+_ROUTES.MIN_JS.SUFIX+'.js'))
        .pipe(gulp.dest(_ROUTES.FILES_PATH+"/"+folder+"/"+_ROUTES.DIST.JS));
    }
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
* Remplaza los scripts que estén referenciados en la carpeta js/
* y coloca un script con referencia al script de distribución.
* Remplaza los scripts que estén referenciados en la carpeta ../../share/
* y coloca una referencia al mismo script pero minificado.
* @return {Object}
*/

var replaceScripts = function(){
    //Carpeta JS
    var scripts = this.querySelectorAll('script[src^="../../shared"]'),
    i = scripts.length,
    tempNames = [];
    while(i--) {
        var src = scripts[i].getAttribute('src'),
        path = src.substring(0, src.lastIndexOf('/')+1);
        name = src.substring(src.lastIndexOf('/')+1, src.lastIndexOf('.js'));

        if (!src.includes('.min')) {console.log(name);
            removeNode(scripts[i]);
            var lib = this.createElement('script');
            lib.setAttribute('src', path+name+'.'+_ROUTES.MIN_JS.SUFIX+'.js');
            this.body.appendChild(lib);
        }
    }
    //Carpeta Shared
    var scripts = this.querySelectorAll('script[src^="js"]'),
    i = scripts.length;
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

var changeHtmlReference = function(folder){
    return gulp.src(_ROUTES.FILES_PATH+"/"+folder+"/"+'index.html')
    .pipe(dom(replaceScripts))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(_ROUTES.FILES_PATH+"/"+folder+"/"+_ROUTES.DIST.HTML));
}

/**
* Devuelve un arreglo con el nombre de las subcarpetas que
* le pasas como argumento .
* @param  {string} dir [Nombre de la carpeta padre]
* @return {Array}     [Arreglo con los nombres de las subcarpetas]
*/

var getFolders = function(dir){
    return fs.readdirSync(dir)
    .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}


//Gulp principal TASKS

gulp.task('cloneFiles', function () {
    var folders = getFolders(_ROUTES.FILES_PATH);
    var tasks = folders.map(function(folder) {
        cloneFiles(folder);
    });
})

gulp.task('prepareJsToDist', ['cloneFiles'], function () {
    var folders = getFolders(_ROUTES.FILES_PATH);
    var tasks = folders.map(function(folder) {
        prepareJsToDist(folder);
    });
})


/**
* Inicia la ejecución del script
*/

gulp.task('default', ['prepareJsToDist'], function () {
    var folders = getFolders(_ROUTES.FILES_PATH);
    var conditionsOneLevel = ['*/'];
    var tasks = folders.map(function(folder) {
        changeHtmlReference(folder);
    });
})
