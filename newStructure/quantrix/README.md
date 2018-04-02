# Quantrix

## Uso

1. En la terminal, instala las dependencias de Node:

```

npm install

```

2. En la terminal, ejecuta el task principal de GULP.

```

gulp

```

Esto iniciará un servidor local y abrirá el index en tu navegador predeterminado.
Cada que hagas un cambio en los archivos html, css o js de la carpeta "src/assets" se actualizará tu navegador y se generarán los archivos de distribución del proyecto en la carpeta "dist/"

3. Para detener el servidor, colocate en la terminal y presiona ctrl+c

## Archivos de distribución

Puedes crear directamente los archivos de distribución sin iniciar el servidor. Usa:

```

gulp build

```

## Configuración

Para cambiar los formatos de archivo que refrescan el navegador, en el archivo gulpfile.js agrega o quita valores a la constante _QUANTRIX.FILE_WATCH

```

_QUANTRIX = {
  ...
  FILE_WATCH : [
    '.html',
    '.js',
    '.pug',
    '.png'
  ],
  ...
}

```

## Notas

1.Para poder correr el proyecto, primero debes tener instalado [Node y NPM](https://nodejs.org/en/download/)

2.Este proyecto fue creado con la versión 8.10.0 de Node. Para actualizar tu versión ejecuta:

```
npm install npm@latest -g

```
