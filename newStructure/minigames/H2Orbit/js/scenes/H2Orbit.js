
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var H2Orbit = function(){
    
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
                name: "atlas.H2Orbit",
                json: "images/H2Orbit/atlas.json",
                image: "images/H2Orbit/atlas.png",
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
            {	name: "explosion",
				file: soundsPath + "explosion.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 116
    var overlayGroup
    var starsSong
    var back, stars
    var speed
    var states 
    var fontStyle 
    var shipGroup
    var planetsGroup
    var actualState
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        speed = 2
        actualState = 0
        
        if(localization.getLanguage() === 'EN'){
            states = ['Solid', 'Liquid', 'Gas'] 
            fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        }
        else{
            states = ['Solido', 'Líquido', 'Gaseoso'] 
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.H2Orbit','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.H2Orbit','life_box')

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
        starsSong.stop()
        		
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
        
        game.load.audio('starsSong', soundsPath + 'songs/shooting_stars.mp3');
        
		/*game.load.image('howTo',"images/H2Orbit/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/H2Orbit/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/H2Orbit/introscreen.png")*/
        
		game.load.image('bottle',"images/H2Orbit/bottle.png")
		game.load.image('paint',"images/H2Orbit/paint.png")
        
        game.load.spine("solidShip", "images/spines/IceShip/iceship.json")
        game.load.spine("liquidShip", "images/spines/WaterShip/whatership.json")
        game.load.spine("gasShip", "images/spines/WindShip/cloudship.json")
        
        game.load.spine("solidPlanet", "images/spines/IcePlanet/iceplanet.json")
        game.load.spine("liquidPlanet", "images/spines/WaterPlanet/watherplanet.json")
        game.load.spine("gasPlanet", "images/spines/WindPlanet/cloudplanet.json")
		
		game.load.image('tutorial_image',"images/H2Orbit/tutorial_image.png")
        //loadType(gameIndex)

        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)

    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        initGame()
    }

	function createBackground(){
            
        back = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.H2Orbit", "background")
        sceneGroup.add(back)
        
        bottle = sceneGroup.create(game.world.width, game.world.centerY, "bottle") 
        bottle.anchor.setTo(1, 0)
        
        paint = sceneGroup.create(game.world.centerX - 200, game.world.centerY - 330, "paint") 
        paint.anchor.setTo(0.5)
        
        stars = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.H2Orbit", "stars")
        stars.alpha = 0.5
        sceneGroup.add(stars)
    }

	function update(){
        
        back.tilePosition.y += speed * 0.7
        stars.tilePosition.y += speed
        
        if(bottle.y <  game.world.height + bottle.height)
            bottle.y += speed * 0.5
        else
            bottle.y = -bottle.height
        if(paint.y <  game.world.height + paint.height)
            paint.y += speed * 0.05
        else
            paint.y = -paint.height
        
        if(gameActive){
             if(planetsGroup.y < game.world.height + planetsGroup.children[actualState].height)
                planetsGroup.y += speed
            else
                throwPlanets()
        }
        
        game.physics.arcade.overlap(planetsGroup, shipGroup, planetVSship, null, this)
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
        particle.makeParticles('atlas.H2Orbit',key);
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

				particle.makeParticles('atlas.H2Orbit',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.H2Orbit','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.H2Orbit','smoke');
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
    
    function bigBangTheory(){
        
        planetsGroup = game.add.group()
        planetsGroup.x = game.world.centerX 
        planetsGroup.y = -70
        planetsGroup.state = 0
        planetsGroup.enableBody = true
        planetsGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(planetsGroup)
        
        var solidPlanet = game.add.spine(0, 0, "solidPlanet")
        solidPlanet.setAnimationByName(0, "IDLE", true)
        solidPlanet.setSkinByName("normal")
        solidPlanet.alpha = 0
        planetsGroup.add(solidPlanet)
        
        var liquidPlanet = game.add.spine(0, 0, "liquidPlanet")
        liquidPlanet.setAnimationByName(0, "IDLE", true)
        liquidPlanet.setSkinByName("normal")
        liquidPlanet.alpha = 0
        planetsGroup.add(liquidPlanet)
        
        var gasPlanet = game.add.spine(0, 0, "gasPlanet")
        gasPlanet.setAnimationByName(0, "IDLE", true)
        gasPlanet.setSkinByName("normal")
        gasPlanet.alpha = 0
        planetsGroup.add(gasPlanet)
        
        var planetCollider = planetsGroup.create(0, 0, "atlas.H2Orbit", "star")
        planetCollider.anchor.setTo(0.5)
        planetCollider.alpha = 0
        planetCollider.body.immovable = true
    }
    
    function starDestroyer(){
        
        shipGroup = game.add.group()
        shipGroup.x = game.world.centerX
        shipGroup.y = game.world.centerY + 200
        shipGroup.state = 0
        shipGroup.enableBody = true
        shipGroup.physicsBodyType = Phaser.Physics.ARCADE
        sceneGroup.add(shipGroup)
        
        var solidShip = game.add.spine(0, 0, "solidShip")
        solidShip.setAnimationByName(0, "IDLE", true)
        solidShip.setSkinByName("normal")
        solidShip.alpha = 1
        shipGroup.add(solidShip)
        
        var liquidShip = game.add.spine(0, 0, "liquidShip")
        liquidShip.setAnimationByName(0, "IDLE", true)
        liquidShip.setSkinByName("normal")
        liquidShip.alpha = 0
        shipGroup.add(liquidShip)
        
        var gasShip = game.add.spine(0, 0, "gasShip")
        gasShip.setAnimationByName(0, "IDLE", true)
        gasShip.setSkinByName("normal")
        gasShip.alpha = 0
        shipGroup.add(gasShip)
        
        var shipCollider = shipGroup.create(0, 0, "atlas.H2Orbit", "star")
        shipCollider.anchor.setTo(0.5)
        shipCollider.alpha = 0
        shipCollider.body.immovable = true
    }
    
    function initButtons(){
        
        for(var b = -1; b < 2; b++){
            
            var buttonGroup = game.add.group()
            buttonGroup.x = game.world.centerX + 170 * b 
            buttonGroup.y = game.world.height - 100
            sceneGroup.add(buttonGroup)
            
            var stateBtn = buttonGroup.create(0, 0, "atlas.H2Orbit", "stateButton")
            stateBtn.anchor.setTo(0.5)
            //stateBtn.x += 170 * b
            stateBtn.elementalState = b + 1
            //stateBtn.scale.setTo(1, 1.5)
            stateBtn.inputEnabled = true
            stateBtn.events.onInputDown.add(changeShip, this)
            
            var mesage = new Phaser.Text(sceneGroup.game, 0, 18, '0', fontStyle)
            mesage.anchor.setTo(0.5)
            mesage.y = stateBtn.y
            mesage.x = stateBtn.x
            mesage.setText(states[b + 1])
            buttonGroup.add(mesage)
        }
    }
    
    function changeShip(stateBtn){
        
        if(gameActive){
            game.add.tween(stateBtn.parent.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                sound.play('cut')
                changeImage(stateBtn.elementalState, shipGroup)
                shipGroup.state = stateBtn.elementalState
                game.add.tween(stateBtn.parent.scale).to({x: 1, y: 1}, 100, Phaser.Easing.linear, true)
            })
        }
    }
	
    function initGame(){
        
        gameActive = true
        throwPlanets()
    }
    
    function throwPlanets(){
        
        planetsGroup.y = -70
        actualState = getRand()
        changeImage(actualState, planetsGroup)
        planetsGroup.state = actualState
        shipGroup.children[3].body.enable = true
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === actualState)
            return getRand()
        else
            return x     
    }
    
    function planetVSship(planet, ship){

        shipGroup.children[3].body.enable = false

        if(planet.parent.state === ship.parent.state){
            addPoint(1)
            sound.play('rightChoice')
            speed += 0.25
            particleCorrect.x = shipGroup.x 
            particleCorrect.y = shipGroup.y
            particleCorrect.start(true, 1200, null, 6)
        }
        else{
            shipGroup.children[ship.parent.state].setAnimationByName(0, "LOSE", false)
            sound.play('explosion')
            if(lives > 1){
                restartGame()   
            }
            else{
                missPoint()
            }
            particleWrong.x = shipGroup.x - 20
            particleWrong.y = shipGroup.y
            particleWrong.start(true, 1200, null, 6)
        }
        
    }
    
    function restartGame(){
        
        game.add.tween(planetsGroup).to({y: game.world.height + planetsGroup.children[actualState].height}, 700, Phaser.Easing.linear, true).onComplete.add(function(){
            gameActive = false
            planetsGroup.y = -100
            shipGroup.y = game.world.height
            shipGroup.children[shipGroup.state].setAnimationByName(0, "IDLE", true)
            missPoint()
            game.add.tween(shipGroup).to({y: game.world.centerY}, 700, Phaser.Easing.linear, true).onComplete.add(function(){
                sound.play('throw')
                game.add.tween(shipGroup).to({y: game.world.centerY + 200}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                    initGame()
                })
            })
        })    
    }
    
	return {
		
		assets: assets,
		name: "H2Orbit",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
            game.physics.startSystem(Phaser.Physics.ARCADE)
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            starsSong = game.add.audio('starsSong')
            game.sound.setDecodedCallback(starsSong, function(){
                starsSong.loopFull(0.6)
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
            bigBangTheory()
            starDestroyer()
            initButtons()
            createParticles()
			
			buttons.getButton(starsSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()