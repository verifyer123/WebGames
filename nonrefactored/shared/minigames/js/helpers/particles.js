var epicparticles = function(){
  var game = null

  function init(gameObject){
    game = gameObject
  }

  function update(deltaTime){ // Called on every frame

  }

  function loadEmitter(loader, key){
    loader.image(key, "particles/battle/pickedEnergy/specialBar1.png")
  }

  function newEmitter(emitterName){
    var group = game.add.group()

    var sprite = game.add.sprite(0, 0, emitterName)
    sprite.anchor.setTo(0.5, 0.5)
    group.add(sprite)

    return group
  }

  return {
    loadEmitter: loadEmitter,
    newEmitter: newEmitter,
    update: update,
    init: init,
  }
}()