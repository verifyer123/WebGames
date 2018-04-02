_QUANTRIX.Minigame = function(config){

  this._config = config || {};

  this._name = this._config.name || "";

  this._route = this._config.route || "";

  this._container = this._config.container || "";

  this._content = this._config.content || "iframe";

  this._width = this._config.width || "100%";

  this._height = this._config.height || "100%";

  this._propertyUrl = this._config.propertyUrl || "src";

  this._token = this._config.token || false;

  this._src = this._config.route + this._config.name;

  this._after = this._config.after || null;

  this._before = this._config.before || null;

};

_QUANTRIX.Minigame.prototype = {
  init : function(){
    if (this._token) {
      this._before ? this._before() : null;
      var contentDOM = document.createElement(this._content),
      containerDOM = document.querySelector(this._container);
      contentDOM.width = this._width;
      contentDOM.height = this._height;
      contentDOM.setAttribute(this._propertyUrl, this._src);
      containerDOM.appendChild(contentDOM);
      this._after ? this._after() : null;
    }
  }
}

_QUANTRIX.Minigame.prototype.constructor = _QUANTRIX.Minigame;
