
var soundsPath = "../../shared/minigames/sounds/"
var particlesPath="../../shared/minigames/images/particles/battle/"
var galaxyJumper = function(){
    
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
                name: "atlas.galaxy",
                json: "images/galaxy/atlas.json",
                image: "images/galaxy/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/galaxy/timeAtlas.json",
                image: "images/galaxy/timeAtlas.png",
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
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "ship",
				file: soundsPath + "robotBeep.mp3"},
            {	name: "jump",
				file: soundsPath + "powerup.mp3"},
            {	name: "crash",
				file: soundsPath + "explosion.mp3"},
            {	name: "reseting",
				file: soundsPath + "cut.mp3"},
            
			
		],
        jsons: [
			{
				name: 'pickedEnergy', 
				file:  particlesPath + 'pickedEnergy/specialBar1.json'
			}
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 102
	var indexGame
    var overlayGroup
    var spaceSong
    var positions=new Array(8)
    var positionsX=new Array(8)
    var character,actualPosition, characterProxy, starPos, meteorPos,dificulty
    var planets= new Array(8)
    var planetsProxy= new Array(8)
    var planetsPosition= new Array(9)
    var speeds= new Array(10)
    var planetNames= new Array(9)
    var planetsGroups = new Array(9)
    var meteor,star,activePlanets
    var characterActive
    
    
    var backgroundGroup=null
    
    var emitter

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#000000"
        lives = 3
        actualPosition=9
        activePlanets=false
        emitter=""
        starPos=0
        meteorPos=0
        characterActive=true
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.galaxy','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.galaxy','life_box')

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

        spaceSong.stop()
        		
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
        epicparticles.loadEmitter(game.load, "pickedEnergy")
        
        
        game.load.spritesheet("coin", 'images/Spine/coin/coin.png', 122, 123, 12)
        
        game.load.spritesheet("dinoGood", 'images/Spine/dinoGood.png', 210,229, 48)
        game.load.spritesheet("dinoKilled", 'images/Spine/dinoKilled.png', 208, 245, 48)
        game.load.spritesheet("star", 'images/Spine/star.png', 198, 102, 23)
        //game.load.spritesheet("meteor", 'images/Spine/meteor.png', 323, 133, 16)
        
        game.load.audio('spaceSong', soundsPath + 'songs/8-bit-Video-Game.mp3');
        
		game.load.image('howTo',"images/galaxy/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/galaxy/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/galaxy/introscreen.png")
        
        game.load.spine("planets","images/Spine/planets/planets.json")
		
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
            activePlanets=true
            //Aqui va la primera funciòn que realizara el juego
            
            startGame=true
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.galaxy','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'Movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.galaxy',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.galaxy','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
	  
        backgroundGroup = game.add.group()
        movingPlanetsGroup = game.add.group()
        characterGroup = game.add.group()
        
        sceneGroup.add(backgroundGroup)
        sceneGroup.add(movingPlanetsGroup)
        sceneGroup.add(characterGroup)
        
        movingPlanetsGroup.position.x=game.world.centerX
        movingPlanetsGroup.position.y=0
        
        
        for(var place=0; place<planetsGroups.length;place++){
            
            planetsGroups[place]=game.add.group()
            sceneGroup.add(planetsGroups[place])
            planetsGroups[place].position.x=game.world.centerX
            planetsGroups[place].position.y=0
        }
        
        //Aqui inicializo los botones
        controles=game.input.keyboard.createCursorKeys()
        
        
        //Tile del background en este ponemos el fondo
        
        backG=game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.galaxy","tile")
        backgroundGroup.add(backG)
        
        
        
        
        
        
        //Aqui pondre el sol
        
        planetNames[0]="sun";
        planetNames[1]="mercury";
        planetNames[2]="venus";
        planetNames[3]="earth";
        planetNames[4]="mars";
        planetNames[5]="jupiter";
        planetNames[6]="saturn";
        planetNames[7]="uranus";
        planetNames[8]="neptune";
        
        //Aqui inicializo las velocidades
        
        //var fill2=10
        for(var fill=0; fill<10; fill++){
            //speeds[fill]=0.005*(fill2+1)
            speeds[fill]=(Math.random()*0.05)
            //fill2--
        }
        
        
        var where=0
        
        for(var fillPlanets=0; fillPlanets<9; fillPlanets++){
            where=game.rnd.integerInRange(0,100)
            planetsPosition[fillPlanets+1]=fillPlanets
            if(fillPlanets==0){
                planets[fillPlanets]=game.add.spine(0,0,"planets");
            }else{
                planets[fillPlanets]=game.add.spine((fillPlanets-1)+where,(fillPlanets-1)*100+150,"planets");
                planetsProxy[fillPlanets]=game.add.sprite( planets[fillPlanets].x, planets[fillPlanets].y,"atlas.galaxy","tierra")
                planetsProxy[fillPlanets].anchor.setTo(0.5,0.5)
                positions[fillPlanets]=planets[fillPlanets].y
                positionsX[fillPlanets]=120+fillPlanets*2
                planetsGroups[fillPlanets].add(planetsProxy[fillPlanets])
            }
            
            planets[fillPlanets].setSkinByName(planetNames[fillPlanets])
            planets[fillPlanets].setAnimationByName(0,"IDLE",true)
            
            planetsGroups[fillPlanets].add(planets[fillPlanets])
            
        }
        
        
        //Coins
        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0
        
        positions[9]=game.world.height-70
        positionsX[9]=100
        character=game.add.sprite(50,game.world.height-150,"dinoGood");
        character.scale.setTo(0.5)
        character.anchor.setTo(0.5)
        character.position.y=positions[9]
        character.animations.add('idle');
        character.animations.play('idle', 48, true);
        
        characterDe=game.add.sprite(game.world.centerX,game.world.height-150,"dinoKilled");
        characterDe.scale.setTo(0.5)
        characterDe.anchor.setTo(0.5)
        characterDe.alpha=0
        characterDe.position.y=positions[9]
        characterDe.animations.add('killed');
        characterDe.animations.play('killed', 48, true);
        
        
        dificulty=5
        starPos=game.rnd.integerInRange(8,dificulty)
        star=game.add.sprite(game.world.centerX+30,0,"star")
        star.scale.setTo(0.7)
        star.anchor.setTo(0.5,0.5)
        star.position.y=positions[starPos]
        star.animations.add('idle');
        star.animations.play('idle', 24, true)
        
        characterGroup.add(star)
        characterGroup.add(character)
        
        
        var rect2 = new Phaser.Graphics(game)
        rect2.beginFill(0x000000)
        rect2.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect2.alpha = 0
        rect2.endFill()
        rect2.inputEnabled = true
        rect2.events.onInputDown.add(passPosition, this);
        characterGroup.add(rect2)
        
    }
	
    

    function Coin(objectBorn,objectDestiny,time){
        
        
        //objectBorn= Objeto de donde nacen
        coins.x=objectBorn.centerX
        coins.y=objectBorn.centerY
        
        emitter = epicparticles.newEmitter("pickedEnergy")
        emitter.duration=0.05;
        emitter.x = coins.x
        emitter.y = coins.y
        game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
        game.add.tween(coins).to({y:objectBorn.centerY-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coins).to({x:objectDestiny.centerX,y:objectDestiny.centerY},200,Phaser.Easing.Cubic.InOut,true,time)
            game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
                coins.x=objectBorn.centerX
                coins.y=objectBorn.centerY
                addPoint(1)
            })
        })
    }
    
    function passPosition(obj){
        
       
        if(actualPosition>0 && characterActive){
            sound.play("jump")
            actualPosition--
            character.position.x=positionsX[actualPosition]
            character.position.y=positions[actualPosition];
        }
    }
    
	function update(){
        
        
        if(startGame && activePlanets){
            
            
            characterDe.position.x=character.x
            characterDe.position.y=character.y
            
            epicparticles.update()
            for(var moveGroups=0; moveGroups<planetsGroups.length;moveGroups++){
                planetsGroups[moveGroups].rotation+=speeds[moveGroups]
            }
            
            for(var checking=1; checking<9;checking++){
                if(checkOverlap(character,planetsProxy[checking]) && actualPosition==checking && characterActive){
                    missPoint()
                    sound.play("crash")
                    if(lives==0){
                        characterDe.alpha=1
                        character.alpha=0
                    }
                    actualPosition=9
                    game.add.tween(character).to({y:positions[9]},300,Phaser.Easing.Cubic.InOut,true)
                    game.time.events.add(50,function(){
                        character.alpha=0.1
                        game.time.events.add(50,function(){
                           character.alpha=1 
                            game.time.events.add(50,function(){
                                character.alpha=0.1 
                                    game.time.events.add(50,function(){
                                        character.alpha=1 
                                })
                            })
                        })
                    })
                }  
            }
            if(checkOverlap(character,star) && starPos<=actualPosition && characterActive){  
                    reset()
                    game.add.tween(star.scale).to({x:0,y:0}, 500, Phaser.Easing.Cubic.In, true)
                    game.add.tween(star).to({x:-100},500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                        star.position.x=game.world.width+100
                    })
                    Coin(character,pointsBar,100)
                    characterActive=false
                    if(dificulty>0)dificulty--
            }
            
        }
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
        particle.makeParticles('atlas.solarS',key);
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

				particle.makeParticles('atlas.solarS',tag);
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
    
    
    function reset(){
        
        sound.play("reseting")
        game.add.tween(character).to({y:positions[9]},800,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(star).to({x:game.world.centerX,y:positions[starPos]},500,Phaser.Easing.Cubic.In,true,900)
            game.add.tween(star.scale).to({x:0.7,y:0.7}, 500, Phaser.Easing.Cubic.In, true,900).onComplete.add(function(){
               characterActive=true 
            })
        })
        actualPosition=9
        
        starPos=game.rnd.integerInRange(8,dificulty)
        
        
         for(var fill=0; fill<10; fill++){
            speeds[fill]=(Math.random()*0.05)
        }
            
    }
    
    function checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
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
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            
            obj.used = false
            
            particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
        },this)
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

				particle.makeParticles('atlas.galaxy',tag);
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
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.solarS',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
        return particle
    }
	
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	return {
		
		assets: assets,
		name: "galaxyJumper",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
            
            addParticles()
                        			
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
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
			
			buttons.getButton(spaceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()