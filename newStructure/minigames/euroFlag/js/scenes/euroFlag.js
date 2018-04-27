
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var euroFlag = function(){
    
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
                name: "atlas.euroFlag",
                json: "images/euroFlag/atlas.json",
                image: "images/euroFlag/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/euroFlag/timeAtlas.json",
                image: "images/euroFlag/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/euroFlag/gametuto.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/sillyAdventureGameLoop.mp3'
            }
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
				name:"theffanie",
				file:"images/spines/theffanie/theffanie.json"
			},
            {
				name:"colorCubes",
				file:"images/spines/color_cubes/color_cubes.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 185
    var tutoGroup
    var gameSong
    var coin
    var hand
    var btnGroup
    var boxGroup
    var cubeGroup
    var verticalForm
    var theffanie
    var counter
    var rand
    var flagColors
    var nameContainer
    var level
    var verticalFalgs = [{name: "", a: 'N', b: "Y", c:"R"},
                         {name: "", a: 'B', b: "W", c:"R"},
                         {name: "", a: 'G', b: "W", c:"O"},
                         {name: "", a: 'G', b: "W", c:"R"},
                         {name: "", a: 'B', b: "Y", c:"R"},]
    
    var horizontalFlags = [{name: "", a: 'R', b: "W", c:"R"},
                           {name: "", a: 'W', b: "G", c:"R"},
                           {name: "", a: 'R', b: "W", c:"LB"},
                           {name: "", a: 'LB', b: "N", c:"W"},
                           {name: "", a: 'N', b: "R", c:"Y"},]
    var timeAtack
    var gameTime
    var flagsCounter
    var tutrialEnd
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        verticalForm = true
        counter = 0
        rand = -1
        level = 2
        timeAtack = false
        gameTime = 7000
        flagsCounter = 0
        tutrialEnd = false
        
        if(localization.getLanguage() === 'EN'){
            
            verticalFalgs[0].name = "Belgium"
            verticalFalgs[1].name = "France"
            verticalFalgs[2].name = "Ireland"
            verticalFalgs[3].name = "Italy"
            verticalFalgs[4].name = "Romania"
            
            horizontalFlags[0].name = "Austria"
            horizontalFlags[1].name = "Bulgaria"
            horizontalFlags[2].name = "Luxemburg"
            horizontalFlags[3].name = "Estonia"
            horizontalFlags[4].name = "Germany"
        }
        else{
            
            verticalFalgs[0].name = "Bélgica"
            verticalFalgs[1].name = "Francia"
            verticalFalgs[2].name = "Irlanda"
            verticalFalgs[3].name = "Italia"
            verticalFalgs[4].name = "Rumania"
            
            horizontalFlags[0].name = "Austria"
            horizontalFlags[1].name = "Bulgaria"
            horizontalFlags[2].name = "Luxemburgo"
            horizontalFlags[3].name = "Estonia"
            horizontalFlags[4].name = "Alemania"
        }
        
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
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.euroFlag','xpcoins')
        pointsImg.anchor.setTo(1,0)
    
        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsBar.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
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

        var heartImg = group.create(0,0,'atlas.euroFlag','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        gameSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
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
        initTutorial()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
            
        var sky = sceneGroup.create(0, 0, "atlas.euroFlag", "skycolor")
        sky.width = game.world.width
        sky.height = game.world.height
        
        var cloud = sceneGroup.create(0, 0, "atlas.euroFlag", "cloud")
        
        nameContainer = game.add.group()
        sceneGroup.add(nameContainer)
        
        var cont = nameContainer.create(game.world.centerX, game.world.centerY - 160, "atlas.euroFlag", "NameContainer")
        cont.anchor.setTo(0.5, 1)
        cont.inputEnabled = true
        cont.events.onInputDown.add(nextFlag, this)
        //nameContainer.scale.setTo(1.2, 1)
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#96063a", align: "center"}
        
        var name = new Phaser.Text(sceneGroup.game, cont.centerX, cont.centerY - 25, "", fontStyle)
        name.anchor.setTo(0.5)
        nameContainer.add(name)
        nameContainer.text = name
        
        nameContainer.children[0].inputEnabled = false
        
        var background = game.add.tileSprite(0, cont.y - 50, game.world.width, game.world.centerY + 50, "atlas.euroFlag", "background")
        sceneGroup.add(background)
    }

	function update(){
        
    }
    
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
            if(!particle.used && particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
                particlesGroup.remove(particle)
                particlesUsed.add(particle)
				                
                return particle
                break
            }
        }
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            
            obj.used = false
            particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
        },this)
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.euroFlag',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.euroFlag',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
				particle.gravity = 150;
				particle.angularDrag = 30;
				
				particlesGroup.add(particle)
				
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',3)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		
		game.add.tween(rect).from({alpha:1},500,"Linear",true)
		
        var exp = sceneGroup.create(0,0,'atlas.euroFlag','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.euroFlag','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        timerGroup.add(clock)
        
        var timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timerGroup.add(timeBar)
        timerGroup.timeBar = timeBar
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.3
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            win()
        })
    }
	
	function initCoin(){
        
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
        sceneGroup.add(hand)

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        var time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createBoxes(){
        
        boxGroup = game.add.group()
        sceneGroup.add(boxGroup)
        
        var vertical = game.add.group()
        boxGroup.add(vertical)
        boxGroup.vertical = vertical
        
        var horizontal = game.add.group()
        boxGroup.add(horizontal)
        boxGroup.horizontal = horizontal
        
        var pivotVert = 0
        var pivotHor = game.world.centerY - 210
        
        var rowPivot = 0
        var columPivot = 0
        
        for(var t = 0; t < 3; t++)
        {
            var box = game.add.graphics(pivotVert, game.world.centerY - 210)
            box.beginFill(0xFF0000)
            box.lineStyle(2, 0x0000FF, 1)
            box.drawRect(0, 0, game.world.width / 3, 370)
            box.alpha = 0
            box.minRow = rowPivot
            box.maxRow = rowPivot + 3
            box.minColum = 0
            box.maxColum = 6
            box.tag = "Z"
            vertical.add(box)
            
            rowPivot += 3
            pivotVert += game.world.width / 3
            
            var box = game.add.graphics(0, pivotHor)
            box.beginFill(0x0000FF)
            box.lineStyle(2, 0xFF0000, 1)
            box.drawRect(0, 0, game.world.width, 372 / 3)
            box.alpha = 0
            box.minRow = 0
            box.maxRow = 9
            box.minColum = columPivot
            box.maxColum = columPivot + 2
            box.tag = "Z"
            horizontal.add(box)
            
            columPivot += 2
            pivotHor += 372 / 3
        }
    }
    
    function createButons(){
        
        var container = sceneGroup.create(0, game.world.height + 80, "atlas.euroFlag", "container")
        container.anchor.setTo(0, 1)
        container.width = game.world.width
        
        btnGroup = game.add.group()
        sceneGroup.add(btnGroup)
        
        var pivot = 0.4
        
        for(var i = 0; i < 4; i++){
            
            var btnContainer = btnGroup.create(container.centerX * pivot, container.centerY - 20, "atlas.euroFlag", "btonContainer")
            btnContainer.anchor.setTo(0.5)
            btnContainer.inputEnabled = true
            btnContainer.input.enableDrag()
            btnContainer.events.onDragStop.add(dropPaint, this)
            btnContainer.posX = btnContainer.x
            btnContainer.posY = btnContainer.y
            btnContainer.tint = 0xDDDDDD
            btnContainer.colorText = "white"
            btnContainer.tag = "Z"
            
            var btn = sceneGroup.create(0, 0, "atlas.euroFlag", "btn")
            btn.anchor.setTo(0.5)
            btnContainer.addChild(btn)
            btnContainer.color = btn
            
            pivot += 0.4
        }
        
         var colorCodes = [{color: "black", code: 0x000000, tag: "N"},
                           {color: "white", code: 0xFFFFFF, tag: "W"},
                           {color: "red", code: 0xED1C24, tag: "R"},
                           {color: "green", code: 0x006837, tag: "G"},
                           {color: "blue", code: 0x0000FF, tag: "B"},
                           {color: "yellow", code: 0xFFFF00, tag: "Y"},
                           {color: "blue_light", code: 0x0DAFF7, tag: "LB"},
                           {color: "orange", code: 0xF96B0B, tag: "O"},]
         btnGroup.colorCodes = colorCodes
        
        btnGroup.setAll("inputEnabled", false)
    }
    
    function createCubes(){
        
        cubeGroup = game.add.group()
        sceneGroup.add(cubeGroup)
        
        var rows = 9
        var columns = 6
        var num = 0
        
        cubeGroup.coordinates = new Array(rows)
        for (var i = 0; i < rows; i++) {
            cubeGroup.coordinates[i] = new Array(columns)
        }
        
        for(var i = 0; i < rows; i++){
            for(var j = 0; j < columns; j++){
                
                var cube = game.add.spine( 50 + (i * 85), game.world.centerY - 137 + (j * 61), "colorCubes")
                cube.setAnimationByName(0, "turn", true)
                cube.setSkinByName("grey")
                cube.scale.setTo(0.4)
                cubeGroup.add(cube)
                cubeGroup.coordinates[i][j] = cube
            }
        }
    }
    
    function createTheffanie(){
        
        theffanie = game.add.spine( game.world.centerX - 200, game.world.centerY + 300, "theffanie")
        theffanie.setAnimationByName(0, "idle", true)
        theffanie.setSkinByName("normal")
        theffanie.scale.setTo(0.4)
        sceneGroup.add(theffanie)
                
    }
    
    function dropPaint(obj){
        
        if(gameActive){
            
            obj.x = obj.posX
            obj.y = obj.posY
            
            if(verticalForm){
                var boxes = boxGroup.vertical
            }
            else{
                var boxes = boxGroup.horizontal
            }
            
            for(var i = 0; i < boxes.length; i++){
                
                if(checkOverlap(obj.color, boxes.children[i])){
                    boxes.children[i].tag = obj.tag
                    paintSection(boxes.children[i], obj.colorText)
                    counter++
                    break
                }
            }
            
            if(counter === 3){
                win(boxes)
            }
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function paintSection(obj, color){
        
         sound.play("swipe")
        for(var i = obj.minRow; i < obj.maxRow; i++){
            for(var j = obj.minColum; j < obj.maxColum; j++){
                animateCube(i, j, color)
            }
        }
    }
    
    function animateCube(i, j, color){
        
        game.time.events.add(game.rnd.integerInRange(50, 300),function(){
            cubeGroup.coordinates[i][j].setAnimationByName(0, "turn", false)
            cubeGroup.coordinates[i][j].setSkinByName(color)
        },this)
    }
    
    function win(boxes){
        
        gameActive = false
        btnGroup.setAll("inputEnabled", false)
        counter = 0
        
        if(timeAtack)
            stopTimer()
        
        var ans 
        boxes !== undefined ? ans = checkAnswer(boxes) : ans = false
        
        if(ans){
            addCoin()
            particleCorrect.x = game.world.centerX
            particleCorrect.y = game.world.centerY
            particleCorrect.start(true, 1200, null, 10)
            theffanie.setAnimationByName(0, "win", true)
            
            if(pointsBar.number > 9 && pointsBar.number % 5 === 0){
                level > 0 ? level-- : level = 0
                if(timeAtack){
                    gameTime > 1000 ? gameTime -= 500 : gameTime = 500
                }
            }
        }
        else{
            missPoint()
            particleWrong.x = game.world.centerX
            particleWrong.y = game.world.centerY
            particleWrong.start(true, 1200, null, 10)
            theffanie.setAnimationByName(0, "lose", true)
        }
        
        if(pointsBar.number === 20){
            timeAtack = true
            game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
        }
        
        if(lives !== 0){
            
            boxGroup.vertical.setAll("tag", "Z")
            boxGroup.horizontal.setAll("tag", "Z")
            
            game.time.events.add(2000,function(){
                 sound.play("swipe")
                for(var j = 0; j <  cubeGroup.length; j++){
                    cubeGroup.children[j].setAnimationByName(0, "turn", true)
                    cubeGroup.children[j].setSkinByName("grey")
                }
                
                theffanie.setAnimationByName(0, "idle", true)
                initGame()
            },this)
        }
    }
    
    function checkAnswer(boxes){
        
        var ans
        
        for(var i = 0; i < boxes.length; i++){
            
            if(boxes.children[i].tag === flagColors[i]){
                ans = true
            }
            else{
                ans = false
                break
            }
        }
        
        return ans
    }
    
    function initGame(){
        
        verticalForm = !verticalForm
        
        slelectFlag()
        
        game.time.events.add(1000,function(){
            gameActive = true
            btnGroup.setAll("inputEnabled", true)
            if(timeAtack)
                startTimer(gameTime)
        },this)
    }
    
    function slelectFlag(){
        
        if(verticalForm){
            rand = getRand(rand, 4)
            var flag = verticalFalgs[rand]
        }
        else{
            var flag = horizontalFlags[rand]
        }
        
        var pos = [0, 1, 2, 3]
        Phaser.ArrayUtils.shuffle(pos)
        
        flagColors = [flag.a, flag.b, flag.c]
        
        nameContainer.text.setText(flag.name)
        
        for(var i = 0; i < btnGroup.length - 1; i++){
            
            var index = getCode(flagColors[i])
            btnGroup.children[pos[i]].color.tint = btnGroup.colorCodes[index].code
            btnGroup.children[pos[i]].colorText = btnGroup.colorCodes[index].color
            btnGroup.children[pos[i]].tag = btnGroup.colorCodes[index].tag
        }
        
        btnGroup.children[pos[i]].color.tint = btnGroup.colorCodes[pos[i]].code
        btnGroup.children[pos[i]].colorText = btnGroup.colorCodes[pos[i]].color
        btnGroup.children[pos[i]].tag = btnGroup.colorCodes[pos[i]].tag
        
        if(level !== 0)
            paintPartOfTheFlag()
    }
        
    function getCode(tag){
        
        for(var i = 0; i < btnGroup.colorCodes.length; i++){
            
            if(tag === btnGroup.colorCodes[i].tag)
                return i
        }
    }
    
    function getRand(aux, limit){
        var x = game.rnd.integerInRange(0, limit)
        if(x === aux)
            return getRand(aux, limit)
        else
            return x     
    }
    
    function paintPartOfTheFlag(){

        if(verticalForm){
            var boxes = boxGroup.vertical
        }
        else{
            var boxes = boxGroup.horizontal
        }
        
        var section = -1
        
        for(var i = 0; i < level; i++){
            
            section = getRand(section, 2)
            boxes.children[section].tag = flagColors[section]
            paintSection(boxes.children[section], btnGroup.colorCodes[getCode(flagColors[section])].color)
            counter++            
        }
    }
    
    function initTutorial(){
        
        if(verticalForm){
            var flag = verticalFalgs[flagsCounter]
            var boxes = boxGroup.vertical
        }
        else{
            var flag = horizontalFlags[flagsCounter]
            var boxes = boxGroup.horizontal
        }
        
        flagColors = [flag.a, flag.b, flag.c]
        
        nameContainer.text.setText(flag.name)
        
        nameContainer.motion = game.add.tween(nameContainer.text.scale).to({x: 1.4, y:1.4}, 700, Phaser.Easing.linear, true, 0, -1)
        nameContainer.motion.yoyo(true, 0)
        
        for(var i = 0; i < boxes.length; i++){
            
            paintSection(boxes.children[i], btnGroup.colorCodes[getCode(flagColors[i])].color)       
        }
        
        game.time.events.add(2000,function(){
            nameContainer.children[0].inputEnabled = true
            handPos()
        },this)
    }
    
    function handPos(){
        
        hand.alpha = 1
        
        hand.x = nameContainer.children[0].centerX + 80
        hand.y = nameContainer.children[0].centerY - 50
    }
    
    function nextFlag(){
        
        hand.alpha = 0
        
        if(flagsCounter < 4){
            flagsCounter++
        }
        else{
            
            if(!verticalForm){
                tutrialEnd = true
            }
            else{
                verticalForm = false
                flagsCounter = 0
            }
        }
            
        nameContainer.motion.stop()
        nameContainer.text.scale.setTo(1)
        
        nameContainer.children[0].inputEnabled = false
        
        if(!tutrialEnd){
            if(flagsCounter % 2 === 0){
                addCoin()
            }
            initTutorial()
        }
        else{
            for(var j = 0; j <  cubeGroup.length; j++){
                cubeGroup.children[j].setAnimationByName(0, "turn", true)
                cubeGroup.children[j].setSkinByName("grey")
            }
            hand.destroy
            initGame()
        }
    }
	
	return {
		
		assets: assets,
		name: "euroFlag",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            /*gameSong = game.add.audio('gameSong')
            game.sound.setDecodedCallback(gameSong, function(){
                gameSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createBoxes()
            createCubes()
            createTheffanie()
            createButons()
            positionTimer()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()