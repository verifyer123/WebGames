
var soundsPath = "../../shared/minigames/sounds/"
var elemental = function(){
    
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
                name: "atlas.elemental",
                json: "images/elemental/atlas.json",
                image: "images/elemental/atlas.png",
            },
        ],
        images: [
            {
                name: "dock",
                file: "images/elemental/dock.png",
            }
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "glassbreak",
				file: soundsPath + "glassbreak.mp3"},
			{	name: "cut",
				file: soundsPath + "cut.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 104
	var indexGame
    var overlayGroup
    var battleSong
    var witch
    var witchAnimation
    var IDLE, ATTACK
    var gems
    var aquaGem, fireGem, iceGem, windGem
    var enemyMask
	var elements = {aqua: 0, fire: 1, ice: 2, wind: 3}
    var level
    var enemyHP
    var speed
    var enemySelect
    var weves
    var count
    var score

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3

        level = 1
        speed = 1
        enemySelect =  game.rnd.integerInRange(0, 3)
        count = 0
        score = 0
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.elemental','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.elemental','life_box')

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
        battleSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }    
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('battleSong', soundsPath + 'songs/battleSong.mp3');
        
		game.load.image('howTo',"images/elemental/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/elemental/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/elemental/introscreen.png")
        
        game.load.spritesheet('IDLE', 'images/sprites/IDLE.png', 240, 287, 23);
        game.load.spritesheet('LOSESTILL', 'images/sprites/LOSESTILL.png', 260, 272, 8);
        game.load.spritesheet('HIT', 'images/sprites/HIT.png', 260, 294, 5);
        game.load.spritesheet('LOSE', 'images/sprites/LOSE.png', 262, 365, 9);
        game.load.spritesheet('ATTACK', 'images/sprites/ATTACK.png', 328, 300, 11);
        
        game.load.spine("fire", "images/spines/MaskFire/mask_fire.json");
        game.load.spine("aqua", "images/spines/MaskWater/mask_water.json");
        game.load.spine("ice", "images/spines/MaskIce/mask_ice.json");
        game.load.spine("wind", "images/spines/MaskWind/mask_air.json");
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
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
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50, 'atlas.elemental',  'gametuto')
        tuto.scale.setTo(0.8, 0.8)
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.elemental',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.elemental','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
        back = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.elemental", "background");
        back.anchor.setTo(0.5, 0.5)
        back.width = game.world.width
        back.height = game.world.height
        
        weves = game.add.tileSprite(0, 0, game.world.width * 2, game.world.height, "atlas.elemental", 'wave')
        weves.anchor.setTo(0.5, 0)
        sceneGroup.add(weves)
        
		dock = game.add.sprite(game.world.centerX, game.world.centerY, "dock")
        dock.anchor.setTo(0.5, 0.5)
        //dock.scale.setTo(1, 1)
        
        tree1 = sceneGroup.create(0, 2, "atlas.elemental",  "tree1")
        //tree1.anchor.setTo(0.5, 0)
        tree1.x = game.world.centerX - dock.width * 0.58
        
        tree2 = sceneGroup.create(0, 2, "atlas.elemental",  "tree2")
        //tree2.anchor.setTo(0.5, 0)
        tree2.x = game.world.centerX + dock.width * 0.35
        
        tree3 = sceneGroup.create(0, dock.y - 20, "atlas.elemental",  "tree3")
        tree3.anchor.setTo(0, 0.5)
        tree3.x = game.world.centerX + dock.width * 0.36
        
        sceneGroup.add(dock)
	}
	
	function update(){
        enemyMask.y -= speed
        
        game.physics.arcade.collide(gems, enemyMask, attackMask, null, this)
        game.physics.arcade.collide(witch, enemyMask, getDamage, null, this)
        
        count += 0.005
        weves.tileScale.x = 2 + Math.sin(count)
        weves.tileScale.y = 2 + Math.cos(count)
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

        particle.makeParticles('atlas.elemental',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

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

				particle.makeParticles('atlas.elemental',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.elemental','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.elemental','smoke');
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
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
    function initWitch(){
        
        witchAnimation = game.add.sprite(game.world.centerX, 150, 'IDLE')
        witchAnimation.anchor.setTo(0.5, 0.5)
        witchAnimation.animations.add('IDLE', null, 12, true)
        witchAnimation.animations.add('ATTACK', null, 18, true)
        witchAnimation.animations.add('LOSESTILL', null, 12, true)
        witchAnimation.animations.add('HIT', null, 12, true)
        witchAnimation.animations.add('LOSE', null, 12, true)
        sceneGroup.add(witchAnimation)
                
        witchAnimation.play('IDLE')
        
        witch = sceneGroup.create(game.world.centerX, 150, 'atlas.elemental', "background");
        witch.anchor.setTo(0.5, 0.5)
        witch.scale.setTo(2.5, 0.2)
        witch.alpha = 0
        game.physics.arcade.enable(witch)
        witch.body.immovable = true
        
    }
    
    function witchAnim(anim){
        
        switch(anim){
        case 'IDLE':
            witchAnimation.loadTexture('IDLE', 0, true)
            witchAnimation.play('IDLE')
        break
        
        case 'ATTACK':
            witchAnimation.loadTexture('ATTACK', 0, true)
            witchAnimation.play('ATTACK')
        break
        
        case 'LOSESTILL':
            witchAnimation.loadTexture('LOSESTILL', 0, true)
            witchAnimation.play('LOSESTILL')
        break
        
        case 'HIT':
            witchAnimation.loadTexture('HIT', 0, true)
            witchAnimation.play('HIT')
        break
        
        case 'LOSE':
            witchAnimation.loadTexture('LOSE', 0, true)
            witchAnimation.play('LOSE')
        break
        }
    }
    
    function elementalGems(){
        
        gems = game.add.physicsGroup()
        gems.enableBody = true
        gems.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(gems)  
        
        fireGem = gems.create(0, 0, 'atlas.elemental', "fireGem");
        fireGem.anchor.setTo(0.5, 0.5)
        fireGem.x = game.world.centerX - 150
        fireGem.y = dock.y * 0.35
        fireGem.inputEnabled = true
        fireGem.shooted = false
        fireGem.element = elements.fire
        fireGem.events.onInputUp.add(shootGem)
        game.physics.enable(fireGem, Phaser.Physics.ARCADE)
        
        fireGem.tween = game.add.tween(fireGem).to({y:fireGem.y + 10}, 2000, Phaser.Easing.linear, true)
        
        fireGem.tween.onComplete.add(function() 
        {
            game.add.tween(fireGem).to({y:fireGem.y - 10}, 2000, Phaser.Easing.linear, true).onComplete.add(function(){
                fireGem.tween.start()
            })
        })
        
        aquaGem = gems.create(0, 0, 'atlas.elemental', "aquaGem");
        aquaGem.anchor.setTo(0.5, 0.5)
        aquaGem.x = game.world.centerX - 70
        aquaGem.y = dock.y * 0.6
        aquaGem.inputEnabled = true
        aquaGem.shooted = false
        aquaGem.element = elements.aqua
        aquaGem.events.onInputUp.add(shootGem)
        game.physics.enable(aquaGem, Phaser.Physics.ARCADE)
        
        aquaGem.tween = game.add.tween(aquaGem).to({y:aquaGem.y + 10}, 2000, Phaser.Easing.linear, true)
        
        aquaGem.tween.onComplete.add(function() 
        {
            game.add.tween(aquaGem).to({y:aquaGem.y - 10}, 2000, Phaser.Easing.linear, true).onComplete.add(function(){
                aquaGem.tween.start()
            })
        })
        
        iceGem = gems.create(0, 0, 'atlas.elemental', "iceGem");
        iceGem.anchor.setTo(0.5, 0.5)
        iceGem.x = game.world.centerX + 70
        iceGem.y = dock.y * 0.6
        iceGem.inputEnabled = true
        iceGem.shooted = false
        iceGem.element = elements.ice
        iceGem.events.onInputUp.add(shootGem)
        game.physics.enable(iceGem, Phaser.Physics.ARCADE)
        
        iceGem.tween = game.add.tween(iceGem).to({y:iceGem.y + 10}, 2000, Phaser.Easing.linear, true)
        
        iceGem.tween.onComplete.add(function() 
        {
            game.add.tween(iceGem).to({y:iceGem.y - 10}, 2000, Phaser.Easing.linear, true).onComplete.add(function(){
                iceGem.tween.start()
            })
        })
        
        windGem = gems.create(0, 0, 'atlas.elemental', "windGem");
        windGem.anchor.setTo(0.5, 0.5)
        windGem.x = game.world.centerX + 150 
        windGem.y = dock.y * 0.35
        windGem.inputEnabled = true
        windGem.shooted = false
        windGem.element = elements.wind
        game.physics.enable(windGem, Phaser.Physics.ARCADE)
        
        windGem.tween = game.add.tween(windGem).to({y:windGem.y + 10}, 2000, Phaser.Easing.linear, true)
        
        windGem.tween.onComplete.add(function() 
        {
            game.add.tween(windGem).to({y:windGem.y - 10}, 2000, Phaser.Easing.linear, true).onComplete.add(function(){
                windGem.tween.start()
            })
        })
        
        windGem.events.onInputUp.add(shootGem, this)
    }
    
    function shootGem(gem){
        
        witchAnim('ATTACK')
        
        game.time.events.add(700, function(){
            witchAnim('IDLE')
        }, this)
       
        sound.play("cut")
        gem.shooted = true
        
        gem.tween.pause()
        
        var tmpX = gem.x
        var tmpY = gem.y
 
        game.add.tween(gem).to({x:enemyMask.x, y:enemyMask.y}, 200, Phaser.Easing.linear, true).onComplete.add(function() 
        {
            game.add.tween(gem).to({x:tmpX, y:tmpY}, 200, Phaser.Easing.linear, true).onComplete.add(function(){gem.tween.resume()})
        })
        
        gem.body.enable = true
    }
    
    function enemiesMask(){
        
        enemyMask = game.add.physicsGroup()
        enemyMask.x = game.world.centerX
        enemyMask.y = game.world.height + 300
        enemyMask.enableBody = true
        enemyMask.physicsBodyType = Phaser.Physics.ARCADE
        game.physics.arcade.enable(enemyMask)
        sceneGroup.add(enemyMask)  
    }
    
    function aquaEnemy(){
        
        var aquaMask = game.add.spine(0, 0, "aqua")
        //aquaMask.scale.setTo(0.9, 0.9)
        aquaMask.setAnimationByName(0, "IDLE", true)
        aquaMask.setSkinByName("normal")
        enemyMask.add(aquaMask)
        
        var aqua = enemyMask.create(0, 25, 'atlas.elemental', 'aquaMask')
        aqua.alpha = 0
        aqua.anchor.setTo(0.5, 1)
        aqua.body.immovable = true
        aqua.element = elements.aqua
        game.physics.enable(aqua, Phaser.Physics.ARCADE)
        
        if(level > 1){
            var aquaShield = enemyMask.create(0, -50, 'atlas.elemental', 'aquaShield')
            aquaShield.anchor.setTo(0.5, 1)
            aquaShield.element = elements.aqua

            var aquaShield2 = enemyMask.create(0, -50, 'atlas.elemental', 'aquaShieldBroken')
            aquaShield2.anchor.setTo(0.5, 1)
            aquaShield2.alpha = 0
            aquaShield2.element = elements.aqua
        }
    }
    
    function fireEnemy(){
        
        var fireMask = game.add.spine(0, 0, "fire")
        //fireMask.scale.setTo(0.9, 0.9)
        fireMask.setAnimationByName(0, "IDLE", true)
        fireMask.setSkinByName("normal")
        enemyMask.add(fireMask)
        
        var fire = enemyMask.create(0, 25, 'atlas.elemental', 'fireMask')
        fire.alpha = 0
        fire.anchor.setTo(0.5, 1)
        fire.body.immovable = true
        fire.element = elements.fire
        game.physics.enable(fire, Phaser.Physics.ARCADE)
        
        if(level > 1){
            var fireShield = enemyMask.create(0, 2, 'atlas.elemental', 'fireShield')
            fireShield.anchor.setTo(0.5, 1)
            fireShield.element = elements.fire

            var fireShield2 = enemyMask.create(0, 2, 'atlas.elemental', 'fireShieldBroken')
            fireShield2.anchor.setTo(0.5, 1)
            fireShield2.alpha = 0
            fireShield2.element = elements.fire
        }
    }
    
    function iceEnemy(){
        
        var iceMask = game.add.spine(0, 0, "ice")
        //fireMask.scale.setTo(0.9, 0.9)
        iceMask.setAnimationByName(0, "IDLE", true)
        iceMask.setSkinByName("normal")
        enemyMask.add(iceMask)
        
        var ice = enemyMask.create(0, 25, 'atlas.elemental', 'iceMask')
        ice.alpha = 0
        ice.anchor.setTo(0.5, 1)
        ice.body.immovable = true
        ice.element = elements.ice
        game.physics.enable(ice, Phaser.Physics.ARCADE)
        
        if(level > 1){
            var iceShield = enemyMask.create(0, -10, 'atlas.elemental', 'iceShield')
            iceShield.anchor.setTo(0.5, 1)
            iceShield.element = elements.ice
            
            var iceShield2 = enemyMask.create(0, -10, 'atlas.elemental', 'iceShieldBroken')
            iceShield2.anchor.setTo(0.5, 1)
            iceShield2.alpha = 0
            iceShield2.element = elements.ice
        }
    }
    
    function windEnemy(){
        
        var windMask = game.add.spine(0, 0, "wind")
        //fireMask.scale.setTo(0.9, 0.9)
        windMask.setAnimationByName(0, "IDLE", true)
        windMask.setSkinByName("normal")
        enemyMask.add(windMask)
        
        var wind = enemyMask.create(0, 25, 'atlas.elemental', 'windMask')
        wind.alpha = 0
        wind.anchor.setTo(0.5, 1)
        wind.body.immovable = true
        wind.element = elements.wind
        game.physics.enable(wind, Phaser.Physics.ARCADE)
        
        if(level > 1){
            var windShield = enemyMask.create(0, 25, 'atlas.elemental', 'windShield')
            windShield.anchor.setTo(0.5, 1)
            windShield.element = elements.wind
            
            var windShield2 = enemyMask.create(0, 25, 'atlas.elemental', 'windShieldBroken')
            windShield2.anchor.setTo(0.5, 1)
            windShield2.alpha = 0
            windShield2.element = elements.wind
        }
    }
    
    function initGame(){
        
        enemyMask.y = game.world.height + 250
        enemyMask.x = game.rnd.integerInRange(dock.centerX - dock.width * 0.4, dock.centerX + dock.width * 0.4)
        witch.body.enable = true
        
        gems.setAll('inputEnabled', true)
        
        enemyHP = level
        
        if(level > 2){
            enemyHP = 3
            if(speed < 11)
                speed += 0.5
        }
        
        switch(enemySelect)
        {
            case 0: aquaEnemy()
            break;
            case 1: fireEnemy()
            break;
            case 2: iceEnemy()
            break;
            case 3: windEnemy()
            break;
        }
        
        enemySelect = getRand()
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === enemySelect)
            return getRand()
        else
            return x     
    }
    
    function attackMask(gem, enemyMask){

        gem.body.enable = false
        var auxSpeed = speed
        
        if(gem.element === enemyMask.element && gem.shooted){
            
            particleCorrect.x = enemyMask.parent.x
            particleCorrect.y = enemyMask.parent.y - 100
            particleCorrect.start(true, 1000, null, 4)
            
            enemyHP--
            
            switch(enemyHP){
                case 0:
                    sound.play("right")
                    enemyMask.parent.children[0].setAnimationByName(0, "LOSE", false)
                    speed = 0
                    score++
                    
                    if(score % 3 === 0)
                        addPoint(1)
                    
                    game.time.events.add(1700, function() 
                    {
                        enemyMask.parent.removeAll(true)
                        speed = auxSpeed
                        level++
                        initGame()
                    }, this)
                break
                
                case 1:
                    sound.play("glassbreak")
                    speed = -10
                    enemyMask.parent.children[2].alpha = 0
                    enemyMask.parent.children[3].alpha = 0
                    game.time.events.add(300, function() 
                    {
                        speed = auxSpeed
                    }, this)
                break
                
                case 2:
                    sound.play("glassbreak")
                    speed = -10
                    enemyMask.parent.children[2].alpha = 0
                    enemyMask.parent.children[3].alpha = 1
                    game.time.events.add(300, function() 
                    {
                        speed = auxSpeed
                    }, this)
                break
            }
            
        }
        else if(gem.shooted){
            speed = 0
            missPoint()
            particleWrong.x = enemyMask.parent.x
            particleWrong.y = enemyMask.parent.y - 200
            particleWrong.start(true, 1000, null, 4)  
            game.time.events.add(600, function() 
            {
                speed = auxSpeed
            }, this)
        }
        
        gem.shooted = false
    }
    
    function getDamage(witch, enemyMask){
        
        witch.body.enable = false
        speed = 0
        gems.setAll('inputEnabled', false)
        game.add.tween(enemyMask.parent).to({x:game.world.centerX, y:-50}, 500, Phaser.Easing.linear, true)
        
        if(lives > 1){
            witchAnim('HIT')
            missPoint()
            score = 0
            
            game.time.events.add(600, function(){
                witchAnim('IDLE')
            }, this)
            
            game.time.events.add(600, function() {
                speed = 3 
                enemyMask.parent.removeAll(true)
                initGame()
            }, this)
        }
        else{
            witchAnim('LOSE')
            game.time.events.add(900, function(){
                witchAnim('LOSESTILL')
            }, this)
            
            game.time.events.add(1300, function() {
                missPoint()
            }, this)
        }
        
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
	return {
		
		assets: assets,
		name: "elemental",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            battleSong = game.add.audio('battleSong')
            game.sound.setDecodedCallback(battleSong, function(){
                battleSong.loopFull(0.6)
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
            initWitch()
			elementalGems()
            enemiesMask()
            createParticles()
            
			buttons.getButton(battleSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()