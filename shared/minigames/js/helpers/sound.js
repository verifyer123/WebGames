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
			//game.load.audio(currentSoundData.name, currentSoundData.file,true)
			
			//var currentLoadedAudio = game.add.audio(currentSoundData.name)
			var currentLoadedAudio = new Audio(currentSoundData.file)
			decodedSounds[currentSoundData.name] = currentLoadedAudio
		}

		game.sound.setDecodedCallback(decodedSounds, function(){
			//console.log("audio ready")
		}, this)
	}

	function play(soundId, isLoop){
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