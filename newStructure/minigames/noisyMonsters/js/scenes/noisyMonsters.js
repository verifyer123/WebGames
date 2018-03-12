
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var noisyMonsters = function(){
    
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
                name: "atlas.noisyMonsters",
                json: "images/noisyMonsters/atlas.json",
                image: "images/noisyMonsters/atlas.png",
            },

        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongAnswer",
				file: soundsPath + "wrongAnswer.mp3"},
            
            {	name: "noise3",
				file: "noise/electricGuitar.wav"},
            {	name: "noise2",
				file: "noise/babyCrying.mp3"},
            {	name: "noise1",
				file: "noise/carHorn.wav"},
            {	name: "noise0",
				file: "noise/jackhammer.mp3"},
		]
    }
       
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 121
    var overlayGroup
    var noisySong
    var coin
    var backgroundGroup
    var toolsGroup
    var boxGroup
    var monstersGroup
    var dinamitaGroup
    var back
    var scenePos
    var positions = [0,1,2,3]
    var itemCount
    var noisePollution
    var speed
    var dificult
    var stop
    var tutoPivot
    var noiseGroup = ['noise0', 'noise1', 'noise2', 'noise3']
    var tutoNoise
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        itemCount = 0 
        speed = 0
        dificult = 0.4
        stop = false
        tutoPivot = 0
        
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
        
        for(var p = 0; p < positions.length; p++){
            sound.stop(noiseGroup[p])
        }
        
        sound.play("wrongAnswer")
		        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.noisyMonsters','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.noisyMonsters','life_box')

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
        noisySong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('noisySong', soundsPath + 'songs/kids_and_videogame.mp3');
        
		/*game.load.image('howTo',"images/noisyMonsters/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/noisyMonsters/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/noisyMonsters/introscreen.png")*/
        
		game.load.image('backScreen',"images/noisyMonsters/backScreen.png")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
		
        for(var b = 0; b < 5; b++){
            game.load.image('back' + b, "images/noisyMonsters/backgrounds/back" + b + ".png")
        }
        
        game.load.spine("dinamita", "images/spines/Dinamita/dinamita.json")
        game.load.spine("monster2", "images/spines/PinkMonster/pink_monster.json")
        game.load.spine("monster1", "images/spines/BlueMonster/blue_monster.json")
        game.load.spine("monster0", "images/spines/GreenMonster/green_monster.json")
        game.load.spine("monster3", "images/spines/PurpleMonster/purple_monster.json")
		
		game.load.image('tutorial_image',"images/noisyMonsters/tutorial_image.png")
        //loadType(gameIndex)

        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)
        
        /*var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")

            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                //initGame()
                initTuto()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.noisyMonsters','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.noisyMonsters',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.noisyMonsters','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        //initGame()
        initTuto()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var backScreen = sceneGroup.create(0, 0, 'backScreen')
        backScreen.width = game.world.width
        backScreen.height = game.world.height
        
        board = sceneGroup.create(0, game.world.height, 'atlas.noisyMonsters', 'board')
        board.anchor.setTo(0, 1)
        board.width = game.world.width
        
        back = game.add.sprite(0, 0, 'back4')
        back.width = game.world.width * 0.5
        back.alpha = 0
        back.height = (game.world.height - board.height) * 0.5
        
        scenePos = [{x: 0, y: 0},
                    {x: back.width, y: 0},
                    {x: 0, y: back.height},
                    {x: back.width, y: back.height}]
        
        showMustGoOn()
        //sceneGroup.add(back)
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
        particle.makeParticles('atlas.noisyMonsters',key);
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

				particle.makeParticles('atlas.noisyMonsters',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.noisyMonsters','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.noisyMonsters','smoke');
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
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
    function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(objectBorn){
        
        coin.x = objectBorn.centerX
        coin.y = objectBorn.centerY
        time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
	
	function showMustGoOn(){
        
        backgroundGroup = game.add.group()
        backgroundGroup.alpha = 0
        sceneGroup.add(backgroundGroup)
        
        for(var b = 0; b < 4; b++){
            
            var backGroup = game.add.group()
            backgroundGroup.add(backGroup)
            
            var scenario = backGroup.create(0, 0, 'back' + b)
            scenario.width = back.width
            scenario.height = back.height  
            //scenario.x = scenePos[b].x
            //scenario.y = scenePos[b].y
            
            var monster = game.add.spine(scenario.centerX - 30, scenario.height - 35, "monster" + b)
            monster.setAnimationByName(0, "NOISY", true)
            monster.setSkinByName("normal")
            monster.scale.setTo(0.8)
            backGroup.add(monster)
        }
	}
    
    function xBox(){
        
        boxGroup = game.add.group()
        sceneGroup.add(boxGroup)
                
        for(var b = 0; b < 4; b++){
            var box = game.add.graphics(0, 0)
            //box.beginFill(0xFF3300)
            //box.lineStyle(2, 0x0000FF, 1)
            box.drawRect(0, 0, back.width, back.height)
            box.alpha = 0
            //box.x = scenePos[b].x
            //box.y = scenePos[b].y
            box.noise = b
            box.active = true
            boxGroup.add(box)
        }
    }
    
    function tnt(){
        
        dinamitaGroup = game.add.group()
        sceneGroup.add(dinamitaGroup)
        
        dinamita = game.add.spine(back.centerX - 50, back.height, "dinamita")
        dinamita.setAnimationByName(0, "SLEEP", true)
        dinamita.setSkinByName("normal")
        dinamita.alpha = 0
        dinamitaGroup.add(back)
        dinamitaGroup.add(dinamita)
    }
    
    function silenceMeter(){
        
        noiseMeterGroup = game.add.group()
        noiseMeterGroup.alpha = 0
        sceneGroup.add(noiseMeterGroup)
        
        var base = game.add.image(0, 0, "atlas.noisyMonsters", "board")
        base.anchor.setTo(0.5)
        base.scale.setTo(0.5)
        noiseMeterGroup.add(base)
        
        var bar = game.add.image(0, 0, "atlas.noisyMonsters", "bar")
        bar.anchor.setTo(0.5)
        bar.scale.setTo(1.35)
        noiseMeterGroup.add(bar)
        
        noiseMeter = game.add.image(-90, -10, "atlas.noisyMonsters", "meter")
        noiseMeter.anchor.setTo(0.5)
        noiseMeter.scale.setTo(1.3)
        noiseMeterGroup.add(noiseMeter)
        
        noiseMeterGroup.x = game.world.centerX - 50
        noiseMeterGroup.y = base.height * 0.9
    }
    
    function moveIt(){
        
        game.time.events.add(15,function(){
            
            if(noiseMeter.x < 120){
                noiseMeter.x += speed
                noiseMeter.y -= speed * 0.15
            }
            else{
                win(false)
                stop = true
            }
            
            if(!stop){
                moveIt()
            }

        }, this)
    }
    
    function bigTool(){
        
        toolsGroup = game.add.group()
        //toolsGroup.x = board.centerX * 0.3
        toolsGroup.y = board.centerY - 5
        toolsGroup.alpha = 0
        sceneGroup.add(toolsGroup)
        
        for(var t = 0; t < 4; t++){
            
            var tool = toolsGroup.create(0, 0, 'atlas.noisyMonsters', 'tool' + t)
            tool.anchor.setTo(0.5)
            //tool.x += t * 160
            //tool.fixPosX = tool.x
            tool.fixPosY = tool.y
            tool.noise = t
            tool.inputEnabled = true
            tool.input.enableDrag()
            tool.events.onDragStop.add(misClick,this)
        }
    }
    
    function misClick(tool){
        
        if(tutoPivot < 4){
            checkTuto(tool)
        }
        else{
            putThatThingDown(tool)
        }
    }
    
    function putThatThingDown(theTool){
        
        var cont
        var item = theTool.getBounds()
        var aux = false
        
        for(var f = 0; f < boxGroup.length; f++){
            cont = boxGroup.children[f].getBounds()
            
            if(boxGroup.children[f].active && cont.containsRect(item) && boxGroup.children[f].noise === theTool.noise){
                sound.play('rightChoice')
                theTool.inputEnabled = false
                theTool.tint = 0x909090
                particleCorrect.x = boxGroup.children[f].centerX
                particleCorrect.y = boxGroup.children[f].centerY
                particleCorrect.start(true, 1200, null, 6)
                itemCount++
                addCoin(boxGroup.children[f])
                backgroundGroup.children[f].children[1].setAnimationByName(0, "SILENT", true)
                speed *= 0.5
                aux = true
                sound.stop(noiseGroup[f])
                break
            }
        }
        
        theTool.x = theTool.fixPosX
        theTool.y = theTool.fixPosY
        
        if(!aux){
            sound.play('wrongAnswer')
        }
        
        if(itemCount === 3){
            stop = true
            win(true)
        }
    }
    
    function win(ans){
        
        toolsGroup.setAll('inputEnabled', false)
        
        if(ans){
            dificult += 0.15
        }
        else{
            dinamita.setAnimationByName(0, "WAKE_UP", false)
            dinamita.addAnimationByName(0, "WAKE_STILL", true)
            game.add.tween(dinamitaGroup).to({x: back.centerX * 0.5, y: back.centerY * 0.5}, 400, Phaser.Easing.linear, true)
            game.add.tween(dinamitaGroup.scale).to({x: 1.5, y: 1.5}, 400, Phaser.Easing.linear, true)
            missPoint()
            if(dificult > 0.4){
                dificult -= 0.15
            }
        }
        
        
        
        game.time.events.add(1500,function(){
            
            for(var p = 0; p < positions.length; p++){
                sound.stop(noiseGroup[p])
            }
            
            game.add.tween(backgroundGroup).to({alpha:0}, 400, Phaser.Easing.linear, true)
            game.add.tween(noiseMeter).to({x: -90, y: -10}, 400, Phaser.Easing.linear, true)
            game.add.tween(dinamitaGroup.scale).to({x: 1, y: 1}, 400, Phaser.Easing.linear, true)
            game.add.tween(dinamitaGroup).to({x: 0, y: 0}, 400, Phaser.Easing.linear, true)
            game.add.tween(toolsGroup).to({alpha:0}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                toolsGroup.setAll('tint', 0xffffff)
                toolsGroup.setAll('x', 0)
                toolsGroup.setAll('y', 0)

                if(lives !== 0){
                    initGame()
                }
            })
        },this)
    }
    
    function initGame(){
        
        Phaser.ArrayUtils.shuffle(positions)
        itemCount = 0
        boxGroup.setAll('active', true)
        dinamita.setAnimationByName(0, "SLEEP", true)
        
        for(var p = 0; p < positions.length; p++){
            backgroundGroup.children[p].x = scenePos[positions[p]].x
            backgroundGroup.children[p].y = scenePos[positions[p]].y
            boxGroup.children[p].x = scenePos[positions[p]].x
            boxGroup.children[p].y = scenePos[positions[p]].y
            sound.play(noiseGroup[p]).loopFull(0.7)
            
            if(positions[p] === 0){
                boxGroup.children[p].active = false
                sound.stop(noiseGroup[p])
            }
            
            backgroundGroup.children[p].children[1].setAnimationByName(0, "NOISY", true)
        }
        
        Phaser.ArrayUtils.shuffle(positions)
        
        var aux = 0.4
        for(var p = 0; p < positions.length; p++){
            toolsGroup.children[positions[p]].x = board.centerX * aux //positions[p] * 160
            toolsGroup.children[positions[p]].fixPosX = toolsGroup.children[positions[p]].x  
            aux += 0.4
        }
        
        game.add.tween(toolsGroup).to({alpha:1}, 400, Phaser.Easing.linear, true)
        game.add.tween(backgroundGroup).to({alpha:1}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
            game.time.events.add(400,function(){
                toolsGroup.setAll('inputEnabled', true)
                speed = dificult
                stop = false
                moveIt()
            },this)
        })
    }
    
    function initTuto(){
        
        var aux = 0.4
            
        boxGroup.setAll('active', false)
        toolsGroup.setAll('inputEnabled', false)
        toolsGroup.setAll('tint', 0x909090)
        
        for(var p = 0; p < boxGroup.length; p++){
            backgroundGroup.children[p].x = scenePos[p].x
            backgroundGroup.children[p].y = scenePos[p].y
            boxGroup.children[p].x = scenePos[p].x
            boxGroup.children[p].y = scenePos[p].y
            
            backgroundGroup.children[p].children[1].setAnimationByName(0, "NOISY", true)
            backgroundGroup.children[p].children[1].alpha = 0
            
            toolsGroup.children[p].x = board.centerX * aux
            toolsGroup.children[p].fixPosX = toolsGroup.children[p].x  
            aux += 0.4
        }
        
        game.add.tween(toolsGroup).to({alpha:1}, 400, Phaser.Easing.linear, true)
        game.add.tween(backgroundGroup).to({alpha:1}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
            game.time.events.add(400,function(){
                sound.play(noiseGroup[tutoPivot], {loop:true, volume:0.6})
                toolsGroup.children[tutoPivot].inputEnabled = true
                toolsGroup.children[tutoPivot].tint = 0xffffff
                boxGroup.children[tutoPivot].active = true
                backgroundGroup.children[tutoPivot].children[1].alpha = 1
            },this)
        })
    }
	
    function checkTuto(theTool){
        
        var cont
        var item = theTool.getBounds()
        var aux = false
        
        for(var f = 0; f < boxGroup.length; f++){
            cont = boxGroup.children[f].getBounds()
            
            if(boxGroup.children[f].active && cont.containsRect(item) && boxGroup.children[f].noise === theTool.noise){
                sound.stop(noiseGroup[tutoPivot])
                sound.play('rightChoice')
                theTool.inputEnabled = false
                particleCorrect.x = boxGroup.children[f].centerX
                particleCorrect.y = boxGroup.children[f].centerY
                particleCorrect.start(true, 1200, null, 6)
                tutoPivot++
                backgroundGroup.children[f].children[1].setAnimationByName(0, "SILENT", true)
                aux = true
                break
            }
        }
        
        theTool.x = theTool.fixPosX
        theTool.y = theTool.fixPosY
        
        if(aux){
            game.time.events.add(1500,function(){
                game.add.tween(backgroundGroup).to({alpha:0}, 400, Phaser.Easing.linear, true)
                game.add.tween(toolsGroup).to({alpha:0}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                    toolsGroup.setAll('x', 0)
                    toolsGroup.setAll('y', 0)

                    if(tutoPivot < 4){
                        initTuto()
                    }
                    else{
                        game.add.tween(back).to({alpha:1}, 400, Phaser.Easing.linear, true)
                        game.add.tween(dinamita).to({alpha:1}, 400, Phaser.Easing.linear, true)
                        game.add.tween(noiseMeterGroup).to({alpha:1}, 400, Phaser.Easing.linear, true)
                        toolsGroup.setAll('tint', 0xffffff)
                        for(var f = 0; f < backgroundGroup.length; f++){
                            backgroundGroup.children[f].children[1].alpha = 1
                        }
                        //console.log('inicio el juego')
                        initGame()
                    }
                })
            },this)
        }
        else{
            sound.play('wrongAnswer')
        }
    }
    
	return {
		
		assets: assets,
		name: "noisyMonsters",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            noisySong = game.add.audio('noisySong')
            game.sound.setDecodedCallback(noisySong, function(){
                noisySong.loopFull(0.5)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            xBox()
            tnt()
            bigTool()
            silenceMeter()
            initCoin()
            createParticles()
			
			buttons.getButton(noisySong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()