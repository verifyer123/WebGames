
var soundsPath = "../../shared/minigames/sounds/"

var earDrummer = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.earDrummer",
                json: "images/earDrummer/atlas.json",
                image: "images/earDrummer/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/earDrummer/tutorial_image_%input.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/the_buildup.mp3'
            },
            //piano notes
            {	name: "C3",
				file: "pianoNotes/C3.mp3"},
			{	name: "Db3",
				file: "pianoNotes/Db3.mp3",},
			{	name: "D3",
				file: "pianoNotes/D3.mp3",},
			{	name: "Eb3",
				file: "pianoNotes/Eb3.mp3",},
			{	name: "E3",
				file: "pianoNotes/E3.mp3",},
			{	name: "F3",
				file: "pianoNotes/F3.mp3"},
			{	name: "Gb3",
				file: "pianoNotes/Gb3.mp3"},
			{	name: "G3",
				file: "pianoNotes/G3.mp3"},
			{	name: "Ab3",
				file: "pianoNotes/Ab3.mp3"},
			{	name: "A3",
				file: "pianoNotes/A3.mp3"},
			{	name: "Bb3",
				file: "pianoNotes/Bb3.mp3"},
			{	name: "B3",
				file: "pianoNotes/B3.mp3"},
			{	name: "C4",
				file: "pianoNotes/C4.mp3"},
			{	name: "Db4",
				file: "pianoNotes/Db4.mp3"},
			{	name: "D4",
				file: "pianoNotes/D4.mp3"},
			{	name: "Eb4",
				file: "pianoNotes/Eb4.mp3"},
			{	name: "E4",
				file: "pianoNotes/E4.mp3"},
			{	name: "F4",
				file: "pianoNotes/F4.mp3"},
			{	name: "Gb4",
				file: "pianoNotes/Gb4.mp3"},
			{	name: "G4",
				file: "pianoNotes/G4.mp3"},
			{	name: "Ab4",
				file: "pianoNotes/Ab4.mp3"},
			{	name: "A4",
				file: "pianoNotes/A4.mp3"},
			{	name: "Bb4",
				file: "pianoNotes/Bb4.mp3"},
			{	name: "B4",
				file: "pianoNotes/B4.mp3"},
			{	name: "C5",
				file: "pianoNotes/C5.mp3"},
			{	name: "Db5",
				file: "pianoNotes/Db5.mp3"},
			{	name: "D5",
				file: "pianoNotes/D5.mp3"},
			{	name: "Eb5",
				file: "pianoNotes/Eb5.mp3"},
			{	name: "E5",
				file: "pianoNotes/E5.mp3"},
			{	name: "F5",
				file: "pianoNotes/F5.mp3"},
			{	name: "Gb5",
				file: "pianoNotes/Gb5.mp3"},
			{	name: "G5",
				file: "pianoNotes/G5.mp3"},
			{	name: "Ab5",
				file: "pianoNotes/Ab5.mp3"},
			{	name: "A5",
				file: "pianoNotes/A5.mp3"},
			{	name: "Bb5",
				file: "pianoNotes/Bb5.mp3"},
			{	name: "B5",
				file: "pianoNotes/B5.mp3"},
			{	name: "C6",
				file: "pianoNotes/C6.mp3"}
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "hand",
                file: "images/spines/hand.png",
                width: 115,
                height: 111,
                frames: 23
            }
        ],
        spines:[
			{
				name:"paz",
				file:"images/spines/paz/paz.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 216
    var tutoGroup
    var pointsBar
    var heartsGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var cursors
    var keyState = {up: false, right: false, left: false}
    var barsGroup
    var boneName
    var paz
    var tokensGroup
    var TOKENS_SPEED
    var TOKENS_DELAY
    var pianoSong
    var notesPivot
    var rand
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        TOKENS_SPEED = 250
        TOKENS_DELAY = 2
        notesPivot = 0
        rand = -1
        
        pianoSong =[
        [   //Twinkle Twinkle Little Star
            {note:"C4",time:400},{note:"C4",time:400},{note:"G4",time:450},{note:"G4",time:400},{note:"A4",time:500},{note:"A4",time:400},{note:"G4",time:700},
            {note:"F4",time:400},{note:"F4",time:400},{note:"E4",time:450},{note:"E4",time:400},{note:"D4",time:450},{note:"D4",time:400},{note:"C4",time:700},
            {note:"G4",time:400},{note:"G4",time:400},{note:"F4",time:450},{note:"F4",time:400},{note:"E4",time:450},{note:"E4",time:400},{note:"D4",time:700},
            {note:"G4",time:400},{note:"G4",time:400},{note:"F4",time:450},{note:"F4",time:400},{note:"E4",time:450},{note:"E4",time:400},{note:"D4",time:700},
            {note:"C4",time:400},{note:"C4",time:400},{note:"G4",time:450},{note:"G4",time:400},{note:"A4",time:450},{note:"A4",time:400},{note:"G4",time:700},
            {note:"F4",time:600},{note:"F4",time:600},{note:"E4",time:650},{note:"E4",time:600},{note:"D4",time:650},{note:"D4",time:800},{note:"C4",time:0}
        ],
		[   //oveer the rainbow
			{note:"C5",time:900},{note:"C6",time:800},{note:"B5",time:500},{note:"G5",time:400},{note:"A5",time:400},{note:"B5",time:500},{note:"C6",time:800},{note:"C5",time:700},{note:"A5",time:800},{note:"G5",time:1200},
            {note:"A4",time:900},{note:"F5",time:800},{note:"E5",time:500},{note:"C5",time:400},{note:"D5",time:400},{note:"E5",time:450},{note:"F5",time:900},
            {note:"D4",time:400},{note:"B5",time:400},{note:"C5",time:400},{note:"D5",time:700},{note:"E5",time:700},{note:"C5",time:1500},
            {note:"G4",time:500},{note:"E5",time:400},{note:"G5",time:400},{note:"E5",time:400},{note:"G5",time:400},{note:"E5",time:400},{note:"G5",time:400},{note:"E5",time:400},
            {note:"G5",time:400},{note:"F5",time:400},{note:"G5",time:400},{note:"F5",time:400},{note:"G5",time:400},{note:"F5",time:400},{note:"G5",time:400},{note:"F5",time:800},
            {note:"C5",time:900},{note:"C6",time:800},{note:"B5",time:500},{note:"G5",time:400},{note:"A5",time:400},{note:"B5",time:500},{note:"C6",time:800},{note:"C5",time:700},{note:"A5",time:800},{note:"G5",time:1200},
            {note:"A4",time:900},{note:"F5",time:800},{note:"E5",time:500},{note:"C5",time:400},{note:"D5",time:400},{note:"E5",time:450},{note:"F5",time:900},
            {note:"D4",time:600},{note:"D4",time:600},{note:"C5",time:600},{note:"D5",time:900},{note:"E5",time:900},{note:"C5",time:0},
            
		],
        [   //moonligth sonata
			{note:"E5",time:400},{note:"Eb5",time:400},{note:"E5",time:400},{note:"Eb5",time:400},{note:"E5",time:400},{note:"B4",time:400},{note:"D5",time:400},{note:"C5",time:500},{note:"A4",time:800},
            {note:"C4",time:400},{note:"E4",time:400},{note:"A4",time:400},{note:"B4",time:650},{note:"E4",time:400},{note:"G4",time:400},{note:"B4",time:400},{note:"C5",time:1000},
            {note:"E5",time:400},{note:"Eb5",time:400},{note:"E5",time:400},{note:"Eb5",time:400},{note:"E5",time:400},{note:"B4",time:400},{note:"D5",time:400},{note:"C5",time:500},{note:"A4",time:800},
            {note:"C4",time:400},{note:"E4",time:400},{note:"A4",time:400},{note:"B4",time:650},{note:"E4",time:400},{note:"G4",time:400},{note:"B4",time:400},{note:"C5",time:1000},
            {note:"E5",time:400},{note:"Eb5",time:400},{note:"E5",time:400},{note:"Eb5",time:400},{note:"E5",time:400},{note:"B4",time:400},{note:"D5",time:400},{note:"C5",time:500},{note:"A4",time:800},
            {note:"C4",time:400},{note:"E4",time:400},{note:"A4",time:400},{note:"B4",time:650},{note:"E4",time:600},{note:"C5",time:700},{note:"B4",time:800},{note:"A4",time:0},
		],
        [   //Ode to joy
			{note:"B3",time:400},{note:"B3",time:400},{note:"C4",time:400},{note:"D4",time:400},{note:"D4",time:400},{note:"C4",time:400},{note:"B3",time:400},{note:"A3",time:450},{note:"G3",time:400},{note:"G3",time:400},{note:"A3",time:400},{note:"B3",time:400},{note:"B3",time:400},{note:"A3",time:350},{note:"A3",time:1200},
            {note:"B3",time:400},{note:"B3",time:400},{note:"C4",time:400},{note:"D4",time:400},{note:"D4",time:400},{note:"C4",time:400},{note:"B3",time:400},{note:"A3",time:400},{note:"G3",time:400},{note:"G3",time:400},{note:"A3",time:400},{note:"B3",time:400},{note:"A3",time:400},{note:"G3",time:400},{note:"G3",time:1200},
            
            {note:"A3",time:400},{note:"B3",time:400},{note:"G3",time:400},{note:"A3",time:400},{note:"B3",time:400},{note:"C4",time:400},{note:"B3",time:400},{note:"G3",time:400},{note:"A3",time:400},{note:"B3",time:400},{note:"C4",time:400},{note:"B3",time:400},{note:"A3",time:400},{note:"G3",time:400},{note:"A3",time:400},{note:"D3",time:1200},
            
            {note:"B3",time:400},{note:"B3",time:400},{note:"C4",time:400},{note:"D4",time:400},{note:"D4",time:400},{note:"C4",time:400},{note:"B3",time:400},{note:"A3",time:400},{note:"G3",time:400},{note:"G3",time:400},{note:"A3",time:400},{note:"B3",time:400},
            {note:"A3",time:400},{note:"G3",time:400},{note:"G3",time:0}
		],
        [   //London bridge
            {note:"G4",time:400},{note:"A4",time:400},{note:"G4",time:400},{note:"F4",time:400},{note:"E4",time:400},{note:"F4",time:400},{note:"G4",time:800},
            {note:"D4",time:400},{note:"E4",time:400},{note:"F4",time:800},{note:"E4",time:400},{note:"F4",time:400},{note:"G4",time:1200},
            {note:"G4",time:400},{note:"A4",time:400},{note:"G4",time:400},{note:"F4",time:400},{note:"E4",time:400},{note:"F4",time:400},{note:"G4",time:800},
            {note:"D4",time:400},{note:"G4",time:400},{note:"E4",time:400},{note:"C4",time:1200},
            {note:"G4",time:400},{note:"A4",time:400},{note:"G4",time:400},{note:"F4",time:400},{note:"E4",time:400},{note:"F4",time:400},{note:"G4",time:800},
            {note:"D4",time:400},{note:"E4",time:400},{note:"F4",time:800},{note:"E4",time:400},{note:"F4",time:400},{note:"G4",time:800},
            {note:"G4",time:400},{note:"A4",time:400},{note:"G4",time:400},{note:"F4",time:400},{note:"E4",time:400},{note:"F4",time:400},{note:"G4",time:800},
            {note:"D4",time:400},{note:"G4",time:400},{note:"E4",time:400},{note:"C4",time:0},
        ]
	]
        
        cursors = game.input.keyboard.createCursorKeys()
        
        loadSounds()
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.earDrummer','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsBar.add(pointsText)
        pointsBar.text = pointsText
        pointsBar.number = 0
    }
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        var pivotX = 10
        
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.earDrummer','life_box')

        pivotX += heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0)
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        heartsGroup.text = pointsText
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
    }
    
    function missPoint(obj){
        
        sound.play("wrong")
        
        particleWrong.x = obj.centerX 
        particleWrong.y = obj.centerY
        particleWrong.start(true, 1200, null, 10)
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            tokensGroup.setAll("body.velocity.x", 0, true, true)
            paz.setAnimationByName(0, "lose", true)
            stopGame()
        }
    }
    
    function stopGame(){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        gameSong.stop()
        		
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		//buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.earDrummer", "tile"))
    }

	function update(){
        
        if(gameActive){
            
            if(cursors.right.isDown){
                if(!keyState.right){
                    keyState.right = true
                    tokensGroup.forEachAlive(hitEar, this, "blue")
                }
            }
            else{
                keyState.right = false
            }   
            
            if(cursors.up.isDown){
                if(!keyState.up){
                    keyState.up = true
                    tokensGroup.forEachAlive(hitEar,this, "pink")
                }
            }
            else{
                keyState.up = false
            }   
            
            if(cursors.left.isDown){
                if(!keyState.left){
                    keyState.left = true
                    tokensGroup.forEachAlive(hitEar,this, "green")
                }
            }
            else{
                keyState.left = false
            }   
        }
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.earDrummer',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
	
	function createCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 10)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(5)
                   if(pointsBar.number > 25){
                       TOKENS_SPEED < 750 ? TOKENS_SPEED += 250 : TOKENS_SPEED = 750
                       TOKENS_DELAY> 1.5 ? TOKENS_DELAY -= 0.5 : TOKENS_DELAY = 1.5
                   }
               })
           })
        })
    }
    
    function createBars(){
        
        var board = sceneGroup.create(0, 240, "atlas.earDrummer", "board")
        board.anchor.setTo(0, 0.5)
        board.width = game.world.width
        
        barsGroup = game.add.group()
        sceneGroup.add(barsGroup)
        
        var good = barsGroup.create(board.width - 130, board.centerY, "atlas.earDrummer", "goodGlow")
        good.anchor.setTo(0.5)
        good.alpha = 0
        barsGroup.good = good
        
        var bad = barsGroup.create(board.width - 130, board.centerY, "atlas.earDrummer", "badGlow")
        bad.anchor.setTo(0.5)
        bad.alpha = 0
        barsGroup.bad = bad
        
        var tapBar = barsGroup.create(board.width - 130, board.centerY, "atlas.earDrummer", "bar")
        tapBar.anchor.setTo(0.5)
        barsGroup.tapBar = tapBar
    }
    
    function createPaz(){
        
        var ear = sceneGroup.create(game.world.centerX - 50, game.world.height - 30, "atlas.earDrummer", "ear")
        ear.anchor.setTo(0.5, 1)
        ear.scale.setTo(-1, 1)
            
        paz = game.add.spine(ear.centerX - 180, ear.centerY, "paz")
        paz.setAnimationByName(0, "idle", true)
        paz.setSkinByName("normal")
        paz.scale.setTo(0.8)
        sceneGroup.add(paz)
        
        var textBar = sceneGroup.create(game.world.centerX + 130, game.world.centerY, "atlas.earDrummer", "textBar")
        textBar.anchor.setTo(0.5)

        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#ffffff"}
        
        boneName = new Phaser.Text(sceneGroup.game, 0, 10, "", fontStyle)
        boneName.anchor.setTo(0.5)
        boneName.alpha = 0
        textBar.addChild(boneName)
    }
    
    function createButtons(){
        
        var buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var box = game.add.graphics(10, game.world.height - 220)
        box.beginFill(0x0000ff)
        box.drawRect(0, 0, 200, 200)
        box.alpha = 0
        box.inputEnabled = true
        box.color = "blue"
        box.events.onInputDown.add(hitBone, this)
        buttonsGroup.add(box)
        
        var box = game.add.graphics(100, game.world.height - 430)
        box.beginFill(0xff00ff)
        box.drawRect(0, 0, 200, 200)
        box.alpha = 0
        box.inputEnabled = true
        box.color = "pink"
        box.events.onInputDown.add(hitBone, this)
        buttonsGroup.add(box)
        
        var box = game.add.graphics(230, game.world.height - 220)
        box.beginFill(0x00ff00)
        box.drawRect(0, 0, 200, 200)
        box.alpha = 0
        box.inputEnabled = true
        box.color = "green"
        box.events.onInputDown.add(hitBone, this)
        buttonsGroup.add(box)
    }
    
    function createAssets(){
        
        tokensGroup = game.add.group()
        tokensGroup.enableBody = true
        tokensGroup.physicsBodyType = Phaser.Physics.ARCADE
        tokensGroup.createMultiple(30, "atlas.earDrummer", 'star')
        tokensGroup.setAll('anchor.x', 1)
        tokensGroup.setAll('anchor.y', 0.5)
        tokensGroup.setAll('checkWorldBounds', true)
        tokensGroup.setAll('outOfBoundsKill', true)
        tokensGroup.setAll('exists', false)
        tokensGroup.setAll('visible', false)
        tokensGroup.setAll('tag', -1)
        tokensGroup.forEach(function(obj){
            obj.events.onOutOfBounds.add(killObj, this)
        },this)
        sceneGroup.add(tokensGroup)
        
        if(localization.getLanguage() === "ES"){
            tokensGroup.tags = [{color:"blue", bone:"Yunque"},
                                {color:"pink", bone:"Martillo"},
                                {color:"green", bone:"Tímpano"}]
        }
        else{
            tokensGroup.tags = [{color:"blue", bone:"Incus"},
                                {color:"pink", bone:"Malleus"},
                                {color:"green", bone:"Tympanum"}]
        }
    }
    
    function killObj(obj){
        
        game.add.tween(barsGroup.bad).to({alpha:1},150,Phaser.Easing.linear, true,0,0,true)
        paz.setAnimationByName(0, "bad", false)
        paz.addAnimationByName(0, "idle", true)
        obj.kill()
        notesPivot++
        if(lives > 0)
            missPoint(barsGroup.tapBar)
    }
    
    function hitBone(box){
        
        tokensGroup.forEachAlive(hitEar,this, box.color)
    }
    
    function hitEar(obj, color){
        
        if(gameActive && barsGroup.tapBar.overlap(obj)){
            
            if(color === obj.tag.color){
                game.add.tween(barsGroup.good).to({alpha: 1}, 150, Phaser.Easing.linear,true,0,0,true)
                paz.setAnimationByName(0, "play_" + obj.tag.color, false)
                paz.addAnimationByName(0, "idle", true)
                boneName.setText(obj.tag.bone)
                game.add.tween(boneName).to({alpha: 1}, 150, Phaser.Easing.linear,true)
                obj.kill()
                sound.play(pianoSong[rand][notesPivot].note)
                notesPivot++
            }
            else{
                killObj(obj)
                game.add.tween(boneName).to({alpha: 0}, 150, Phaser.Easing.linear,true)
            }
            
            if(notesPivot === pianoSong[rand].length){
                addCoin(paz)
                game.add.tween(boneName).to({alpha: 0}, 150, Phaser.Easing.linear,true, 200)
                gameActive = false
                notesPivot = 0
                game.time.events.add(1000, initGame)
            }
        }
    }
    
    function initGame(){
        
        rand = getRand()
        game.time.events.add(2000, function(){
            startSong()
            gameActive = true
        })
    }
    
    function startSong(){
        
        var delay = 200
       
        for(var i = 0; i < pianoSong[rand].length; i++){
            
            game.time.events.add(delay, sendToken)
            delay += pianoSong[rand][i].time * TOKENS_DELAY
        }
    }
    
    function sendToken(){
        
        var inputName = '_movil'
		
		if(game.device.desktop){
			inputName = '_desktop'
		}
        
        var obj = tokensGroup.getFirstExists(false)
        var opt = game.rnd.integerInRange(0, 2)

        if(obj && gameActive){   
            obj.loadTexture("atlas.earDrummer", tokensGroup.tags[opt].color + inputName)
            obj.tag = tokensGroup.tags[opt]
            obj.reset(0, barsGroup.tapBar.centerY)
            obj.body.velocity.x = TOKENS_SPEED
            //sound.play(pianoSong[rand][notesPivot].note)
              //  notesPivot++
        }
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, pianoSong.length-1)
        if(x === rand)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "earDrummer",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.2})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createBars()
            createPaz()
            createButtons()
            createAssets()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()