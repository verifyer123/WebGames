var sound = function(){

	decodedSounds = {}
	game = null

	function init(gameContext){
		game = gameContext
	}

	function decode(soundStringArray){
		console.log("Decoding Sounds...")
		for(var indexSound = 0; indexSound < soundStringArray.length; indexSound++){
			var currentSoundData = soundStringArray[indexSound]
			var currentLoadedAudio = game.add.audio(currentSoundData.name)
			decodedSounds[currentSoundData.name] = currentLoadedAudio
		}

		game.sound.setDecodedCallback(decodedSounds, function(){}, this)
	}

	function play(soundId, params){
		params = params || {}
		var pitch = params.pitch || 1
		var loop = params.loop
		var volume = params.volume || 1

		if(typeof decodedSounds[soundId] !== "undefined"){
			if(!loop)
				decodedSounds[soundId].play()
			if(decodedSounds[soundId]._sound)
				decodedSounds[soundId]._sound.playbackRate.value = pitch
			if (loop){
				game.sound.setDecodedCallback(decodedSounds[soundId], function(){
					decodedSounds[soundId].loopFull(volume)
				}, this);
			}
			return decodedSounds[soundId]
		}else{
			console.warn("[Sound]"+"Not found Sound: "+soundId)
		}
	}

	function stop(soundId, isDestroy) {


		for(var key in decodedSounds){
			var sound = decodedSounds[soundId]
			if(sound){
				sound.stop()
			}
		}
	}

	function stopAll() {
		for(var key in decodedSounds){
			var sound = decodedSounds[key]
			if(sound)
				sound.stop()
		}
	}

	return {
		decode: decode,
		init: init,
		play: play,
		stopAll:stopAll,
		stop:stop
	}

}()