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
        atlases: [
            {   
                name: "atlas.pianotiles",
                json: "images/pianotiles/atlas.json",
                image: "images/pianotiles/atlas.png",
            }
        ],
		images: [
            {	name: "pzpentagrama",
				file: "images/pianotiles/pzpentagrama.png"},
            {	name: "pentagrama",
				file: "images/pianotiles/pentagrama.png"},
            {	name: "note1",
				file: "images/pianotiles/note1.png"},
            {	name: "note2",
				file: "images/pianotiles/note2.png"},
            {	name: "note3",
				file: "images/pianotiles/note3.png"},
            {	name: "note4",
				file: "images/pianotiles/note4.png"},
            {	name: "timer",
				file: "images/pianotiles/timer.png"},
            {	name: "mouthshade",
				file: "images/pianotiles/mouthshade.png"},
            {	name: "gamebar",
				file: "images/pianotiles/bottom.png"},
            {	name: "heartsBack",
				file: "images/pianotiles/heartscontainer.png"},
            {	name: "heartsEmpty",
				file: "images/pianotiles/heartsempty.png"},
            {	name: "heartsfull",
				file: "images/pianotiles/heartsfull.png"},
            {	name: "button1",
				file: "images/pianotiles/button1.png"},
            {	name: "button2",
				file: "images/pianotiles/button2.png"},
            {	name: "button3",
				file: "images/pianotiles/button3.png"},
            {	name: "button4",
				file: "images/pianotiles/button4.png"},
            {	name: "button5",
				file: "images/pianotiles/button5.png"},
            {   name:"background",
				file: "images/pianotiles/background.png"},
			{	name: "body",
				file: "images/pianotiles/body.png"},
			{	name: "note",
				file: "images/pianotiles/note.png"},
			{	name: "toothnote",
				file: "images/pianotiles/toothnote.png"},
			{	name: "toothsilent",
				file: "images/pianotiles/toothsilent.png"},
			{	name: "toothwrong",
				file: "images/pianotiles/toothwrong.png"},
			{	name: "fin",
				file: "images/aleta.png"},
			{	name: REACTION_ANIMATIONS.correct.eye,
				file: 'images/pianoTiles/'+REACTION_ANIMATIONS.correct.eye+'.png'},
			{	name: REACTION_ANIMATIONS.wrong.eye,
				file: 'images/pianoTiles/'+REACTION_ANIMATIONS.wrong.eye+'.png'},
			{	name: REACTION_ANIMATIONS.neutral.eye,
				file: 'images/pianoTiles/'+REACTION_ANIMATIONS.neutral.eye+'.png'},
			{	name: REACTION_ANIMATIONS.correct.bird,
				file: 'images/pianoTiles/'+REACTION_ANIMATIONS.correct.bird+'.png'},
			{	name: REACTION_ANIMATIONS.wrong.bird,
				file: 'images/pianoTiles/'+REACTION_ANIMATIONS.wrong.bird+'.png'},
			{	name: REACTION_ANIMATIONS.neutral.bird,
				file: 'images/pianoTiles/'+REACTION_ANIMATIONS.neutral.bird+'.png'},
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

	var NUMBER_TILES = 4
	var NUMBER_ROWS = 3
    var NOTE_SCALE = 0.84

	var sceneGroup = null
	var groupNotes = null
	var randomSong = null
	var teethRows = []
	var decodedSounds = null
	var currentNote = null
	var finGroup = null
	var creatureBody = null
    var indexPiece = null
    var indexDelete = null
    var indexUse = null
    var indexButton = null
    var teethsArray = []
    var buttonReady = null
    var btnList = []
    var heartsGroup = null
    var wrongIndex = 0
    var gameActive = true
    var mouthShade = null
    var timerImage = null
    var timer = null
    var monsterGroup = null
    var buttonsGroup = null
    var pentagramImage = null
    var notesGroup = null

	function createBird(){
        
		var birdGroup = sceneGroup.game.add.group()
        monsterGroup.add(birdGroup)

		var x = creatureBody.x + (creatureBody.width * 0.323)
		var y = creatureBody.y - creatureBody.height * 0.74

		birdGroup.x = x
		birdGroup.y = y

		var birdneutral = birdGroup.create(0, 0,'atlas.pianotiles', REACTION_ANIMATIONS.neutral.bird)
		birdneutral.renderable = false
        birdneutral.anchor.setTo(0.5, 0.5)

        var birdright = birdGroup.create(0, 0, 'atlas.pianotiles',REACTION_ANIMATIONS.correct.bird)
        birdright.renderable = false
        birdright.anchor.setTo(0.5, 0.5)

        var birdwrong = birdGroup.create(0, 0,'atlas.pianotiles', REACTION_ANIMATIONS.wrong.bird)
        birdwrong.renderable = false
        birdwrong.anchor.setTo(0.5, 0.5)

        birdGroup.neutral = birdneutral
        birdGroup.correct = birdright
        birdGroup.wrong = birdwrong

		return birdGroup
	}

	function createEyes(){
        
		//var eyesGroup = new Phaser.Group(sceneGroup.game)
        
        var eyesGroup = sceneGroup.game.add.group()
        monsterGroup.add(eyesGroup)

		var x = creatureBody.x
		var y = creatureBody.y - (creatureBody.height * 0.82)

		var eyesopen = eyesGroup.create(x, y,'atlas.pianotiles', REACTION_ANIMATIONS.neutral.eye)
		eyesopen.renderable = false
		eyesopen.anchor.setTo(0.5, 0.5)

		var eyesright = eyesGroup.create(x, y,'atlas.pianotiles', REACTION_ANIMATIONS.correct.eye)
		eyesright.renderable = false
		eyesright.anchor.setTo(0.5, 0.5)

		var eyeswrong = eyesGroup.create(x, y, 'atlas.pianotiles',REACTION_ANIMATIONS.wrong.eye)
		eyeswrong.renderable = false
		eyeswrong.anchor.setTo(0.5, 0.5)

		eyesGroup.neutral = eyesopen
		eyesGroup.correct = eyesright
		eyesGroup.wrong = eyeswrong

		return eyesGroup
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
    
    function showOk(target) {
        
        if(currentNote >= randomSong.length){
            currentNote = 0
            gameActive = false
            timer.pause()
        }
        
        indexUse+=4
            
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
        newRow.x = groupNotes.container.x
        newRow.alpha = 0
        newRow.y = groupNotes.children[groupNotes.length - 1].y - newRow.height
        groupNotes.add(newRow)

        teethRows.push(newRow)
        
        for(var i = 0; i < notesGroup.notesList.length; i++) {
            var target = notesGroup.notesList[i]
            game.add.tween(target).to({x: target.x - 50}, 100, "Sine.easeOut", true)
            if (target.x < 75){
                game.add.tween(target).to({alpha: 0}, 100, "Linear", true)
            }
        }

        for(var indexRow = 0; indexRow < teethRows.length; indexRow++){
            
            var targetTween = teethRows[indexRow]
            //console.log(targetTween.height + ' altura fila')
            var tween = game.add.tween(targetTween).to({y: targetTween.y + 144.48}, 100, "Sine.easeOut", false)
            if(indexRow >= indexDelete) {
                game.add.tween(targetTween).to({alpha : 1}, 20, Phaser.Easing.Linear.None, true, 80);
            }
            tween.start()

            if (indexRow < indexDelete) {
                targetTween.alpha = 0
                var obj = targetTween
                setTimeout(function() {
                    obj.destroy()
                },105)

            }
        }
        indexDelete++;
    }
    
    function showWrong(target){
        
        heartsGroup.heartsList[wrongIndex].children[1].alpha = 1
        
        wrongIndex++;
        
        setCharacterReaction("wrong")
        game.time.events.add(Phaser.Timer.SECOND, function(){setCharacterReaction("neutral")}, this)
        target.renderable = false
        target.wrong.renderable = true
        sound.play("grunt")
        
        if (wrongIndex == 3) {
            timer.pause()
            gameActive = false
        }
        
    }
	function onTapTooth(target){
        
        if (target.exists == false || gameActive == false) {
            return
        }
        
        //console.log(target.index + ' indexPiece ' + indexUse + ' indexUse')
        if (Math.abs(target.index - indexUse) > 3 || target.index < indexUse){
            return
        }
		var game = sceneGroup.game
		if(target.correct){
            
            showOk(target)
            
		}else{
			showWrong(target)
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
                normalTooth.scale.setTo(NOTE_SCALE,NOTE_SCALE)
				normalTooth.correct = true
			}
			else{
				normalTooth = toothGroup.create(0, 0, "toothsilent")
                normalTooth.scale.setTo(NOTE_SCALE,NOTE_SCALE)
				var wrongTooth = toothGroup.create(0, 0, "toothwrong")
                wrongTooth.scale.setTo(NOTE_SCALE,NOTE_SCALE)
				wrongTooth.renderable = false
				normalTooth.wrong = wrongTooth
			}
            
            normalTooth.index = indexPiece
            indexPiece++;
			normalTooth.inputEnabled = true
			normalTooth.events.onInputDown.add(onTapTooth)
			offsetX = normalTooth.width * (tileIndex + 1)
            teethsArray[teethsArray.length] = normalTooth
		}
        
        //console.log(indexPiece + ' index')
        
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
    
    function onTapButton(sprite) {
        
        if (buttonReady == false || gameActive == false) {
            return
        }
        
        sprite.parent.children[1].alpha = 1
        
        buttonReady = false
        setTimeout(function(){ buttonReady = true},101)
        
        var target = teethsArray[indexUse + sprite.index]
        //console.log( teethsArray[indexUse + sprite.index].index + ' number index, ' + (sprite.index - indexUse) + ' object index')
        if (target.correct == true) {
            showOk(target)
        }else{
            showWrong(target)
        }
    }
    
    function pressButton(target){
        if (buttonReady == false || gameActive == false) {
            return
        }
        
        
        buttonReady = false
        setTimeout(function(){ buttonReady = true},101)
        
		var targetId = target.keyCode - Phaser.Keyboard.ONE
		//console.log(targetId + ' boton press')
        
        btnList[targetId].children[1].alpha = 1
        
        var target = teethsArray[indexUse + targetId]
         if (target.correct == true) {
            showOk(target)
        }else{
            showWrong(target)
        }
	}
    
    function onReleaseButton(sprite) {
        
        sprite.parent.children[1].alpha = 0
    }
    
    function releaseButton(btn) {
        
        var targetId = btn.keyCode - Phaser.Keyboard.ONE
		//console.log(targetId + ' boton press')
        
        btnList[targetId].children[1].alpha = 0
        
    }
    
    function createTimer() {
        
        var game = sceneGroup.game
        
        timerImage = new Phaser.Group(sceneGroup.game)
        timerImage.scale.setTo(0.75,0.75)
        buttonsGroup.add(timerImage)
        
        var timerImg = timerImage.create(10,10,'timer')
        
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#000000", align: "center"}
        var timerText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        timerText.x = timerImg.width * 0.55
        timerText.y = timerImg.height * 0.32
        timerImage.add(timerText)
        
        timerImage.textI = timerText
        timerImage.number = 0
        
    }
    
    function createHearts(){
        
        var game = sceneGroup.game
        
        heartsGroup = new Phaser.Group(sceneGroup.game)
        heartsGroup.scale.setTo(0.65,0.65)
        buttonsGroup.add(heartsGroup)
        
        var heartsList = []
        
        var backHearts = heartsGroup.create(0,0,'atlas.pianotiles','heartsback')
        //backHearts.anchor.setTo(1,1)
        heartsGroup.x = game.world.width - backHearts.width * 0.68
        heartsGroup.y = 5
        
        var pivotX = 17
        
        for (var i = 0;i < 3; i++) {
            
            var heartGroup = game.add.group()
            heartGroup.x = pivotX
            heartGroup.y = 12
            
            heartsGroup.add(heartGroup)
            
            var img2 = heartGroup.create(0,0,'atlas.pianotiles','heartsfull')
            
            var img1 = heartGroup.create(0,0,'atlas.pianotiles','heartsempty')
            img1.alpha = 0
            
            pivotX += 75
            
            heartsList[heartsList.length] = heartGroup
            
        }
        heartsGroup.heartsList = heartsList
    }
    
    function createAnswerGroup(){
        
        var game = sceneGroup.game
		var answerGroup = game.add.group()
        
        
        var keyIndex = Phaser.Keyboard.ONE
        var pivotX = -game.world.width * 0.35
        var offsetX = Math.abs(pivotX) * 0.5
        var scaleToUse = game.world.width / 640
        for (var i = 0; i < 4; i++){
            var button = game.add.group()
            button.x = pivotX
            button.y = 0
            button.scale.setTo(scaleToUse, scaleToUse)
            pivotX+= offsetX
            
            var img1 = button.create(0, 0,'atlas.pianotiles','button1')
            img1.index = i
            button.add(img1)
            
            var img2 = button.create(0, 0,'atlas.pianotiles','button' + (i + 2))
            img2.alpha = 0
            button.add(img2)
            
            img1.inputEnabled = true
            img1.events.onInputDown.add(onTapButton)
            
            img1.events.onInputUp.add(onReleaseButton)
            
            var key = game.input.keyboard.addKey(keyIndex + i)
			key.onDown.add(pressButton, this)
            key.onUp.add(releaseButton, this)
            
            answerGroup.add(button)
            btnList[btnList.length] = button
            
        }
        
		return answerGroup
	}
    
    function createNotes(img){
        
        var notesList = []
        var pivotX = 50
        for (var i = 0; i < randomSong.length; i++) {
            
            var randomImage = Math.floor(Math.random() * 4) + 1  
            var note = notesGroup.create(pivotX,img.y - 10 + (Math.floor(Math.random() * 6) + 1) * 8,'atlas.pianotiles','note' + randomImage)
            note.scale.setTo(img.scale.x,img.scale.y)
            
            notesList[notesList.length] = note
            
            pivotX+= 50
        }
        notesGroup.notesList = notesList
    }
    
    function createPentagramBar(obj) {
        
        var pivotX = obj.x + obj.width
        var pivotY = obj.y
        for(var i = 0; i < 20; i++){
            
            var piecePent = buttonsGroup.create(pivotX, pivotY,'atlas.pianotiles','pzpentagrama')
            piecePent.scale.setTo(obj.scale.x, obj.scale.y)
            
            pivotX+= piecePent.width
        }
    }
    
    function updateSeconds(){
        timerImage.number += 1;
        timerImage.textI.setText(timerImage.number / 100)
        
    }

	return {
		assets: assets,
		name: "creatPianoTiles",
		create: function(event){
			sceneGroup = game.add.group()
			//var game = sceneGroup.game
            
            monsterGroup = new Phaser.Group(sceneGroup.game)
            //monsterGroup.anchor.set(0.5,0.5)
            
            
            var spriteScale = (game.world.height / 1920)
		    sceneGroup.spriteScale = spriteScale
            
			var background = sceneGroup.create(game.world.centerX, game.world.centerY, 'background');
	        background.anchor.setTo(0.5, 0.5);

	        creatureBody = monsterGroup.create(0, 0, 'atlas.pianotiles','body');
	        creatureBody.anchor.setTo(0.5,1);
            //creatureBody.scale.setTo(0.9,0.9)
 	        creatureBody.x = game.world.centerX;
	        creatureBody.y = game.height - game.height * 0.1

	        //createFins()
            
            buttonReady = true
            
	        var eyes = createEyes()
	        creatureBody.eyes = eyes

	        var bird = createBird()
	        creatureBody.bird = bird

	        var note = sceneGroup.create(0, 0,'atlas.pianotiles', 'note')
	        note.anchor.setTo(0.5, 0.5)
	        note.x = bird.x
	        note.y = bird.y

	        creatureBody.bird.note = note

	        //groupNotes = new Phaser.Group(sceneGroup.game)
            groupNotes = game.add.group()
            monsterGroup.add(groupNotes)
            
            indexPiece = 0
            indexDelete = 1
            indexUse = 0

	        var maskWidth = creatureBody.width * 0.60
	        var maskHeight = creatureBody.height * 0.53
	        var maskPositionX = creatureBody.x - creatureBody.width * 0.267 * creatureBody.scale.x
	        var maskPositionY = creatureBody.y - (creatureBody.height * 0.67) * creatureBody.scale.y
	        groupNotes.container = {
	        	width: maskWidth,
	        	height: maskHeight,
	        	x: maskPositionX,
	        	y: maskPositionY
	        }
            
            groupNotes.scale.setTo(creatureBody.scale.x,creatureBody.scale.y)


	        var mask = game.add.graphics(0, 0)
	        mask.x = 0
	        mask.y = 0
	        /*mask.beginFill(0x000000)
	        var rect = mask.drawRect(0, 0, maskWidth, maskHeight)
	        mask.endFill()*/

	        //groupNotes.mask = mask
            
            loadSounds()
			initialize()
			drawRows()
            
            buttonsGroup = new Phaser.Group(sceneGroup.game)
            
            var gameBar = buttonsGroup.create(game.world.centerX, game.world.height,'atlas.pianotiles', 'bottom')
            gameBar.width = game.world.width
            gameBar.scale.y = 1.1
	        gameBar.anchor.setTo(0.5, 1)
            
            optionsGroup = createAnswerGroup()
            //var optionsScale = (containerHeight * 0.65) / optionsGroup.height
            //optionsGroup.scale.setTo(optionsScale, optionsScale)
            optionsGroup.x = game.world.centerX
            optionsGroup.y = game.world.height - 112
            buttonsGroup.add(optionsGroup)
            
            var pentagramImg = buttonsGroup.create(0,0,'atlas.pianotiles','pentagrama')
            pentagramImg.scale.setTo(0.4,0.4)
            pentagramImg.y = 70
            
            createPentagramBar(pentagramImg)
            
            notesGroup = game.add.group()
            buttonsGroup.add(notesGroup)
            
            createNotes(pentagramImg)
            
            createHearts()
            
            mouthShade = game.add.sprite(creatureBody.x, creatureBody.y - (creatureBody.height * 0.415),'atlas.pianotiles','mouthshade')
            mouthShade.anchor.setTo(0.5,0.5)
            mouthShade.scale.setTo(0.57,0.57)
            monsterGroup.add(mouthShade)
            
            createTimer()
            
            timer = game.time.create(false);
            timer.loop(1, updateSeconds, this);
            
            timer.start()
            
            console.log(monsterGroup.width + ' width, ' + monsterGroup.height + ' height,' + game.world.width + ' width')
            var scaleToUse = game.world.width / 966
            //monsterGroup.pivot.x = monsterGroup.width * 0.5
            //monsterGroup.pivot.y = monsterGroup.height * 0.5
            monsterGroup.scale.setTo(scaleToUse,scaleToUse)
            //monsterGroup.x = game.world.width * 0.5
            //monsterGroup.y = game.world.height - monsterGroup.height * 0.6
            
		},
		show: function(event){
			loadSounds()
			initialize()
			drawRows()
		}
	}
}()