
/**
 * Clase protoripo de Minigame.
 * Contiene los parámetros básicos que necesita un juego
 * para mostrarse
 * @param  {[Object]} config [Objeto con la configuración del minigame]
 */

APP.Minigame = function(config){

  this._config = config || {};
  /**
   * Nombre. Corresponde al nombre de la carpeta donde está
   * el minigame.
   * @type {[String]}
   */
  this._name = this._config.name || "";
  /**
   * Ruta completa hasta la carpeta del minigame.
   * e.g. /assets/minigames/
   * @type {[String]}
   */
  this._route = this._config.route || "";
  /**
   * String que contiene una cadena que es un query selector válido de CSS.
   * @type {[String]}
   */
  this._container = this._config.container || "";
  /**
   * Tag que funcionará como contenedor del minigame.
   * @type {[String]}
   */
  this._content = this._config.content || "iframe";
  /**
   * Ancho del content con respecto al container.
   * @type {[String]}
   */
  this._width = this._config.width || "100%";
  /**
   * Alto del content con respecto al container.
   * @type {[String]}
   */
  this._height = this._config.height || "100%";
  /**
   * Propiedad del content que se swicheará al cambiar de minigame.
   * @type {[String]}
   */
  this._propertyUrl = this._config.propertyUrl || "src";
  /**
   * String de validación. Si no es true, no se inicia el juego
   * @type {[Boolean]}
   */
  this._token = this._config.token || false;
  /**
   * Ruta completa del minigame.
   * @type {[String]}
   */
  this._src = this._config.route + this._config.name;
  /**
   * Función a ejecutar si no se puede iniciar el minigame.
   * @type {[Function]}
   */
  this._onError = this._config.error || null;
  /**
   * Función a ejecutar despues de iniciar el minigame.
   * @type {[Function]}
   */
  this._after = this._config.after || null;
  /**
   * Función a ejecutar antes de iniciar el minigame.
   * @type {[Function]}
   */
  this._before = this._config.before || null;

};

APP.Minigame.prototype = {
  deletePrevious : function(){
    var prevDOM = document.querySelector(this._content)
    if(prevDOM){
      prevDOM.remove();
    }
  },
  init : function(){
    if (this._token) {
      this._before ? this._before() : null;
      this.deletePrevious();
      var contentDOM = document.createElement(this._content),
      containerDOM = document.querySelector(this._container);
      contentDOM.width = this._width;
      contentDOM.height = this._height;
      contentDOM.setAttribute(this._propertyUrl, this._src);
      contentDOM.setAttribute("scrolling", "no");
      containerDOM.appendChild(contentDOM);
      this._after ? this._after() : null;
    }
    else{
      // alert('sesión no válida');
    }
  },
  showError: function(message){
    this.deletePrevious();
    var contentDOM = document.createElement(this._content),
    containerDOM = document.querySelector(this._container + " body");
    contentDOM.width = this._width;
    contentDOM.height = this._height;
    var fakeBody = document.createElement('p');
    fakeBody.innerHTML = message;
    contentDOM.appendChild(fakeBody);
    containerDOM.appendChild(contentDOM);
  }
}

APP.Minigame.prototype.constructor = APP.Minigame;
