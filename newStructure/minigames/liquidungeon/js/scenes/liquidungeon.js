
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var liquidungeon = function(){
    
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
                name: "atlas.liquidungeon",
                json: "images/liquidungeon/atlas.json",
                image: "images/liquidungeon/atlas.png",
            },
             {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }

        ],
        images: [

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
            {	name: "whoosh",
				file: soundsPath + "whoosh.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 123
    var overlayGroup
    var liquidSong
    var coin
    var states
    var fontStyle
    var transforms = {liquid: 0, solid: 1, gas: 2}
    var water
    var waterCollider
    var wall
    var speed
    var wallGroup
    var stop
    var col
    var saveSpeed
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        wall = -1
        speed = 1.5
        stop = false
        col = false
        saveSpeed = speed
        
        if(localization.getLanguage() === 'EN'){
            states = ['Liquid', 'Solid', 'Gas'] 
            fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        }
        else{
            states = ['Líquido', 'Solido', 'Gaseoso'] 
            fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.liquidungeon','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.liquidungeon','life_box')

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
        liquidSong.stop()
        		
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
        
        game.load.audio('liquidSong', soundsPath + 'songs/kids_and_videogame.mp3');
        
		/*game.load.image('howTo',"images/liquidungeon/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/liquidungeon/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/liquidungeon/introscreen.png")*/
		game.load.image('background',"images/liquidungeon/background.png")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        
        game.load.spine("water", "images/spines/water.json")
		
		console.log(localization.getLanguage() + ' language')

        game.load.image('tutorial_image',"images/liquidungeon/tutorial_image.png")
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
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.liquidungeon','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.liquidungeon',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.liquidungeon','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        initGame()
    }
    
	function createBackground(){
        
        var back = sceneGroup.create(0,0, 'background')
        back.width = game.world.width
        back.height = game.world.height
        
        floor = game.add.tileSprite(0, game.world.height, game.world.width, 400, "atlas.liquidungeon", 'floor')
        floor.anchor.setTo(0, 1)
        sceneGroup.add(floor)
        
        clouds = game.add.tileSprite(0, 0, game.world.width, 270, "atlas.liquidungeon", "clouds")
        clouds.alpha = 0.5
        sceneGroup.add(clouds)
    }

	function update(){
        
        clouds.tilePosition.x -= speed * 0.1
        floor.tilePosition.x -= speed
        
        game.physics.arcade.overlap(waterCollider, wallGroup, waterVSwall, null, this)
        game.physics.arcade.overlap(waterCollider, wallGroup.children[2], waterVSwall, null, this)
        
    }
    
    function waterVSwall(water, walls){
        
        waterCollider.body.enable = false
        col = true
        stop = true
        saveSpeed = speed
        speed = 0
        win(false)
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
        particle.makeParticles('atlas.liquidungeon',key);
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

				particle.makeParticles('atlas.liquidungeon',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.liquidungeon','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.liquidungeon','smoke');
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
        
        coin.x = waterCollider.centerX
        coin.y = waterCollider.centerY
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
    
    function initButtons(){
        
        for(var b = -1; b < 2; b++){
            
            var buttonGroup = game.add.group()
            buttonGroup.x = game.world.centerX + 170 * b 
            buttonGroup.y = game.world.height - 80
            sceneGroup.add(buttonGroup)
            
            var stateBtn = buttonGroup.create(0, 0, "atlas.liquidungeon", "btn")
            stateBtn.anchor.setTo(0.5)
            stateBtn.elementalState = b + 1
            stateBtn.inputEnabled = true
            stateBtn.events.onInputDown.add(changeFace, this)
            
            var mesage = new Phaser.Text(sceneGroup.game, 0, 0, '0', fontStyle)
            mesage.anchor.setTo(0.5)
            mesage.y = stateBtn.y
            mesage.x = stateBtn.x
            mesage.setText(states[b + 1])
            buttonGroup.add(mesage)
        }
    }
    
    function changeFace(btn){
        
        if(gameActive){
            gameActive = false
            game.add.tween(btn.parent.scale).to({x:0.5, y:0.5}, 150, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                sound.play('cut')
                digievolucion(btn.elementalState)
                game.add.tween(btn.parent.scale).to({x: 1, y: 1}, 150, Phaser.Easing.linear, true).onComplete.add(function(){
                    gameActive = true
                })
            })
        }
    }
    
    function digievolucion(shape){
        
        switch(shape){
                
            case transforms.liquid:
                if(water.form === transforms.solid){
                    water.setAnimationByName(0, "SOLID_TO_LIQUID", false)
                }
                else if(water.form === transforms.gas){
                    water.setAnimationByName(0, "GAS_TO_LIQUID", false)
                    game.add.tween(water).to({ y: game.world.centerY + 240}, 300, Phaser.Easing.linear,true)
                }
                water.addAnimationByName(0, "IDLE_LIQUID", true)
                water.form = transforms.liquid
                waterCollider.y = game.world.centerY + 240
                break
                
            case transforms.solid:
                if(water.form === transforms.liquid){
                    water.setAnimationByName(0, "LIQUID_TO_SOLID", false)
                }
                else if(water.form === transforms.gas){
                    water.setAnimationByName(0, "GAS_TO_SOLID", false)
                    game.add.tween(water).to({ y: game.world.centerY + 240}, 300, Phaser.Easing.linear,true)
                }
                water.addAnimationByName(0, "IDLE_SOLID", true)
                water.form = transforms.solid
                waterCollider.y = game.world.centerY + 180
                break
                
            case transforms.gas:
                if(water.form === transforms.liquid){
                    water.setAnimationByName(0, "LIQUID_TO_GAS", false)
                }
                else if(water.form === transforms.solid){
                    water.setAnimationByName(0, "SOLID_TO_GAS", false)
                }
                water.addAnimationByName(0, "IDLE_GAS", true)
                water.form = transforms.gas
                game.add.tween(water).to({ y: 250}, 300, Phaser.Easing.linear,true)
                waterCollider.y = 200
                break
        }
        sound.play('whoosh')
    }
    
    function lost(){
        
        switch(water.form){
                
            case transforms.liquid:
                water.setAnimationByName(0, "LOSE_LIQUID", false)
                break
                
            case transforms.solid:
                water.setAnimationByName(0, "LOSE_SOLID", false)
                break
                
            case transforms.gas:
                water.setAnimationByName(0, "LOSE_GAS", false)
                break
        }
    }
    
    function reborn(){
        
        switch(game.rnd.integerInRange(0, 2)){
                
            case transforms.liquid:
                water.y = game.world.centerY + 240
                water.form = transforms.liquid
                water.addAnimationByName(0, "IDLE_LIQUID", true)
                waterCollider.y = game.world.centerY + 240
                break
                
            case transforms.solid:
                water.y = game.world.centerY + 240
                water.form = transforms.solid
                water.addAnimationByName(0, "IDLE_SOLID", true)
                waterCollider.y = game.world.centerY + 180
                break
                
            case transforms.gas:
                water.y = 250
                water.form = transforms.gas
                water.addAnimationByName(0, "IDLE_GAS", true)
                waterCollider.y = 200
                break
        }
    }
    
    function H2O(){
        
        water = game.add.spine(100, game.world.centerY + 240, "water")
        water.scale.setTo(0.8)
        water.setAnimationByName(0, "IDLE_LIQUID", true)
        water.setSkinByName("normal")
        water.form = transforms.liquid
        sceneGroup.add(water)
        
        waterCollider = sceneGroup.create(160, game.world.centerY + 240, "atlas.liquidungeon", "star")
        waterCollider.anchor.setTo(0.5)
        waterCollider.scale.setTo(0.5)
        waterCollider.alpha = 0
        game.physics.arcade.enable(waterCollider)
      
    }
    
    function theWall(){
        
        wallGroup = game.add.group()
        wallGroup.startPos = game.world.width + 150
        wallGroup.enableBody = true
        wallGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(wallGroup)
        
        var liquid = wallGroup.create(wallGroup.startPos, 0, 'atlas.liquidungeon', 'liquid')
        liquid.alpha = 0
        liquid.anchor.setTo(1, 0)
        
        var gas = wallGroup.create(wallGroup.startPos, game.world.height, 'atlas.liquidungeon', 'liquid')
        gas.alpha = 0
        gas.scale.setTo(-1)
        
        var solid = game.add.group()
        solid.x = wallGroup.startPos
        solid.alpha = 0
        solid.enableBody = true
        solid.physicsBodyType = Phaser.Physics.ARCADE
        wallGroup.add(solid)
        
        var solidus = solid.create(0, 0, 'atlas.liquidungeon', 'solid')
        solidus.anchor.setTo(1, 0)
        
        var sewer = solid.create(15, game.world.centerY + 210, 'atlas.liquidungeon', 'sewer')
        sewer.scale.setTo(0.8)
        sewer.anchor.setTo(1, 0)
        sewer.body.enable = false
        
        var sewerCol = solid.create(20, game.world.centerY + 220, 'atlas.liquidungeon', 'star')
        sewerCol.anchor.setTo(0.5)
        sewerCol.scale.setTo(0.5)
        sewerCol.alpha = 0
    }
    
    function moveIt(){

        game.time.events.add(15,function(){
            
            if(wallGroup.children[wall].x > 0){
                wallGroup.children[wall].x -= speed 
            }
            else{
                stop = true
                wallGroup.children[wall].x = wallGroup.startPos
                if(!col)
                    win(true)
            }
            
            if(!stop){
                moveIt()
            }

        }, this)
    }
    
    function win(ans){
        
        if(ans){
            addCoin()
            if(speed <= 3.5){
                speed += 0.5
            }
            else if(pointsBar.number % 10 === 0){
                speed += 1
            }
            game.time.events.add(1000,function(){
                initGame()
            },this)
        }
        else{
            missPoint()
            lost()
            if(lives !== 0){
                game.time.events.add(1000,function(){
                    game.add.tween(floor.tilePosition).to({ x: -100}, 500, Phaser.Easing.linear,true)
                    game.add.tween(clouds.tilePosition).to({ x: -100}, 500, Phaser.Easing.linear,true)
                    game.add.tween(wallGroup.children[wall]).to({ x: 0}, 500, Phaser.Easing.linear,true).onComplete.add(function(){
                        wallGroup.children[wall].x = wallGroup.startPos
                        speed = saveSpeed 
                        game.time.events.add(1300,function(){
                            reborn()
                            initGame()
                        },this)
                    })
                 },this)
            }
        }
    }
    
    function initGame(){

        gameActive = true
        waterCollider.body.enable = true
        stop = false
        col = false
        wall = getRand()
        changeImage(wall, wallGroup)
        moveIt()
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === wall)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "liquidungeon",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.ARCADE)
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            liquidSong = game.add.audio('liquidSong')
            game.sound.setDecodedCallback(liquidSong, function(){
                liquidSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			    
            theWall()
			createPointsBar()
			createHearts()
            initButtons()
            H2O()
            createParticles()
            initCoin()
			
			buttons.getButton(liquidSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()