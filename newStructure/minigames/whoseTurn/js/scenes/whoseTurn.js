
var soundsPath = "../../shared/minigames/sounds/"

var whoseTurn = function(){
    
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
                name: "atlas.whoseTurn",
                json: "images/whoseTurn/atlas.json",
                image: "images/whoseTurn/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/whoseTurn/gametuto.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "beep",
				file: soundsPath + "beepSupermarket.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "carAcceleration",
				file: soundsPath + "carAcceleration.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/childrenbit.mp3'
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
				name:"car",
				file:"images/spines/car/car.json"
			},
            {
				name:"trafficLigth",
				file:"images/spines/trafficLigth/traffic_light.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var particleCorrect, particleWrong
    var gameIndex = 214
    var tutoGroup
    var pointsBar
    var heartsGroup
    var gameSong
    var coin
    var hand
    var buttonsGroup
    var streetGroup
    var carsGroup
    var OPERATION
    var TOTAL
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        OPERATION = 0
        TOTAL = 0
        
        loadSounds()
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.whoseTurn','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.whoseTurn','life_box')

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
        //tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.puzzoole", "tile")
        //sceneGroup.add(tile)
        
        var box = game.add.graphics(0, 0)
        box.beginFill(0x70FFC8)
        box.drawRect(0, 0, game.world.width, game.world.height)
        box.endFill()
        sceneGroup.add(box)
        
        for(var i = 1; i >= 0; i--){
            
            var cloud = sceneGroup.create(game.world.width * i, 260, "atlas.whoseTurn", "clouds")
            cloud.anchor.setTo(i, 1)
        }   
        cloud.scale.setTo(-1, 1)
        cloud.x -= cloud.width
    }

	function update(){
        
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.whoseTurn',key);
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
        sound.play("rightChoice")

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(3)
                   if(pointsBar.number == 9){
                       OPERATION = 1
                   }
                   else if(pointsBar.number > 17){
                       OPERATION = game.rnd.integerInRange(0, 1)
                   }
               })
           })
        })
    }
    
    function createStreet(){
        
        streetGroup = game.add.group()
        sceneGroup.add(streetGroup)
        
        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        var traffic = game.add.spine(game.world.centerX, game.world.centerY + 200, "trafficLigth")
        traffic.setAnimationByName(0, "idle", true)
        traffic.setSkinByName("normal")
        traffic.scale.setTo(1.1)
        streetGroup.add(traffic)
        streetGroup.traffic = traffic
        
        var text = new Phaser.Text(sceneGroup.game, -220, -30, "", fontStyle)
        text.anchor.setTo(0.5)
        text.setShadow(3, 3, 'rgba(70,70,70,0.7)', 0)
        text.alpha = 0
        getSpineSlot(traffic, "empty").add(text)
        streetGroup.question = text
        
        var grass = game.add.tileSprite(0, 260, game.world.width, 600, "atlas.whoseTurn", "grass")
        streetGroup.add(grass)
        
        var pivot = 0.5
        
        for(var i = 0; i < 3; i++){
            var road = game.add.tileSprite(grass.centerX * pivot, grass.y, 133, grass.height, "atlas.whoseTurn", "road")
            road.anchor.setTo(0.5, 0)
            road.scale.setTo(1.2, 1)
            streetGroup.add(road)
            
            pivot += 0.5
        }
        
        createCars()
    }
    
    function getSpineSlot(spine, slotName){
		
		var slotIndex
		for(var index = 0, n = spine.skeletonData.slots.length; index < n; index++){
			var slotData = spine.skeletonData.slots[index]
			if(slotData.name === slotName){
				slotIndex = index
			}
		}

		if (slotIndex){
			return spine.slotContainers[slotIndex]
		}
	}
    
    function createCars(){
        
        carsGroup = game.add.group()
        carsGroup.skins = ["orange", "purple", "red", "yellow"]
        streetGroup.add(carsGroup)
        
        Phaser.ArrayUtils.shuffle(carsGroup.skins)
        
        var pivot = 0.5

        for(var i = 0; i < 3; i++){
            
            var car = game.add.spine(game.world.centerX * pivot, game.world.centerY + 260, "car")
            car.setAnimationByName(0, "run", true)
            car.setSkinByName("car_" + carsGroup.skins[i])
            car.chosenOne = false
            carsGroup.add(car)
            
            pivot += 0.5
        }
    }
    
    function createButtons(){
        
        var board = sceneGroup.create(0, game.world.height, "atlas.whoseTurn", "board")
        board.anchor.setTo(0, 1)
        board.width = game.world.width
        
        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        buttonsGroup = game.add.group()
        sceneGroup.add(buttonsGroup)
        
        var pivot = 0.4
        
        for(var i = 0; i < 3; i++){
            
            var subGroup = game.add.group()
            subGroup.x = board.centerX * pivot
            subGroup.y = board.centerY
            subGroup.alpha = 0
            buttonsGroup.add(subGroup)
            
            var btn = subGroup.create(0, 0, "atlas.whoseTurn", "button")
            btn.anchor.setTo(0.5)
            btn.inputEnabled = true
            btn.tag = i
            btn.events.onInputDown.add(btnPressed, this)   
            
            var text = new Phaser.Text(sceneGroup.game, 0, 5, "", fontStyle)
            text.anchor.setTo(0.5)
            text.setShadow(3, 3, 'rgba(70,70,70,0.7)', 0)
            subGroup.add(text)
            subGroup.value = text
            
            pivot += 0.6
        }
    }
    
    function btnPressed(btn){
        
        if(gameActive){
            
            gameActive = false
            sound.play("pop")
            if(streetGroup.timer)
                game.time.events.remove(streetGroup.timer)
            
            game.add.tween(btn.parent.scale).to({x:0.7,y:0.7}, 100, Phaser.Easing.linear, true, 0, 0, true)
            carsGroup.children[btn.tag].chosenOne = true
            streetGroup.bringToTop(carsGroup)
            
            if(btn.parent.value.text == TOTAL){
                
                game.add.tween(carsGroup.children[btn.tag]).to({y: carsGroup.children[btn.tag].y - 170}, 1000, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
                    addCoin(carsGroup.children[btn.tag])
                    streetGroup.traffic.setAnimationByName(0, "good", false).onComplete = function(){
                        buttonsGroup.forEach(fadeOut, this)
                        streetGroup.bringToTop(streetGroup.traffic)
                        game.add.tween(carsGroup.children[btn.tag]).to({y: carsGroup.children[btn.tag].y - 210}, 1000, Phaser.Easing.Cubic.In, true).onComplete.add(leaveStation)
                    }
                })
            }
            else{
                game.add.tween(carsGroup.children[btn.tag]).to({y: carsGroup.children[btn.tag].y - 170}, 1000, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
                    streetGroup.traffic.setAnimationByName(0, "bad", true)
                    missPoint(carsGroup.children[btn.tag])
                    if(lives > 0){
                        game.add.tween(carsGroup.children[btn.tag]).to({y: carsGroup.children[btn.tag].y + 170}, 1000, Phaser.Easing.Cubic.InOut, true, 500).onComplete.add(function(){
                            streetGroup.traffic.setAnimationByName(0, "idle", true)
                            carsGroup.children[btn.tag].chosenOne = false
                            gameActive = true
                            streetGroup.timer = game.time.events.add(6000, function(){
                                streetGroup.traffic.setAnimationByName(0, "bad", true)
                                alarm(1200)
                            })
                        })
                    }
                })
            }
        }
    }
    
    function fadeOut(obj){
        game.add.tween(obj).to({alpha:0},250,Phaser.Easing.linear,true)
    }
    
    function leaveStation(){
        
        for(var i = 0; i < streetGroup.length - 2; i++){
            game.add.tween(streetGroup.children[i].tilePosition).to({y:770}, 3000, Phaser.Easing.linear, true).onComplete.add(resetPos, this)
        }
        
        for(var i = 0; i < carsGroup.length; i++){
            if(carsGroup.children[i].chosenOne)
                game.add.tween(carsGroup.children[i]).to({y:game.world.centerY + 260}, 1500, Phaser.Easing.linear,true)
            else{
                changeCars(carsGroup.children[i])
            }
        }
        sound.play("carAcceleration")
        game.add.tween(streetGroup.traffic).to({y:game.world.height + 270}, 1500, Phaser.Easing.linear,true).onComplete.add(function(){
            streetGroup.sendToBack(streetGroup.traffic)
            streetGroup.traffic.setAnimationByName(0, "idle", true)
            streetGroup.traffic.y = game.world.centerY + 200
            streetGroup.question.alpha = 0
        })
        
        game.time.events.add(3000, initGame)
    }
    
    function changeCars(car){
        
        game.add.tween(car).to({y:game.world.height}, 1500, Phaser.Easing.linear, true).onComplete.add(function(){
            car.setSkinByName("car_" + carsGroup.skins[game.rnd.integerInRange(0, 3)])
            game.add.tween(car).to({y:game.world.centerY + 260}, 1500, Phaser.Easing.linear,true)
        })
    }
    
    function initGame(){
        
        arriveToStation()
    }
    
    function arriveToStation(){
        
        for(var i = 1; i < streetGroup.length - 1; i++){
            game.add.tween(streetGroup.children[i].tilePosition).to({y:1029}, 6000, Phaser.Easing.Cubic.InOut,true).onComplete.add(resetPos, this)
        }
        sound.play("carAcceleration")
        game.add.tween(streetGroup.traffic.scale).from({x: 0, y:0}, 3500, Phaser.Easing.linear, true)
        game.add.tween(streetGroup.traffic).to({y:160}, 3500, Phaser.Easing.Cubic.In,true).onComplete.add(function(){
            streetGroup.bringToTop(streetGroup.traffic)
            gameActive = true
            game.add.tween(streetGroup.traffic).to({y:436}, 2500, Phaser.Easing.Cubic.Out,true).onComplete.add(setQuiestion)
        })
    }
    
    function resetPos(obj){
        obj.y = 0
    }
    
    function setQuiestion(){
        
        var pos = [0, 1, 2]
        Phaser.ArrayUtils.shuffle(pos)
        
        if(OPERATION === 0){
            var x = game.rnd.integerInRange(50, 500)
            var y = game.rnd.integerInRange(50, 499)
            TOTAL = x + y
            streetGroup.question.setText(x + "+" + y)
        }
        else{
            var x = game.rnd.integerInRange(50, 999)
            var y = game.rnd.integerInRange(50, 499)
            TOTAL = Math.abs(x - y)
            streetGroup.question.setText(x + "-" + y)
        }
        
        buttonsGroup.children[pos[0]].value.setText(TOTAL)
        
        for(var i = 1; i < buttonsGroup.length; i++){
            if(TOTAL <= 500){
                var aux = TOTAL + game.rnd.integerInRange(50, 80)
            }
            else{
                var aux = TOTAL - game.rnd.integerInRange(20, 50)
            }
            buttonsGroup.children[pos[i]].value.setText(aux)
        }
        
        game.add.tween(streetGroup.question).to({alpha:1},250,Phaser.Easing.linear,true).onComplete.add(function(){
            buttonsGroup.forEach(popObject, this)
            game.time.events.add(300, function(){
                gameActive = true
                streetGroup.timer = game.time.events.add(6000, function(){
                    streetGroup.traffic.setAnimationByName(0, "bad", true)
                    alarm(1200)
                })
            })
        })
    }
    
    function popObject(obj, val){
         
        //game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({y:0},250,Phaser.Easing.linear,true)
        //},this)
    }
    
    function noAnswer(){
        
        if(gameActive){
            
            gameActive = false
            streetGroup.traffic.setAnimationByName(0, "good", false).onComplete = function(){
            
                for(var i = 0; i < streetGroup.length - 2; i++){
                    game.add.tween(streetGroup.children[i].tilePosition).to({y:770}, 3000, Phaser.Easing.Cubic.InOut, true).onComplete.add(resetPos, this)
                }
                sound.play("carAcceleration")
                buttonsGroup.forEach(fadeOut, this)

                game.add.tween(streetGroup.traffic).to({y:game.world.height + 270}, 3000, Phaser.Easing.Cubic.InOut, true).onComplete.add(function(){
                    streetGroup.sendToBack(streetGroup.traffic)
                    streetGroup.traffic.setAnimationByName(0, "idle", true)
                    streetGroup.traffic.y = game.world.centerY + 200
                    streetGroup.question.alpha = 0
                    initGame()
                })
            }
        }
    }
    
    function alarm(delay){
        
        if(gameActive){
            sound.play("beep")
            if(delay > 130){
                game.time.events.add(delay, function(){
                    alarm(delay *= 0.8)
                })
            }
            else{
                noAnswer()
            }
        }
    }
	
	return {
		
		assets: assets,
		name: "whoseTurn",
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
                        			
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
			            
			
            createStreet()
            createPointsBar()
			createHearts()
            createButtons()
            createCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()