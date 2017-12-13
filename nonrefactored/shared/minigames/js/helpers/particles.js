var epicparticles = function(){
  var game = null
  var emitters = []
  var loaders = {}
  var datas = {}

  var kParticleTypeGravity = 1
  var kParticleTypeRadial = 2

  // Returns a random value between -1 and 1
  function randomSideFloat(){
    return Math.random() * 2 - 1
  }

  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }
  
  function newParticle(emitter){
    var sprite = game.add.sprite(0, 0, emitter.key)
    sprite.anchor.setTo(0.5, 0.5)
    emitter.add(sprite)

    return {
      sprite: sprite,
      position: {
        x: 0,
        y: 0
      },
      direction: {
        x: 0,
        y: 0
      },
      startPos: {
        x: 0,
        y: 0
      },
      color: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      },
      deltaColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
      },
      rotation: 0,
      rotationDelta: 0,
      radialAcceleration: 0,
      tangentialAcceleration: 0,
      radius: 0,
      radiusDelta: 0,
      angle: 0,
      degreesPerSecond: 0,
      particleSize: 0,
      particleSizeDelta: 0,
      timeToLive: 0
    }
  }

  function init(gameObject){
    game = gameObject
  }

  function initParticle(emitter, particle){
    // Init the position of the particle.  This is based on the source position of the particle emitter
    // plus a configured variance.  The RANDOM_MINUS_1_TO_1 macro allows the number to be both positive
    // and negative
    particle.position.x = emitter.sourcePosition.x + emitter.sourcePositionVariance.x * randomSideFloat()
    particle.position.y = emitter.sourcePosition.y + emitter.sourcePositionVariance.y * randomSideFloat()
    particle.startPos.x = emitter.sourcePosition.x
    particle.startPos.y = emitter.sourcePosition.y
    
    // Init the direction of the particle.  The newAngle is calculated using the angle passed in and the
    // angle variance.
    var newAngle = toRadians(emitter.angle + emitter.angleVariance * randomSideFloat());
    
    // Create a new GLKVector2 using the newAngle
    var vector = {
      x: Math.cos(emitter.newAngle), 
      y: Math.sin(emitter.newAngle)
    }
    
    // Calculate the vectorSpeed using the speed and speedVariance which has been passed in
    var vectorSpeed = emitter.speed + emitter.speedVariance * randomSideFloat();
    
    // The particles direction vector is calculated by taking the vector calculated above and
    // multiplying that by the speed
    particle.direction = {
      x: vector.x * vectorSpeed,
      y: vector.y * vectorSpeed
    }
    
    // Calculate the particles life span using the life span and variance passed in
    particle.timeToLive = Math.max(0, emitter.particleLifespan + emitter.particleLifespanVariance * randomSideFloat())
    
    // Set the default diameter of the particle from the source position
    particle.radius = emitter.maxRadius + emitter.maxRadiusVariance * randomSideFloat()
    particle.radiusDelta = emitter.maxRadius / particle.timeToLive
    particle.angle = toRadians(emitter.angle + emitter.angleVariance * randomSideFloat())
    particle.degreesPerSecond = toRadians(emitter.rotatePerSecond + emitter.rotatePerSecondVariance * randomSideFloat())
    
    particle.radialAcceleration = emitter.radialAcceleration + emitter.radialAccelVariance * randomSideFloat()
    particle.tangentialAcceleration = emitter.tangentialAcceleration + emitter.tangentialAccelVariance * randomSideFloat()
    
    // Calculate the particle size using the start and finish particle sizes
    var particleStartSize = emitter.startParticleSize + emitter.startParticleSizeVariance * randomSideFloat()
    var particleFinishSize = emitter.finishParticleSize + emitter.finishParticleSizeVariance * randomSideFloat()
    particle.particleSizeDelta = ((particleFinishSize - particleStartSize) / particle.timeToLive)
    particle.particleSize = Math.max(0, particleStartSize)
    
    // Calculate the color the particle should have when it starts its life.  All the elements
    // of the start color passed in along with the variance are used to calculate the star color
    var start = {
      r: 0, 
      g: 0, 
      b: 0, 
      a: 0
    }
    start.r = emitter.startColor.r + emitter.startColorVariance.r * randomSideFloat()
    start.g = emitter.startColor.g + emitter.startColorVariance.g * randomSideFloat()
    start.b = emitter.startColor.b + emitter.startColorVariance.b * randomSideFloat()
    start.a = emitter.startColor.a + emitter.startColorVariance.a * randomSideFloat()
    
    // Calculate the color the particle should be when its life is over.  This is done the same
    // way as the start color above
    var end = {
      r: 0, 
      g: 0, 
      b: 0, 
      a: 0
    }
    end.r = emitter.finishColor.r + emitter.finishColorVariance.r * randomSideFloat()
    end.g = emitter.finishColor.g + emitter.finishColorVariance.g * randomSideFloat()
    end.b = emitter.finishColor.b + emitter.finishColorVariance.b * randomSideFloat()
    end.a = emitter.finishColor.a + emitter.finishColorVariance.a * randomSideFloat()
    
    // Calculate the delta which is to be applied to the particles color during each cycle of its
    // life.  The delta calculation uses the life span of the particle to make sure that the
    // particles color will transition from the start to end color during its life time.  As the game
    // loop is using a fixed delta value we can calculate the delta color once saving cycles in the
    // update method
    
    particle.color = start
    particle.deltaColor.r = ((end.r - start.r) / particle.timeToLive)
    particle.deltaColor.g = ((end.g - start.g) / particle.timeToLive)
    particle.deltaColor.b = ((end.b - start.b) / particle.timeToLive)
    particle.deltaColor.a = ((end.a - start.a) / particle.timeToLive)
    
    // Calculate the rotation
    var startA = emitter.rotationStart + emitter.rotationStartVariance * randomSideFloat()
    var endA = emitter.rotationEnd + emitter.rotationEndVariance * randomSideFloat()
    particle.rotation = startA;
    particle.rotationDelta = (endA - startA) / particle.timeToLive
  }

  function addParticle(emitter){
    if (emitter.particleCount == emitter.maxParticles){
      return false
    }

    var particle = emitter.particles[emitter.particleCount]
    initParticle(emitter, particle)

    emitter.particleCount++

    return true
  }

  function stopParticleEmitter(emitter){
    emitter.active = false
    emitter.elapsedTime = 0
    emitter.emitCounter = 0
  }

  function updateParticleAtIndex(emitter, index, deltaTime){
    var particle = emitter.particles[index]
  
  }

  function removeParticleAtIndex(emitter, index){
    if (index != emitter.particleCount - 1) {
      emitter.paricles.splice(index, 1)
    }
    emitter.particleCount--
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

    emitter.key = key
    emitter.particles = []

    // Create particle pool
    for (i = 0; i < emitter.maxParticles; i++) { 
      emitter.particles[i] = newParticle(emitter)
    }

    return emitter
  }

  return {
    loadEmitter: loadEmitter,
    newEmitter: newEmitter,
    update: update,
    init: init,
  }
}()