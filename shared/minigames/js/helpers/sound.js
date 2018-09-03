var sound = function(){

	decodedSounds = {}
	game = null

	function init(gameContext){
		game = gameContext
	}

	function decode(soundStringArray){
		
		console.log("Decoding Sounds...")
		
		if(amazing.getMinigameId()){
			for(var indexSound = 0; indexSound < soundStringArray.length; indexSound++){

				var currentSoundData = soundStringArray[indexSound]
				
				var currentLoadedAudio = new Audio(currentSoundData.file)
				decodedSounds[currentSoundData.name] = currentLoadedAudio
			}

			game.sound.setDecodedCallback(decodedSounds, function(){
				//console.log("audio ready")
			}, this)
			
		}else{
			
			for(var indexSound = 0; indexSound < soundStringArray.length; indexSound++){
				var currentSoundData = soundStringArray[indexSound]
				var currentLoadedAudio = game.add.audio(currentSoundData.name)
				decodedSounds[currentSoundData.name] = currentLoadedAudio
			}

			game.sound.setDecodedCallback(decodedSounds, function(){}, this)
		}
		
	}

	function muteAudios(mute,soundStringArray){
		for(var indexSound = 0; indexSound < soundStringArray.length; indexSound++){
			var currentSoundData = soundStringArray[indexSound]
			//console.log(decodedSounds[currentSoundData.name])
			decodedSounds[currentSoundData.name].muted = mute
		}
	}

	function setVolumeAudios(volume,soundStringArray){
		for(var indexSound = 0; indexSound < soundStringArray.length; indexSound++){
			var currentSoundData = soundStringArray[indexSound]
			//console.log(decodedSounds[currentSoundData.name])
			decodedSounds[currentSoundData.name].volume = volume
		}
	}

	function play(soundId, isLoop){
		
		if(amazing.getMinigameId()){
			
			if(decodedSounds[soundId] !== "undefined"){
			
				var sound = decodedSounds[soundId]

				sound.loop = isLoop
				if(!sound.paused){
					sound.currentTime = 0
				}

				sound.play()

			}else{
				console.warn("[Sound]"+"Not found Sound: "+soundId)
			}
			
		}else{
			
			if(decodedSounds[soundId] !== "undefined"){
				decodedSounds[soundId].play()
			}else{
				console.warn("[Sound]"+"Not found Sound: "+soundId)
			}
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
		setVolumeAudios:setVolumeAudios,
		decode: decode,
		init: init,
		play: play,
		muteAudios:muteAudios
	}

}()