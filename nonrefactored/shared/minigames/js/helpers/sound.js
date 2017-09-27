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

	function play(soundId){
		if(decodedSounds[soundId] !== "undefined"){
			decodedSounds[soundId].play()
		}else{
			console.warn("[Sound]"+"Not found Sound: "+soundId)
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
		stopAll:stopAll
	}

}()