
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
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var battleSong
    var witch
    var gems
    var aquaGem, fireGem, iceGem, windGem
    var aquaShield, fireShield, iceShield, windShield
    var enemyMask
	var elements = {aqua: 0, fire: 1, ice: 2, wind: 3}
    var level
    var shieldHits
    var speed
    var enemySelect

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3

        level = 3
        shieldHits = 2
        speed = 1
        enemySelect =  game.rnd.integerInRange(0, 3)
        
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
        
        game.load.spine("witch", "images/spines/Witch/witch.json");
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
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.elemental','gametuto')
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
		
		dock = sceneGroup.create(game.world.centerX, game.world.centerY, "dock")
        dock.anchor.setTo(0.5, 0.5)
        //dock.scale.setTo(1, 1)
        
        tree1 = sceneGroup.create(0, 1, "atlas.elemental",  "tree1")
        //tree1.anchor.setTo(0.5, 0)
        tree1.x = game.world.centerX + dock.width * 0.25
        
        tree2 = sceneGroup.create(0, 1, "atlas.elemental",  "tree2")
        //tree2.anchor.setTo(0.5, 0)
        tree2.x = game.world.centerX - dock.width * 0.5
        
        tree3 = sceneGroup.create(0, dock.y, "atlas.elemental",  "tree3")
        tree3.anchor.setTo(0, 0.5)
        tree3.x = game.world.centerX - dock.width * 0.5
	}
	
	function update(){
        enemyMask.y -= 1
        
        game.physics.arcade.collide(gems, enemyMask, coll, null, this)
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
        }
        
        
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
        
        var witchSpine = game.add.spine(game.world.centerX, 240, "witch")
        //witch.scale.setTo(0.9, 0.9)
        witchSpine.setAnimationByName(0, "IDLE", true)
        witchSpine.setSkinByName("normal")
        sceneGroup.add(witchSpine)
        
        witch = sceneGroup.create(game.world.centerX, 150, 'atlas.elemental', "star");
        witch.anchor.setTo(0.5, 0.5)
        //witch.scale.setTo(3.2, 3.2)
        //witch.alpha = 0
        game.physics.arcade.enable(witch)
        witch.body.immovable = true
        
    }
    
    function elementalGems(){
        
        gems = game.add.physicsGroup()
        gems.enableBody = true
        gems.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(gems)  
        
        fireGem = gems.create(0, 0, 'atlas.elemental', "fireGem");
        fireGem.anchor.setTo(0.5, 0.5)
        fireGem.x = game.world.centerX - dock.x * 0.25
        fireGem.y = dock.y * 0.35
        fireGem.inputEnabled = true
        fireGem.element = elements.fire
        fireGem.events.onInputUp.add(shootGem)
        game.physics.enable(fireGem, Phaser.Physics.ARCADE)
        
        /*game.time.events.loop(4000,function(){
            
            game.add.tween(fireGem).to({y:fireGem.y + 10}, 2000, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(fireGem).to({y:fireGem.y - 10}, 2000, Phaser.Easing.linear, true)
            })
        },this)*/
        
        aquaGem = gems.create(0, 0, 'atlas.elemental', "aquaGem");
        aquaGem.anchor.setTo(0.5, 0.5)
        aquaGem.x = game.world.centerX - dock.x * 0.1
        aquaGem.y = dock.y * 0.6
        aquaGem.inputEnabled = true
        aquaGem.element = elements.aqua
        aquaGem.events.onInputUp.add(shootGem)
        game.physics.enable(aquaGem, Phaser.Physics.ARCADE)
        
        /*game.time.events.loop(3000,function(){
            
            game.add.tween(aquaGem).to({y:aquaGem.y + 10}, 1500, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(aquaGem).to({y:aquaGem.y - 10}, 1500, Phaser.Easing.linear, true)
            })
        },this)*/
        
        iceGem = gems.create(0, 0, 'atlas.elemental', "iceGem");
        iceGem.anchor.setTo(0.5, 0.5)
        iceGem.x = game.world.centerX + dock.x * 0.1
        iceGem.y = dock.y * 0.6
        iceGem.inputEnabled = true
        iceGem.element = elements.ice
        iceGem.events.onInputUp.add(shootGem)
        game.physics.enable(iceGem, Phaser.Physics.ARCADE)
        
        /*game.time.events.loop(4000,function(){
            
            game.add.tween(iceGem).to({y:iceGem.y + 10}, 2000, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(iceGem).to({y:iceGem.y - 10}, 2000, Phaser.Easing.linear, true)
            })
        },this)*/
        
        windGem = gems.create(0, 0, 'atlas.elemental', "windGem");
        windGem.anchor.setTo(0.5, 0.5)
        windGem.x = game.world.centerX + dock.x * 0.25
        windGem.y = dock.y * 0.35
        windGem.inputEnabled = true
        windGem.element = elements.wind
        windGem.events.onInputUp.add(shootGem)
        game.physics.enable(windGem, Phaser.Physics.ARCADE)
        
        /*game.time.events.loop(3000,function(){
            
            game.add.tween(windGem).to({y:windGem.y + 10}, 1500, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(windGem).to({y:windGem.y - 10}, 1500, Phaser.Easing.linear, true)
            })
        },this)*/
    }
    
    function shootGem(obj){
        
        var tmpX = obj.x
        var tmpY = obj.y
 
        game.add.tween(obj).to({x:enemyMask.x, y:enemyMask.y}, 200, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                game.add.tween(obj).to({x:tmpX, y:tmpY}, 200, Phaser.Easing.linear, true)
            })
        obj.body.enable = true
    }
    
    function enemiesMask(){
        
        enemyMask = game.add.physicsGroup()
        enemyMask.x = game.world.centerX
        enemyMask.y = game.world.height + 100
        enemyMask.enableBody = true
        enemyMask.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(enemyMask)  
        
        //crear un nuevo grupo independiente para el escudo
        
        windEnemy()
    }
    
    function fireEnemy(){
        
        var fire = enemyMask.create(0, 25, 'atlas.elemental', 'fireMask')
        fire.alpha = 0
        fire.anchor.setTo(0.5, 1)
        fire.body.immovable = true
        fire.element = elements.fire
        game.physics.enable(fire, Phaser.Physics.ARCADE)
        
        var fireMask = game.add.spine(0, 0, "fire")
        //fireMask.scale.setTo(0.9, 0.9)
        fireMask.setAnimationByName(0, "IDLE", true)
        fireMask.setSkinByName("normal")
        enemyMask.add(fireMask)
        
        if(level > 2){
            fireShield = enemyMask.create(0, 25, 'atlas.elemental', 'fireShield')
            fireShield.anchor.setTo(0.5, 1)
            fireShield.body.immovable = true
            fireShield.element = elements.fire
            game.physics.enable(fireShield, Phaser.Physics.ARCADE)
        }
    }
    
    function aquaEnemy(){
        
        var aqua = enemyMask.create(0, 25, 'atlas.elemental', 'aquaMask')
        aqua.alpha = 0
        aqua.anchor.setTo(0.5, 1)
        aqua.body.immovable = true
        aqua.element = elements.aqua
        game.physics.enable(aqua, Phaser.Physics.ARCADE)
        
        var aquaMask = game.add.spine(0, 0, "aqua")
        //fireMask.scale.setTo(0.9, 0.9)
        aquaMask.setAnimationByName(0, "IDLE", true)
        aquaMask.setSkinByName("normal")
        enemyMask.add(aquaMask)
        
        if(level > 2){
            aquaShield = enemyMask.create(0, -50, 'atlas.elemental', 'aquaShield')
            aquaShield.anchor.setTo(0.5, 1)
            aquaShield.body.immovable = true
            aquaShield.element = elements.aqua
            game.physics.enable(aquaShield, Phaser.Physics.ARCADE)
        }
    }
    
    function iceEnemy(){
        
        var ice = enemyMask.create(0, 25, 'atlas.elemental', 'iceMask')
        ice.alpha = 0
        ice.anchor.setTo(0.5, 1)
        ice.body.immovable = true
        ice.element = elements.ice
        game.physics.enable(ice, Phaser.Physics.ARCADE)
        
        var iceMask = game.add.spine(0, 0, "ice")
        //fireMask.scale.setTo(0.9, 0.9)
        iceMask.setAnimationByName(0, "IDLE", true)
        iceMask.setSkinByName("normal")
        enemyMask.add(iceMask)
        
        if(level > 2){
            iceShield = enemyMask.create(0, -10, 'atlas.elemental', 'iceShield')
            iceShield.anchor.setTo(0.5, 1)
            iceShield.body.immovable = true
            iceShield.element = elements.ice
            game.physics.enable(iceShield, Phaser.Physics.ARCADE)
        }
    }
    
    function windEnemy(){
        
        var wind = enemyMask.create(0, 25, 'atlas.elemental', 'windMask')
        wind.alpha = 0
        wind.anchor.setTo(0.5, 1)
        wind.body.immovable = true
        wind.element = elements.wind
        game.physics.enable(wind, Phaser.Physics.ARCADE)
        
        var windMask = game.add.spine(0, 0, "wind")
        //fireMask.scale.setTo(0.9, 0.9)
        windMask.setAnimationByName(0, "IDLE", true)
        windMask.setSkinByName("normal")
        enemyMask.add(windMask)
        
        if(level > 2){
            windShield = enemyMask.create(0, 25, 'atlas.elemental', 'windShield')
            windShield.anchor.setTo(0.5, 1)
            windShield.body.immovable = true
            windShield.element = elements.wind
            game.physics.enable(windShield, Phaser.Physics.ARCADE)
        }
    }
    
    function initGame(){
        switch(enemySelect)
        {

        }
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x == enemySelect)
            return getRand()
        else 
            enemySelect = x
        
        return enemySelect     
    }
    
    function coll(gems, enemyMask){

        gems.body.enable = false
        console.log(enemyMask.element)
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