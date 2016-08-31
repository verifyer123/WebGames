var creatPianoTiles = function(){

	var REACTION_ANIMATIONS = {
    	correct: {
			eye: "eyesright",
			bird: "birdright"
		},
		wrong: {
			eye: "eyeswrong",
			bird: "birdwrong"
		},
		neutral: {
			eye: "eyesopen",
			bird: "birdneut"
		}
    }

	assets = {
		images: [
			{	name: "background",
				file: "images/bg.png"},
			{	name: "body",
				file: "images/shark.png"},
			{	name: "note",
				file: "images/notes.png"},
			{	name: "toothnote",
				file: "images/toothnote.png"},
			{	name: "toothsilent",
				file: "images/toothsilent.png"},
			{	name: "toothwrong",
				file: "images/toothwrong.png"},
			{	name: "fin",
				file: "images/aleta.png"},
			{	name: REACTION_ANIMATIONS.correct.eye,
				file: 'images/'+REACTION_ANIMATIONS.correct.eye+'.png'},
			{	name: REACTION_ANIMATIONS.wrong.eye,
				file: 'images/'+REACTION_ANIMATIONS.wrong.eye+'.png'},
			{	name: REACTION_ANIMATIONS.neutral.eye,
				file: 'images/'+REACTION_ANIMATIONS.neutral.eye+'.png'},
			{	name: REACTION_ANIMATIONS.correct.bird,
				file: 'images/'+REACTION_ANIMATIONS.correct.bird+'.png'},
			{	name: REACTION_ANIMATIONS.wrong.bird,
				file: 'images/'+REACTION_ANIMATIONS.wrong.bird+'.png'},
			{	name: REACTION_ANIMATIONS.neutral.bird,
				file: 'images/'+REACTION_ANIMATIONS.neutral.bird+'.png'},
		],
		sounds: [
			{	name: "grunt",
				file: "sounds/grunt.mp3"},
			{	name: "C3",
				file: "sounds/Piano.ff.C3.mp3"},
			{	name: "Db3",
				file: "sounds/Piano.ff.Db3.mp3",},
			{	name: "D3",
				file: "sounds/Piano.ff.D3.mp3",},
			{	name: "Eb3",
				file: "sounds/Piano.ff.Eb3.mp3",},
			{	name: "E3",
				file: "sounds/Piano.ff.E3.mp3",},
			{	name: "F3",
				file: "sounds/Piano.ff.F3.mp3"},
			{	name: "Gb3",
				file: "sounds/Piano.ff.Gb3.mp3"},
			{	name: "G3",
				file: "sounds/Piano.ff.G3.mp3"},
			{	name: "Ab3",
				file: "sounds/Piano.ff.Ab3.mp3"},
			{	name: "A3",
				file: "sounds/Piano.ff.A3.mp3"},
			{	name: "Bb3",
				file: "sounds/Piano.ff.Bb3.mp3"},
			{	name: "B3",
				file: "sounds/Piano.ff.B3.mp3"},
			{	name: "C4",
				file: "sounds/Piano.ff.C4.mp3"},
			{	name: "Db4",
				file: "sounds/Piano.ff.Db4.mp3"},
			{	name: "D4",
				file: "sounds/Piano.ff.D4.mp3"},
			{	name: "Eb4",
				file: "sounds/Piano.ff.Eb4.mp3"},
			{	name: "E4",
				file: "sounds/Piano.ff.E4.mp3"},
			{	name: "F4",
				file: "sounds/Piano.ff.F4.mp3"},
			{	name: "Gb4",
				file: "sounds/Piano.ff.Gb4.mp3"},
			{	name: "G4",
				file: "sounds/Piano.ff.G4.mp3"},
			{	name: "Ab4",
				file: "sounds/Piano.ff.Ab4.mp3"},
			{	name: "A4",
				file: "sounds/Piano.ff.A4.mp3"},
			{	name: "Bb4",
				file: "sounds/Piano.ff.Bb4.mp3"},
			{	name: "B4",
				file: "sounds/Piano.ff.B4.mp3"},
			{	name: "C5",
				file: "sounds/Piano.ff.C5.mp3"},
			{	name: "Db5",
				file: "sounds/Piano.ff.Db5.mp3"},
			{	name: "D5",
				file: "sounds/Piano.ff.D5.mp3"},
			{	name: "Eb5",
				file: "sounds/Piano.ff.Eb5.mp3"},
			{	name: "E5",
				file: "sounds/Piano.ff.E5.mp3"},
			{	name: "F5",
				file: "sounds/Piano.ff.F5.mp3"},
			{	name: "Gb5",
				file: "sounds/Piano.ff.Gb5.mp3"},
			{	name: "G5",
				file: "sounds/Piano.ff.G5.mp3"},
			{	name: "Ab5",
				file: "sounds/Piano.ff.Ab5.mp3"},
			{	name: "A5",
				file: "sounds/Piano.ff.A5.mp3"},
			{	name: "Bb5",
				file: "sounds/Piano.ff.Bb5.mp3"},
			{	name: "B5",
				file: "sounds/Piano.ff.B5.mp3"},
			{	name: "C6",
				file: "sounds/Piano.ff.C6.mp3"},
		],
	}

	var TITLES = [
    	"Mendelssohn - Spring Song",
		"Bach - Minuet in G major",
		"Public Domain - Twinkle, Twinkle, Little Star",
		"Edvard Grieg - In the Hall of the Mountain King",
		"Beethoven - Für Elise",
		"Mozart - Rondo Alla Turca",
    ]

    var SONGS = [
		[
	        "Db5", "D5", "Eb5", "E5","A5","E5","D5","Db5","B4","D5","Gb5","D5","B4",
			"Bb4","B4","C5","Db5","E5","D5","Db5","B4","A4","Ab4","A4","Db5","B4"
		],
		[
			"D5","G4","A4","B4","C5","D5","G4",
			"G4","E5","C5","D5","E5","Gb5","G5","G4",
			"G4","C5","D5","C5","B4","A4","B4","C5",
			"B4","A4","G4","Gb4","G4","A4","B4","G4","B4","A4"
		],
		[
			"E4", "E4", "B4", "B4", "Db5", "Db5", "B4", 
			"A4", "A4", "Ab4", "Ab4", "Gb4", "Gb4", "E4", 
			"B4", "B4", "A4", "A4", "Ab4", "Ab4", "Gb4",
			"B4", "B4", "A4", "A4", "Ab4", "Ab4", "Gb4",
			"E4", "E4", "B4", "B4", "Db5", "Db5", "B4",
			"A4", "A4", "Ab4", "Ab4", "Gb4", "Gb4", "E4"
		],
		[
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"Ab3", "E3", "Ab3", "G3", "Eb3", "G3",
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"D4", "C4", "A3", "F3", "A3", "C4",
			
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"Ab3", "E3", "Ab3", "G3", "Eb3", "G3",
			"D3", "E3", "F3", "G3", "A3", "F3", "A3",
			"D4", "C4", "A3", "F3", "A3", "C4",
		],
		[
			"E5", "Eb5", "E5", "Eb5", "E5", "B4", "D5",
			"C5", "A4", "C4", "E4", "A4", "B4", "E4",
			"G4", "B4", "C5", "E5", "Eb5", "E5", "Eb5",
			"E5", "B4", "D5", "C5", "A4", "C4", "E4",
			"A4", "B4", "E4", "C5", "B4", "A4",
			"E5", "Eb5", "E5", "Eb5", "E5", "B4", "D5",
			"C5", "A4", "C4", "E4", "A4", "B4", "E4",
			"G4", "B4", "C5", "E5", "Eb5", "E5", "Eb5",
			"E5", "B4", "D5", "C5", "A4", "C4", "E4",
			"A4", "B4", "E4", "C5", "B4", "A4",
		],
		[
			"B4", "A4", "Ab4", "A4", "C5",
			"D5", "C5", "B4", "C5", "E5",
			"F5", "E5", "Eb5", "E5",
			"B5", "A5", "Ab5", "A5", "B5", 
			"A5", "Ab5", "A5", "C6",
			"A5", "C6", "B5", "A5", "G5",
			"A5" , "B5", "A5", "G5", "A5", 
			"B5", "A5", "G5", "Gb5", "E5",
			"B4", "A4", "Ab4", "A4", "C5",
			"D5", "C5", "B4", "C5", "E5",
			"F5", "E5", "Eb5", "E5",
			"B5", "A5", "Ab5", "A5", "B5", 
			"A5", "Ab5", "A5", "C6",
			"A5", "C6", "B5", "A5", "G5",
			"A5" , "B5", "A5", "G5", "A5", 
			"B5", "A5", "G5", "Gb5", "E5",
		]
	]

	var NUMBER_TILES = 4
	var NUMBER_ROWS = 3

	var sceneGroup = null
	var groupNotes = null
	var randomSong = null
	var teethRows = []
	var decodedSounds = null
	var currentNote = null
	var finGroup = null
	var creatureBody = null

	function createBird(){
		var birdGroup = new Phaser.Group(sceneGroup.game)

		var x = creatureBody.x + (creatureBody.width * 0.39)
		var y = creatureBody.y - creatureBody.height * 0.7

		birdGroup.x = x
		birdGroup.y = y

		var birdneutral = birdGroup.create(0, 0, REACTION_ANIMATIONS.neutral.bird)
		birdneutral.renderable = false
        birdneutral.anchor.setTo(0.5, 0.5)

        var birdright = birdGroup.create(0, 0, REACTION_ANIMATIONS.correct.bird)
        birdright.renderable = false
        birdright.anchor.setTo(0.5, 0.5)

        var birdwrong = birdGroup.create(0, 0, REACTION_ANIMATIONS.wrong.bird)
        birdwrong.renderable = false
        birdwrong.anchor.setTo(0.5, 0.5)

        birdGroup.neutral = birdneutral
        birdGroup.correct = birdright
        birdGroup.wrong = birdwrong

		return birdGroup
	}

	function createEyes(){
		var eyesGroup = new Phaser.Group(sceneGroup.game)

		var x = creatureBody.x
		var y = creatureBody.y - (creatureBody.height * 0.7)

		var eyesopen = eyesGroup.create(x, y, REACTION_ANIMATIONS.neutral.eye)
		eyesopen.renderable = false
		eyesopen.anchor.setTo(0.5, 0.5)

		var eyesright = eyesGroup.create(x, y, REACTION_ANIMATIONS.correct.eye)
		eyesright.renderable = false
		eyesright.anchor.setTo(0.5, 0.5)

		var eyeswrong = eyesGroup.create(x, y, REACTION_ANIMATIONS.wrong.eye)
		eyeswrong.renderable = false
		eyeswrong.anchor.setTo(0.5, 0.5)

		eyesGroup.neutral = eyesopen
		eyesGroup.correct = eyesright
		eyesGroup.wrong = eyeswrong

		return eyesGroup
	}

	function createFins(){
		finGroup = new Phaser.Group(sceneGroup.game)

		for(var finIndex = 0; finIndex < 2; finIndex++){
			var finRotation = 0
			var finImage = finGroup.create(0, 0, 'fin')
			if(finIndex <= 0){
				finRotation = 0.1
				finImage.x = creatureBody.x - (creatureBody.width * 0.38)
				finImage.y = creatureBody.y - (creatureBody.height * 0.22)
				finImage.anchor.setTo(1, 0)
			}else{
				finRotation = -0.1
				finImage.scale.setTo(-finImage.scale.x, 1)
				finImage.x = creatureBody.x + (creatureBody.width * 0.38)
				finImage.y = creatureBody.y - (creatureBody.height * 0.22)
				finImage.anchor.setTo(1, 0)
			}

			var movementA = sceneGroup.game.add.tween(finImage).to({rotation: finRotation}, 500, "Quad.easeInOut", true, 0, -1)
			movementA.yoyo(true, 100)
		}
	}

	function setCharacterReaction(reaction){
		reaction = reaction || "neutral"

		for(key in REACTION_ANIMATIONS){
			creatureBody.eyes[key].renderable = false
			creatureBody.bird[key].renderable = false
		}

		if(creatureBody.eyes[reaction] != "undefined"){
			creatureBody.eyes[reaction].renderable = true
			creatureBody.bird[reaction].renderable = true
		}
	}

	function onTapTooth(target){
		var game = sceneGroup.game
		if(target.correct){
			if(currentNote >= randomSong.length){
				currentNote = 0
			}

			setCharacterReaction("correct")
			game.time.events.remove()
			game.time.events.add(Phaser.Timer.SECOND, function(){setCharacterReaction("neutral")}, this)
			//decodedSounds[randomSong[currentNote]].play()
			sound.play(randomSong[currentNote])
			currentNote++;

			creatureBody.bird.note.alpha = 0
			creatureBody.bird.note.y = creatureBody.bird.y
			var tweenNote = game.add.tween(creatureBody.bird.note).to({alpha: 1, y: creatureBody.bird.note.y - 50}, 100, "Linear")
			var tweenNote2 = game.add.tween(creatureBody.bird.note).to({alpha: 0}, 100, "Linear")

			tweenNote.chain(tweenNote2)
			tweenNote.start()

			var newRow = createTileRow()
			newRow.x = groupNotes.mask.x
			newRow.y = groupNotes.mask.y - ((newRow.height))
			groupNotes.add(newRow)

			teethRows.push(newRow)

			for(var indexRow = 0; indexRow < teethRows.length; indexRow++){
				var targetTween = teethRows[indexRow]
				var tween = game.add.tween(targetTween).to({y: targetTween.y + targetTween.height}, 100, "Sine.easeOut", false)
				tween.start()

				//notesGroup.remove(teethRows[1])
			}
		}else{
			setCharacterReaction("wrong")
			game.time.events.add(Phaser.Timer.SECOND, function(){setCharacterReaction("neutral")}, this)
			target.renderable = false
			target.wrong.renderable = true
			sound.play("grunt")
		}
	}

	function createTileRow(){
		var tileGroup = new Phaser.Group(sceneGroup.game)
		tileGroup.teeth = {}

		var blackTileIndex = Math.floor(Math.random() * NUMBER_TILES)

		var offsetX = 0
		for(var tileIndex = 0; tileIndex < NUMBER_TILES; tileIndex++){

			var toothGroup = new Phaser.Group(sceneGroup.game)
			tileGroup.add(toothGroup)

			toothGroup.x = offsetX

			var normalTooth
			if(tileIndex == blackTileIndex){
				normalTooth = toothGroup.create(0, 0, "toothnote")
				normalTooth.correct = true
			}
			else{
				normalTooth = toothGroup.create(0, 0, "toothsilent")
				var wrongTooth = toothGroup.create(0, 0, "toothwrong")
				wrongTooth.renderable = false
				normalTooth.wrong = wrongTooth
			}

			normalTooth.inputEnabled = true
			normalTooth.events.onInputDown.add(onTapTooth)
			offsetX = normalTooth.width * (tileIndex + 1)
		}

		return tileGroup
	}

	function drawRows(){

		var rowOffsetY = 0
		for(var indexRow = 0; indexRow < NUMBER_ROWS; indexRow++){
			var tileRow = createTileRow()
			tileRow.x = groupNotes.container.x
			tileRow.y = ((groupNotes.container.y + groupNotes.container.height) - tileRow.height) - rowOffsetY
			groupNotes.add(tileRow)

			teethRows.push(tileRow)
			rowOffsetY = tileRow.height * (indexRow + 1)
		}
	}

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){
		var randomSongId = Math.random()
		randomSongId = Math.floor(randomSongId * SONGS.length)
		
		randomSong = SONGS[randomSongId]
		setCharacterReaction("neutral")

		creatureBody.bird.note.alpha = 0
		currentNote = 0
	}


	return {
		assets: assets,
		name: "creatPianoTiles",
		create: function(event){
			sceneGroup = event.group
			var game = sceneGroup.game

			var background = sceneGroup.create(game.world.centerX, game.world.centerY, 'background');
	        background.anchor.setTo(0.5, 0.5);

	        creatureBody = sceneGroup.create(0, 0, 'body');
	        creatureBody.anchor.setTo(0.5, 1);
	        creatureBody.x = game.world.centerX;
	        creatureBody.y = game.height

	        createFins()

	        var eyes = createEyes()
	        creatureBody.eyes = eyes

	        var bird = createBird()
	        creatureBody.bird = bird

	        var note = sceneGroup.create(0, 0, 'note')
	        note.anchor.setTo(0.5, 0.5)
	        note.x = bird.x
	        note.y = bird.y

	        creatureBody.bird.note = note

	        groupNotes = new Phaser.Group(sceneGroup.game)

	        var maskWidth = creatureBody.width * 0.57 
	        var maskHeight = creatureBody.height * 0.53
	        var maskPositionX = game.world.centerX + (maskWidth * -0.48)
	        var maskPositionY = game.world.centerY + (maskHeight * -0.18)

	        groupNotes.container = {
	        	width: maskWidth,
	        	height: maskHeight,
	        	x: maskPositionX,
	        	y: maskPositionY
	        }


	        var mask = game.add.graphics(0, 0)
	        mask.x = maskPositionX
	        mask.y = maskPositionY
	        mask.beginFill(0x000000)
	        var rect = mask.drawRect(0, 0, maskWidth, maskHeight)
	        mask.endFill()

	        groupNotes.mask = mask
		},
		show: function(event){
			loadSounds()
			initialize()
			drawRows()
		}
	}
}()