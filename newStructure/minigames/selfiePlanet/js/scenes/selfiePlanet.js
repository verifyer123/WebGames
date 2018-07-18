
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
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
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
            }
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
    var handGroup
    var sparkGroup
    var planetsGroup
    var planetText
    var eagle
    var photo
    var target
    var speed
    var playTuto = true
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        clickDown = false
        speed = 10000
        
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
        particleWrong.start(true, 2000, null, 10)
		        
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
        initTuto()
        /*if(playTuto){
            initTuto()
        }
        else{
            handGroup.destroy()
            game.add.tween(sceneGroup.stars.tilePosition).to({x: -1000}, 1000, Phaser.Easing.linear, true)
            eagle.alpha = 1
            game.add.tween(eagle).from({x: game.world.width + 200}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                playTuto = false
                initGame()
            })
        }*/
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var background = sceneGroup.create(0, 0, "atlas.selfiePlanet", "background")
        background.width = game.world.width
        background.height = game.world.height
        
        var stars = game.add.tileSprite(game.world.centerX, game.world.centerY, game.world.width, game.world.height, "stars")
        stars.anchor.setTo(0.5)
        sceneGroup.add(stars)
        sceneGroup.stars = stars
        
        sparkGroup = game.add.group()
        sparkGroup.createMultiple(5, "atlas.selfiePlanet", "spark0")
        sparkGroup.createMultiple(5, "atlas.selfiePlanet", "spark1")
        sparkGroup.setAll('anchor.x', 0.5)
        sparkGroup.setAll('anchor.y', 0.5)
        sparkGroup.setAll('alpha', 0)
        sparkGroup.setAll('exists', false)
        sparkGroup.setAll('visible', false)
        sceneGroup.add(sparkGroup)
    
        shotStars()
    }
    
    function shotStars(){
            
        do {
            var spark = sparkGroup.getRandom()
        } while (spark.alive == true)
        
        if(spark){
            spark.reset(game.world.randomX,  game.world.randomY)
            spark.shine = game.add.tween(spark).to({alpha: 1}, 300, Phaser.Easing.linear, true, 0, 0, true)
            spark.shine.yoyoDelay(700)
            spark.shine.onComplete.add(function(obj){
                obj.kill()
            },this)
        }
        game.time.events.add(700, shotStars, this)
    }

	function update(){
        
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);
        particle.makeParticles('atlas.selfiePlanet',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.7;
        particle.maxParticleScale = 1.3;
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
    
    function createHand(){
        
        var fontStyle = {font: "80px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        handGroup = game.add.group()
        handGroup.counter = 0
        sceneGroup.add(handGroup)
        
        var pivotY = 250
        
        for(var i = 0; i < 3; i++){
            var tutoText = new Phaser.Text(sceneGroup.game, game.world.centerX, pivotY, '', fontStyle)
            tutoText.anchor.setTo(0.5)
            tutoText.stroke = "#FFFFFF"
            tutoText.strokeThickness = 20
            tutoText.alpha = 0
            handGroup.add(tutoText)
            
            pivotY += 250
        }
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0
        hand.counter = 0
        handGroup.add(hand)
        handGroup.hand = hand
    }
    
	function createCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 2000, null, 10)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
                   if(pointsBar.number > 0 && pointsBar.number % 5 == 0){
                       speed > 2000 ? speed -= 1000 : speed = 2000
                   }
               })
           })
        })
    }
    
    function createPlanets(){
        
        planetsGroup = game.add.group()
        planetsGroup.createMultiple(9, "planet0")
        planetsGroup.setAll('anchor.x', 0.5)
        planetsGroup.setAll('anchor.y', 0.5)
        planetsGroup.setAll('exists', false)
        planetsGroup.setAll('visible', false)
        planetsGroup.setAll('tag', -1)
        sceneGroup.add(planetsGroup)
        
        var scaleOpt = [{opt:[0.8, 1, 1], offsetY: 40}, //mercury
                        {opt:[0.8, 0.8, 1], offsetY: 30}, //venus
                        {opt:[ 0.7, 0.75, 1], offsetY: 50}, //earth
                        {opt:[0.9, 1, 1.2], offsetY: 10}, //mars
                        {opt:[0.4, 0.5, 1], offsetY: 300}, //jupiter
                        {opt:[0.4, 0.6, 0.9], offsetY: 130}, //saturn
                        {opt:[0.5, 0.7, 0.8], offsetY: 60}, //unranus
                        {opt:[0.6, 0.7, 1], offsetY: 100}] //neptune
        
        planetsGroup.scaleOpt = scaleOpt
        
        photo = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.selfiePlanet", "photoFail")
        photo.anchor.setTo(0.5)
        photo.alpha = 0
    }
    
    function createEagle(){

        eagle = game.add.spine(game.world.width - 25, game.world.height + 90, "eagle")
        eagle.setAnimationByName(0, "idle", true)
        eagle.setSkinByName("normal")
        eagle.alpha = 0
        eagle.angle = -30
        sceneGroup.add(eagle)
    }
    
    function createCamera(){
        
        var top = game.add.graphics(0, 0)
        top.beginFill(0x000000, 0.5)
        top.drawRect(0, 0, game.world.width, 100)
        sceneGroup.add(top)
        
        var pivotX = 0.6
        
        for(var i = 0; i < 3; i++){
            
            var icon = sceneGroup.create(game.world.centerX * pivotX, 70, "atlas.selfiePlanet", "icon" + i)
            icon.anchor.setTo(0.5)
            pivotX += 0.3
        }
        
        target = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.selfiePlanet", "target")
        target.anchor.setTo(0.5)
        target.inputEnabled = true
        target.events.onInputUp.add(function(){
            
            playTuto ? snapTuto() : takeSnapShot()
        }, this)
        target.input.enableDrag(true)
        target.events.onDragUpdate.add(moveWorld)
        
        var panel = game.add.graphics(0, game.world.height - 100)
        panel.beginFill(0x000000, 0.5)
        panel.drawRect(0, 0, game.world.width, 130)
        sceneGroup.add(panel)
        
        target.inputEnabled = false
        
        createText(panel)
    }
    
    function createText(panel){
        
        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        planetText = new Phaser.Text(sceneGroup.game, panel.centerX, panel.centerY - 10, '', fontStyle)
        planetText.anchor.setTo(0.5)
        planetText.stroke = "#FFFFFF"
        planetText.strokeThickness = 20
        sceneGroup.add(planetText)
        
        if(localization.getLanguage() === 'ES'){
            
            var words = [{name:"Mercurio", color:"#8C8B8F"}, 
                         {name:"Venus", color:"#F4D760"}, 
                         {name:"Tierra", color:"#318194"}, 
                         {name:"Marte", color:"#B93407"}, 
                         {name:"Júpiter", color:"#F29E4C"}, 
                         {name:"Saturno", color:"#90BA86"}, 
                         {name:"Urano", color: "#9AD6D4"}, 
                         {name:"Neptuno", color:"#3954DF"}]
        }
        else{
            var words = [{name:"Mercury", color:"#8C8B8F"}, 
                         {name:"Venus", color:"#F4D760"}, 
                         {name:"Earth", color:"#318194"}, 
                         {name:"Mars", color:"#B93407"}, 
                         {name:"Jupiter", color:"#F29E4C"}, 
                         {name:"Saturn", color:"#90BA86"}, 
                         {name:"Uranus", color: "#9AD6D4"}, 
                         {name:"Neptune", color:"#3954DF"}]
        }
        
        planetText.words = words
        planetText.alpha = 0
    }
    
    function moveWorld(){
            
        if(game.input.x < game.world.centerX){
            sceneGroup.stars.tilePosition.x += 3    
        }
        else{
            sceneGroup.stars.tilePosition.x -= 3
        }
        
        if(game.input.y < game.world.centerY){
            sceneGroup.stars.tilePosition.y += 3
        }
        else{
            sceneGroup.stars.tilePosition.y -= 3
        }
    }
    
    function takeSnapShot(){
                
        if(gameActive){
            
            var x = game.input.x
            var y = game.input.y
            
            var list = []
            
            planetsGroup.forEachAlive(function(planet){
                
                if(planet.getBounds().contains(x, y)){
                    list[list.length] = planet
                }
            },this)
            
            var chossenOne
            
            if(list.length > 0){
                
                gameActive = false
                target.inputEnabled = false
                chossenOne = list[0]
                
                if(list.length > 1){
                    
                    for(var i = 1; i < list.length; i++){
                        
                        if(Phaser.Math.distance(chossenOne.getBounds().centerX, chossenOne.getBounds().centerY, x, y) > Phaser.Math.distance(list[i].getBounds().centerX, list[i].getBounds().centerY, x, y))
                            chossenOne = list[i]
                    }
                }
                game.add.tween(planetText).to({alpha:0}, 300, Phaser.Easing.linear, true)
                flashScene()
                win(chossenOne)
            }
        }
    }
    
    function flashScene() {
                
        planetsGroup.forEachAlive(function(planet){     
            planet.grow.stop()
            planet.reduce.stop()
            planet.slide.stop()
            planet.spin.stop()
            game.add.tween(planet).to({alpha: 0}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
                planet.kill()
                planet.alpha = 1
            })
        },this)
        
        sceneGroup.alpha = 0
        sound.play("snapshot")
        game.add.tween(sceneGroup).to({alpha:1},500, Phaser.Easing.Cubic.Out,true)
    }
    
    function win(obj){
        
        if(obj.tag === planetsGroup.correct){
            addCoin(photo)
            eagle.setAnimationByName(0, "happy", true)
            photo.loadTexture("atlas.selfiePlanet", "photo" + obj.tag)
        }
        else{
            game.time.events.add(300, missPoint, this, photo)
            //missPoint(obj)
            eagle.setAnimationByName(0, "sad", true)
            photo.loadTexture("atlas.selfiePlanet", "photoFail")
        }
        photo.angle = game.rnd.integerInRange(-45, 45)
        photo.alpha = 1
        
        game.time.events.add(2000, centerTarget)
    }
    
    function centerTarget(){
        
        eagle.setAnimationByName(0, "idle", true)
        
        game.add.tween(target).to({x:game.world.centerX, y:game.world.centerY}, 500, Phaser.Easing.linear, true)
        game.add.tween(sceneGroup.stars.tilePosition).to({x:0, y:0}, 500, Phaser.Easing.linear, true)
        
        if(lives > 0)
            game.add.tween(photo).to({alpha:0}, 500, Phaser.Easing.linear, true, 300).onComplete.add(initGame)
    }
    
    function initGame(){
        
        throwPlanet()
        target.inputEnabled = true
        gameActive = true
    }
    
    function throwPlanet(){
        
        var pivotY = 250
        var auxArr = []
        var answer = game.rnd.integerInRange(0, 2)
        var last
        
        do{
            var rand = game.rnd.integerInRange(0, 7)
            while(auxArr.includes(rand)){
                rand = game.rnd.integerInRange(0, 7)
            }
            auxArr[auxArr.length] = rand
        }while(auxArr.length < 3)
            
        for(var i = 0; i < auxArr.length; i++){
            
            var planet = planetsGroup.getFirstExists(false)
            
            if(planet){
                
                planet.tag = auxArr[i]
                planet.loadTexture("planet" + auxArr[i])
                planet.scale.setTo(planetsGroup.scaleOpt[auxArr[i]].opt[i])
                
                if(i == answer)
                    planetsGroup.correct = auxArr[i]
                
                if(game.rnd.integerInRange(0, 10) % 2 === 0){
                    planet.reset(-150, pivotY)
                    planet.slide = game.add.tween(planet).to({x:game.world.width + 150}, speed, Phaser.Easing.Cubic.InOut, true)
                    planet.angle = game.rnd.integerInRange(0, 359)
                    var spinTime = game.rnd.integerInRange(4, 9) * 1000
                    planet.spin = game.add.tween(planet).to({angle: 360 + planet.angle}, spinTime, Phaser.Easing.linear, true)
                }
                else{
                    planet.reset(game.world.width + 150, pivotY)
                    planet.slide = game.add.tween(planet).to({x:-150}, speed, Phaser.Easing.Cubic.InOut, true)
                    planet.angle = game.rnd.integerInRange(-359, 0)
                    var spinTime = game.rnd.integerInRange(4, 9) * 1000
                    planet.spin = game.add.tween(planet).to({angle: -360 + planet.angle}, spinTime, Phaser.Easing.linear, true)
                }
                
                planet.spin.repeat(6)
                planet.grow = game.add.tween(planet.scale).from({x:0.2, y: 0.2}, speed * 0.45, Phaser.Easing.Cubic.In, true)
                planet.reduce =  game.add.tween(planet.scale).to({x:0.2, y: 0.2}, speed * 0.45, Phaser.Easing.Cubic.Out, false, speed * 0.1)
                planet.grow.chain(planet.reduce)
                
                pivotY += 250
                
                if(i == auxArr.length -1)
                    planet.y += planetsGroup.scaleOpt[auxArr[i]].offsetY
            }
        }
        
        last = planet.slide
        last.onComplete.add(restartGame)
        
        planetText.setText(planetText.words[planetsGroup.correct].name)
        planetText.stroke = planetText.words[planetsGroup.correct].color
        game.add.tween(planetText).to({alpha:1}, 300, Phaser.Easing.linear, true)
    }
    
    function restartGame(){
        
        if(gameActive){
            
            gameActive = false
            
            planetsGroup.forEachAlive(function(planet){     
                planet.grow.stop()
                planet.reduce.stop()
                planet.slide.stop()
                planet.spin.stop()
                game.add.tween(planet).to({alpha: 0}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
                    planet.kill()
                    planet.alpha = 1
                })
            },this)
            
            game.add.tween(planetText).to({alpha:0}, 300, Phaser.Easing.linear, true)
            missPoint(eagle)
            eagle.setAnimationByName(0, "sad", true)
            game.time.events.add(2000, centerTarget)
        }
    }
    
    function initTuto(){
        
        showPlanets(handGroup.counter)
    }
    
    function showPlanets(start){
        
        var pivotY = 250
        var timer = 3000
        var t = 0
        
        for(var i = start; i < start + 3; i++){
            
            var planet = planetsGroup.getFirstExists(false)
            
            if(planet && i < 8){
                
                planet.tag = t
                planet.loadTexture("planet" + i)
                planet.scale.setTo(planetsGroup.scaleOpt[i].opt[t])
                var offset
                
                if(game.rnd.integerInRange(0, 10) % 2 === 0){
                    offset = -80
                    planet.reset(-150, pivotY)
                    planet.slide = game.add.tween(planet).to({x:game.world.width - 150}, timer, Phaser.Easing.Cubic.InOut, true)
                    planet.spin = game.add.tween(planet).from({angle: 360}, timer, Phaser.Easing.linear, true)
                }
                else{
                    offset = 80
                    planet.reset(game.world.width + 150, pivotY)
                    planet.slide = game.add.tween(planet).to({x:150}, timer, Phaser.Easing.Cubic.InOut, true)
                    planet.spin = game.add.tween(planet).from({angle: -360}, timer, Phaser.Easing.linear, true)
                }
                
                planet.grow = game.add.tween(planet.scale).from({x:0.2, y: 0.2}, timer, Phaser.Easing.Cubic.In, true)
               
                posText(i, t, offset)
               
                pivotY += 250
                t++
                
                if(i == start + 2)
                    planet.y += planetsGroup.scaleOpt[i].offsetY
            }
        }
        game.time.events.add(timer + 300, posHand)
    }
    
    function posText(tag, i, offset){
            
        handGroup.children[i].setText(planetText.words[tag].name)
        handGroup.children[i].stroke = planetText.words[tag].color
        handGroup.children[i].x = game.world.centerX + offset
    }
    
    function posHand(){
        
        hand.x = target.x
        hand.y = target.y
        hand.alpha = 1
        
        hand.slide = game.add.tween(hand).to({x:planetsGroup.children[hand.counter].x, y: planetsGroup.children[hand.counter].y}, 1000, Phaser.Easing.linear, true)
        hand.slide.repeat(-1)
        hand.slide.repeatDelay(200)
        target.inputEnabled = true
    }
    
    function snapTuto(){
        
        if(playTuto){
            
            var x = game.input.x
            var y = game.input.y
            
            var list = []
            
            planetsGroup.forEachAlive(function(planet){
                
                if(planet.getBounds().contains(x, y)){
                    list[list.length] = planet
                }
            },this)
            
            var chossenOne
            
            if(list.length > 0){
                
                chossenOne = list[0]
                
                if(list.length > 1){
                    
                    for(var i = 1; i < list.length; i++){
                        
                        if(Phaser.Math.distance(chossenOne.getBounds().centerX, chossenOne.getBounds().centerY, x, y) > Phaser.Math.distance(list[i].getBounds().centerX, list[i].getBounds().centerY, x, y))
                            chossenOne = list[i]
                    }
                }
                
                if(chossenOne.tag == hand.counter){
                    target.inputEnabled = false
                    game.add.tween(handGroup.children[hand.counter]).to({alpha:1}, 200, Phaser.Easing.linear, true)
                    sceneGroup.alpha = 0
                    sound.play("snapshot")
                    game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
                    moveToCenter(checkSnapTaken)
                }
                else{
                    moveToCenter(posHand)
                }
                
            }
            else{
                moveToCenter(posHand)
            }
        }
    }
    
    function moveToCenter(nextFunction){
        
        hand.slide.stop()
        target.inputEnabled = false
        game.add.tween(target).to({x:game.world.centerX, y:game.world.centerY}, 300, Phaser.Easing.linear, true)
        game.add.tween(sceneGroup.stars.tilePosition).to({x:0, y:0}, 400, Phaser.Easing.linear, true).onComplete.add(nextFunction)
    }
    
    function checkSnapTaken(){
        
        var total = -1
        
        planetsGroup.forEachAlive(function(){     
            total++
        }, this)

        if(hand.counter < total){
            hand.counter++
            posHand()
        }
        else{
            restartTutorial()
        }
    }
    
    function restartTutorial(){
        
        planetsGroup.forEachAlive(function(planet){     

            game.add.tween(planet).to({alpha: 0}, 200, Phaser.Easing.linear, true).onComplete.add(function(){
                planet.kill()
                planet.alpha = 1
            })
        }, this)
        
        handGroup.forEach(function(obj){
            game.add.tween(obj).to({alpha: 0}, 200, Phaser.Easing.linear, true)
        }, this)
        
        if(handGroup.counter < 6){
            handGroup.counter += hand.counter + 1
            hand.counter = 0
            game.time.events.add(300, showPlanets, this, handGroup.counter)
        }
        else{
            handGroup.destroy()
            game.add.tween(sceneGroup.stars.tilePosition).to({x: -1000}, 1000, Phaser.Easing.linear, true)
            eagle.alpha = 1
            game.add.tween(eagle).from({x: game.world.width + 200}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                playTuto = false
                initGame()
            })
        }
    }
	
	return {
		
		assets: assets,
		name: "selfiePlanet",
        localizationData: localizationData,
		//update: update,
        preload:preload,
		create: function(event){
            
            var wihte = game.add.graphics(0, 0)
            wihte.beginFill(0xFFFFFF)
            wihte.drawRect(0, 0, game.world.width, game.world.height)
            wihte.endFill()
            
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
            } , this)

            game.onResume.add(function(){
                game.sound.mute = false
            }, this)
			            
            createPlanets()
            createEagle()
            createCamera()
			createPointsBar()
			createHearts()
            createCoin()
            createHand()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
		}
	}
}()