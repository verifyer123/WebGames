
var soundsPath = "../../shared/minigames/sounds/"

var selfiePlanet = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!",
            "tutorial_image":"images/selfiePlanet/gametuto_EN.png"
		},

		"ES":{
            "howTo":"¿Cómo jugar?",
            "moves":"Movimientos extra",
            "stop":"¡Detener!",
            "tutorial_image":"images/selfiePlanet/gametuto_ES.png"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.selfiePlanet",
                json: "images/selfiePlanet/atlas.json",
                image: "images/selfiePlanet/atlas.png",
            },
        ],
        images: [
            {
				name:'tutorial_image',
				file:"%lang"
			},
            {
				name:'planet0',
				file:"images/selfiePlanet/planet0.png"
			},
            {
				name:'planet1',
				file:"images/selfiePlanet/planet1.png"
			},
            {
				name:'planet2',
				file:"images/selfiePlanet/planet2.png"
			},
            {
				name:'planet3',
				file:"images/selfiePlanet/planet3.png"
			},
            {
				name:'planet4',
				file:"images/selfiePlanet/planet4.png"
			},
            {
				name:'planet5',
				file:"images/selfiePlanet/planet5.png"
			},
            {
				name:'planet6',
				file:"images/selfiePlanet/planet6.png"
			},
            {
				name:'planet7',
				file:"images/selfiePlanet/planet7.png"
			},
            {
				name:'stars',
				file:"images/selfiePlanet/stars.png"
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
            {	name: "snapshot",
				file: soundsPath + "snapshot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/dancing_baby.mp3'
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
				name:"eagle",
				file:"images/spines/eagle.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
    var particleCorrect, particleWrong
    var gameIndex = 111
    var tutoGroup
    var pointsBar
    var heartsGroup
    var gameSong
    var coin
    var hand
    var planetsGroup
    var TOTAL_PLANETS
    var eagle
    var textGroup
    var target
    var Speed
    var rand
    var planetsCounter
    var randControler
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        Speed = 5000
        rand = -1
        TOTAL_PLANETS = 7
        planetsCounter = 0
        randControler = 0
        
        loadSounds()
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.selfiePlanet','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.selfiePlanet','life_box')

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
        game.stage.disableVisibilityChange = false
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        //initGame()
        showPlanets(0)
    }

	function createBackground(){
        
        var wihte = game.add.graphics(0, 0)
        wihte.beginFill(0xFFFFFF)
        wihte.drawRect(0, 0, game.world.width, game.world.height)
        wihte.endFill()
        sceneGroup.add(wihte)
        
        var background = sceneGroup.create(0, 0, "atlas.selfiePlanet", "background")
        background.width = game.world.width
        background.height = game.world.height
        
        var stars = game.add.tileSprite(0, 0, game.world.width, game.world.height, "stars")
        sceneGroup.add(stars)
        sceneGroup.stars = stars
    }

	function update(){
        
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.selfiePlanet',key);
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
                   addPoint(1)
                   if(pointsBar.number > 10){
                       Speed > 1000 ? Speed -= 200 : Speed = 1000
                   }
               })
           })
        })
    }
    
    function createPlanets(){
        
        planetsGroup = game.add.group()
        planetsGroup.createMultiple(5, "planet0")
        planetsGroup.setAll('anchor.x', 1)
        planetsGroup.setAll('anchor.y', 0.5)
        planetsGroup.setAll('checkWorldBounds', true)
        planetsGroup.setAll('outOfBoundsKill', true)
        planetsGroup.setAll('exists', false)
        planetsGroup.setAll('visible', false)
        planetsGroup.setAll('scale.x', 0.9)
        planetsGroup.setAll('scale.y', 0.9)
        sceneGroup.add(planetsGroup)
        planetsGroup.tag = -1
    }
    
    function createEagle(){
        
        var sad = sceneGroup.create(game.world.width, game.world.centerY, "atlas.selfiePlanet", "eagleSad") 
        sad.anchor.setTo(1, 0)
        sad.alpha = 0
        
        var happy = sceneGroup.create(game.world.width, game.world.centerY, "atlas.selfiePlanet", "eagleHappy") 
        happy.anchor.setTo(1, 0)
        happy.alpha = 0
        
        eagle = game.add.spine(game.world.width, game.world.height , "eagle")
        eagle.x -= sad.width * 0.5
        eagle.setAnimationByName(0, "idle", true)
        eagle.setSkinByName("normal")
        eagle.alpha = 0
        sceneGroup.add(eagle)
        
        eagle.sad = sad
        eagle.happy = happy
    }
    
    function createText(){
        
        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        textGroup = game.add.group()
        sceneGroup.add(textGroup)
        
        var name = new Phaser.Text(sceneGroup.game, game.world.centerX - 130, game.world.centerY + 300, '', fontStyle)
        name.anchor.setTo(0.5)
        name.stroke = "#191A4F"
        name.strokeThickness = 20
        textGroup.add(name)
        textGroup.text = name
        
        if(localization.getLanguage() === 'ES'){
            var words = ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"]
        }
        else{
            var words = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]
        }
        
        textGroup.words = words
    }
    
    function createCam(){
        
        var top = game.add.graphics(0, 0)
        top.beginFill(0x000000, 0.5)
        top.drawRect(0, 0, game.world.width, 60)
        sceneGroup.add(top)
        
        var selfie = sceneGroup.create(0, 60, "atlas.selfiePlanet", "selfie")
        selfie.width = game.world.width
        
        target = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.selfiePlanet", "target");
        target.anchor.setTo(0.5, 0.5)
        
        var panel = game.add.graphics(0, game.world.height - 130)
        panel.beginFill(0x000000, 0.5)
        panel.drawRect(0, 0, game.world.width, 130)
        sceneGroup.add(panel)
        
        var snapBtn = sceneGroup.create(game.world.centerX, game.world.height - 70, 'atlas.selfiePlanet', 'camBtn')
        snapBtn.anchor.setTo(0.5)
        snapBtn.inputEnabled = true
        snapBtn.events.onInputDown.add(pressButton, this)
    }
    
    function pressButton(btn){
        
        if(gameActive){
            gameActive = false
            game.add.tween(btn.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true, 0, 0, true)
            sound.play('snapshot')
            flashScene()
            planetsGroup.walk.stop()
            textGroup.motion.stop()
            textGroup.text.scale.setTo(1)
            chechAnswer()
		}
    }
    
    function flashScene() {
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
    }
    
    function killObj(obj){
        
        obj.kill()
        
        if(planetsGroup.tag === rand){
            eagle.setAnimationByName(0, "sad", true)
            missPoint(target)
            if(lives !== 0){
                game.time.events.add(1500, function(){
                    eagle.addAnimationByName(0, "idle", true)
                    restarAssets()
                })
            }
        }
        else{
            game.time.events.add(1000, throwPlanet)
        }
    }
    
    function chechAnswer(){
        
        var tar = target.getBounds()
        var sprite = planetsGroup.getFirstAlive()
        var planet = sprite.getBounds()
         
        var x = (planet.width - tar.width) 
        var y = (planet.height - tar.height) 
        
        tar.inflate(x * 0.5, y * 0.5)
        
        if(planetsGroup.tag < 4)
            planet.inflate(-x * 0.4, -y * 0.4)
        else
            planet.inflate(-x * 0.2, -y * 0.2)
        
        tar.y -= 100  
        
        eagle.alpha = 0
        
        if(tar.containsRect(planet) && planetsGroup.tag === rand){
            sound.play("rightChoice")
            eagle.happy.alpha = 1
            addCoin(target)
        }
        else{
            eagle.sad.alpha = 1
            missPoint(target)
        }
        
        if(lives !== 0){
            game.add.tween(sprite).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 800).onComplete.add(function(){
                sprite.kill()
                sprite.alpha = 1
                flashScene()
                eagle.happy.alpha = 0
                eagle.sad.alpha = 0
                eagle.alpha = 1
                eagle.setAnimationByName(0, "idle", true)
                restarAssets()
            })
        }
    }
    
    function restarAssets(){
        
        game.add.tween(textGroup.text).to({alpha: 0}, 700, Phaser.Easing.linear, true).onComplete.add(function(){
            textGroup.motion.stop()
            textGroup.text.scale.setTo(1)
            textGroup.text.setText("")
            textGroup.text.alpha = 1
            
            planetsCounter = 0
            randControler = game.rnd.integerInRange(2, 4)
            game.time.events.add(1500, initGame)
        })
    }
    
    function initGame(){
        
        rand = getRand(rand)
        textGroup.text.setText(textGroup.words[rand])
        game.add.tween(textGroup).from({alpha: 0}, 700, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
            textGroup.motion = game.add.tween(textGroup.text.scale).to({x: 1.3, y:1.3}, 700, Phaser.Easing.Cubic.InOut, true, 0, -1, true)
        })
        
        gameActive = true
        throwPlanet()
    }
    
    function throwPlanet(){
        
        var planet = planetsGroup.getFirstExists(false)

        if(planet){

            planetsGroup.tag = getRand(planetsGroup.tag)
            planetsCounter < randControler ? planetsCounter++ : planetsGroup.tag = rand
        
            planet.loadTexture("planet" + planetsGroup.tag)
            planet.reset(0, 0)//game.world.centerY - 100)  
            planetsGroup.walk = game.add.tween(planet).to({x: game.world.width + planet.width}, Speed, Phaser.Easing.linear, true, 1000)
            game.add.tween(planet.scale).from({x:0.1, y:0.1}, Speed * 0.3, Phaser.Easing.linear, true,1000)
            game.add.tween(planet).to({y: game.world.centerY - 100}, Speed * 0.3, Phaser.Easing.Cubic.Out, true,1000)
            planetsGroup.walk.onComplete.add(killObj, this)
        }
    }
    
    function getRand(opt){
        var x = game.rnd.integerInRange(0, TOTAL_PLANETS)
        if(x === opt)
            return getRand(opt)
        else
            return x     
    }
    
    function showPlanets(pivot){
        
        if(pivot <= TOTAL_PLANETS){
            var planet = planetsGroup.getFirstExists(false)

            if(planet){

                textGroup.text.setText(textGroup.words[pivot])
                game.add.tween(textGroup).from({alpha: 0}, 700, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
                    textGroup.motion = game.add.tween(textGroup.text.scale).to({x: 1.3, y:1.3}, 700, Phaser.Easing.Cubic.InOut, true, 0, -1, true)

                    planet.loadTexture("planet" + pivot)
                    planet.reset(game.world.centerX + planet.width * 0.5, game.world.centerY) 
                    game.add.tween(planet).from({alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                        game.add.tween(planet).to({alpha: 0}, 500, Phaser.Easing.linear, true, 2000).onComplete.add(function(){
                            textGroup.motion.stop()
                            textGroup.text.scale.setTo(1)
                            planet.kill()
                            planet.alpha = 1
                            showPlanets(pivot + 1)
                        })
                    })
                })
            }
        }
        else{
            
            game.add.tween(sceneGroup.stars.tilePosition).to({x: -1000}, 1000, Phaser.Easing.linear, true)
            eagle.alpha = 1
            game.add.tween(eagle).from({x: game.world.width + 200}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                restarAssets()
            })
        }
    }
	
	return {
		
		assets: assets,
		name: "selfiePlanet",
        localizationData: localizationData,
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this)

            game.onResume.add(function(){
                game.sound.mute = false
            }, this)
			            
            createPlanets()
            createEagle()
            createText()
            createCam()
            createPointsBar()
			createHearts()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
		}
	}
}()