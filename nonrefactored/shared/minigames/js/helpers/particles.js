var epicparticles = function(){
  var game = null
  var emitters = []
  var loaders = {}
  var datas = {}

  function init(gameObject){
    game = gameObject
  }

  function addParticle(emitter){
    //console.log("addParticle")
  }

  function stopParticleEmitter(emitter){
    //console.log("stopParticleEmitter")
  }

  function updateParticleAtIndex(emitter, index, deltaTime){
    //console.log("updateParticleAtIndex")
  }

  function removeParticleAtIndex(emitter, index){
    //console.log("removeParticleAtIndex")
  }

  function update(){ // Called on every frame
    var deltaTime = game.time.elapsedMS * 0.0001

    var arrayLength = emitters.length
    for (var i = 0; i < arrayLength; i++) {
      var emitter = emitters[i]
      var key = emitter.key

      if (emitter.active == true && emitter.emissionRate > 0) {
        var rate = 1.0 / emitter.emissionRate
        
        if (emitter.particleCount < emitter.maxParticles) {
          emitter.emitCounter += deltaTime
        }
        
        while (emitter.particleCount < emitter.maxParticles && emitter.emitCounter > rate) {
          addParticle(emitter)
          emitter.emitCounter -= rate;
        }
        
        emitter.elapsedTime += deltaTime;
        
        if (emitter.duration != -1 && emitter.duration < emitter.elapsedTime) {
          stopParticleEmitter(emitter)
        }
      }

      var index = 0
    
      while (index < emitter.particleCount) {
        var currentParticle = emitter.particles[index]

        currentParticle.timeToLive -= deltaTime
        if (currentParticle.timeToLive > 0) {
          updateParticleAtIndex(emitter, index, deltaTime)
          index++;
        } else {
          removeParticleAtIndex(emitter, index)
        }
      }
    }
  }

  function loadEmitter(loader, key){
    var data = game.cache.getJSON(key)
    var jsonURL = game.cache.getItem(key, Phaser.Cache.JSON, null, "url")

    var index = jsonURL.lastIndexOf("/") + 1
    var relativeUrl = jsonURL.substr(0, index)

    var textureUrl = relativeUrl + data.textureFileName

    loader.image(key, textureUrl)
    loaders[key] = loaders[key] || loader
  }

  function newEmitter(key){
    var emitter = game.add.group()

    emitters.push(emitter)

    var sprite = game.add.sprite(0, 0, key)
    sprite.anchor.setTo(0.5, 0.5)
    emitter.add(sprite)

    emitter.key = key
    emitter.particles = []

    var data = game.cache.getJSON(key)

    emitter.emitterType = data.emitterType
    emitter.sourcePosition = data.sourcePosition
    emitter.sourcePositionVariance = data.sourcePositionVariance
    emitter.speed = data.speed
    emitter.speedVariance = data.speedVariance
    emitter.particleLifespan = data.particleLifespan
    emitter.particleLifespanVariance = data.particleLifespanVariance
    emitter.angle = data.angle
    emitter.angleVariance = data.angleVariance
    emitter.gravity = data.gravity
    emitter.radialAcceleration = data.radialAcceleration
    emitter.tangentialAcceleration = data.tangentialAcceleration
    emitter.tangentialAccelVariance = data.tangentialAccelVariance
    emitter.startColor = data.startColor
    emitter.startColorVariance = data.startColorVariance
    emitter.finishColor = data.finishColor
    emitter.finishColorVariance = data.finishColorVariance
    emitter.maxParticles = data.maxParticles
    emitter.startParticleSize = data.startParticleSize
    emitter.startParticleSizeVariance = data.startParticleSizeVariance
    emitter.finishParticleSize = data.finishParticleSize
    emitter.finishParticleSizeVariance = data.finishParticleSizeVariance
    emitter.duration = data.duration
    emitter.blendFuncSource = data.blendFuncSource
    emitter.blendFuncDestination = data.blendFuncDestination
    
    // These paramters are used when you want to have the particles spinning around the source location
    emitter.maxRadius = data.maxRadius
    emitter.maxRadiusVariance = data.maxRadiusVariance
    emitter.minRadius = data.minRadius
    emitter.rotatePerSecond = data.rotatePerSecond
    emitter.rotatePerSecondVariance = data.rotatePerSecondVariance
    emitter.rotationStart = data.rotationStart
    emitter.rotationStartVariance = data.rotationStartVariance
    emitter.rotationEnd = data.rotationEnd
    emitter.rotationEndVariance = data.rotationEndVariance
    
    // Calculate the emission rate
    emitter.emissionRate = emitter.maxParticles / emitter.particleLifespan
    emitter.emitCounter = 0

    emitter.active = true
    emitter.particleCount = 0
    emitter.elapsedTime = 0

    return emitter
  }

  return {
    loadEmitter: loadEmitter,
    newEmitter: newEmitter,
    update: update,
    init: init,
  }
}()