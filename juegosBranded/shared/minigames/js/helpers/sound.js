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

	function play(soundId, isLoop){
			
		if(decodedSounds[soundId] !== "undefined"){
			decodedSounds[soundId].play()
		}else{
			console.warn("[Sound]"+"Not found Sound: "+soundId)
		}
		
	}
	
	function setSong(path,volume){
		
		var song = new Audio(path)
		song.loop = true
		song.volume = volume
		song.play()
		return song
	}
	
	return {
		setSong: setSong,
		decode: decode,
		init: init,
		play: play,
	}

}()