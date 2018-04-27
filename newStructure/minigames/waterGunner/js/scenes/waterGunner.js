var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"


var waterGunner = function(){

	var assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/waterGunner/atlas.json",
                image: "images/waterGunner/atlas.png"
            },
            {
                name: "atlas.time",
                json: "images/waterGunner/timeAtlas.json",
                image: "images/waterGunner/timeAtlas.png"
            },

        ],
        images: [
            {   name:"tutorial_image",
                file: "images/waterGunner/tutorial_image_%input.png"}
		],
		sounds: [
            {	name: "pop",
                file: soundsPath + "pop.mp3"},
		    {	name: "snapshot",
				file: soundsPath + "snapshot.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"},
            {   name: "magic",
                //file: soundsPath + "gameLose.mp3"},
                file: soundsPath + "magic.mp3"},
            {   name: "gameLose",
                //file: soundsPath + "magic.mp3"}
                file: soundsPath + "gameLose.mp3"},
            {
                name: 'gameSong',
                file: soundsPath + 'songs/upbeat_casual_8.mp3'
                }

            
        ],
        spines:[
            {
                name:'gun',
                file:'images/spines/gun/gun.json'
            },
            {
                name:'toys',
                file:'images/spines/toys/toys.json'
            }

		]
    }

    var NUM_LIFES = 3
    var INITIAL_TIME = 8000
    var DELTA_TIME = 500
    var MIN_TIME = 1000
    var LEVELS_TO_TIMER = 6

    var DELTA_OBJECT = 150

    var COLOR_NAMES = ["blue","pink","red","yellow"]
    var TOY_NAMES = ["ball","bear","car","helicopter","doll"]

    var INITIAL_TOYS_SHOT = 1
    var DELTA_TOYS_SHOT = 0.2
    var MAX_TOYS_SHOT = 3

    var TWEEN_TIME = 500

    
    var lives
	var sceneGroup = null
    var gameIndex = 180
    var tutoGroup
    var backgroundSound
    var timeValue
    var numPoints
    var gameGroup
    var heartsGroup
    var pointsBar

    var timeOn = false
    var clock, tweenTiempo, timeBar

    var currentLevel = 0
    var currentTime
    var correctParticle

    var canTouch

    var inTutorial
    var hand

    var superiorLine
    var inferiorLine

    var waterGun 
    var splash

    var currentToysShot 
    var currentColor

    var totalToys

    var currentCorrects
    var toyNeed

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = NUM_LIFES
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
       
        currentTime = INITIAL_TIME

        totalToys = []
        currentLevel = 0
        timeOn = false
        canTouch = false

        inTutorial = 0
        currentCorrects = 0
        toyNeed = 0
        currentToysShot = INITIAL_TOYS_SHOT
        loadSounds()
        
	}

    function preload(){
        game.stage.disableVisibilityChange = false;

        game.load.spritesheet("coin", 'images/waterGunner/coin.png', 122, 123, 12)
        game.load.spritesheet("splash", 'images/spines/splash.png', 111, 112, 10)

    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.game','hearts')

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

    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.game','xpcoins')
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
    
    function createPart(atlas,key){

        var particles = game.add.emitter(0, 0, 100);

        particles.makeParticles(atlas,key);
        particles.minParticleSpeed.setTo(-200, -50);
        particles.maxParticleSpeed.setTo(200, -100);
        particles.minParticleScale = 0.2;
        particles.maxParticleScale = 1;
        particles.gravity = 150;
        particles.angularDrag = 30;

        return particles
    }

    function positionTimer(){
      clock=game.add.image(game.world.centerX-150,40,"atlas.time","clock")
      clock.scale.setTo(.7)
      timeBar=game.add.image(clock.position.x+40,clock.position.y+40,"atlas.time","bar")
      timeBar.scale.setTo(8,.45)
      sceneGroup.add(clock)
      sceneGroup.add(timeBar)
      timeBar.alpha=1
      clock.alpha=1
    }

    function stopTimer(){
        if(tweenTiempo!=null){
            tweenTiempo.stop()
        }
        tweenTiempo=game.add.tween(timeBar.scale).to({x:8,y:.45}, 500, Phaser.Easing.Linear.Out, true, 100).onComplete.add(function(){
        })
    }

    function startTimer(time){
       tweenTiempo=game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
       tweenTiempo.onComplete.add(function(){
            missPoint()
            stopTimer()
            endRound()           
       })
    }

    function Coin(objectBorn,objectDestiny,time){
       
       
       //objectBorn= Objeto de donde nacen
       coins.x=objectBorn.x
       coins.y=objectBorn.y

       correctParticle.x = objectBorn.x
        correctParticle.y = objectBorn.y
        correctParticle.start(true, 1000, null, 5)

       game.add.tween(coins).to({alpha:1}, time, Phaser.Easing.Cubic.In, true,100)
       game.add.tween(coins).to({y:objectBorn.y-100},time+500,Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coins).to({x:objectDestiny.x,y:objectDestiny.y},200,Phaser.Easing.Cubic.InOut,true,time)
           game.add.tween(coins).to({alpha:0}, time+200, Phaser.Easing.Cubic.In, true,200).onComplete.add(function(){
               coins.x=objectBorn.x
               coins.y=objectBorn.y
               addPoint(1)
           })
       })
    }

    function stopGame(){

        backgroundSound.stop()
        inputsEnabled = false
        
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
            sound.play("gameLose")
		})
    }
    
    

    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.Linear.none,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.Linear.none,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    function addPoint(number){

        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        numPoints++
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

    }
    
    function missPoint(){
        
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(heartsGroup.text,'-1')

        stopTouch = true
        
        if(lives === 0){
            stopGame(false)
        }
        else{
            //nextRound()
        }
        
        // addNumberPart(batteryGroup,'-1')
    }
    


    function onClickPlay(rect) {
        tutoGroup.y = -game.world.height
        setRound()

    }
    
    function update() {
        
    }

    

    function createTutorial(){
        
        tutoGroup = game.add.group()

        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
    }




    function setRound(){
        console.log("setRound")
        canTouch = false
        currentCorrects = 0
        toyNeed = 0

        for(var i = 0; i < totalToys.length; i++){
            totalToys[i].visible = true
        }

        var tempToys = totalToys.slice()
        var tempColors = COLOR_NAMES.slice()
        var indexRandom = game.rnd.integerInRange(0,COLOR_NAMES.length-1)

        currentColor = tempColors[indexRandom]
        var colortemp = currentColor
        if(colortemp=="yellow"){
        	colortemp = "green"
        }
        waterGun.setAnimationByName(0,"IDLE",true)
        waterGun.setSkinByName(colortemp)
        waterGun.setToSetupPose();
        tempColors.splice(indexRandom,1)

        toyNeed = Math.round(currentToysShot)

        for(var i = 0; i < toyNeed; i++){
            var index = game.rnd.integerInRange(0,tempToys.length-1)
            var toy = tempToys[index]
            tempToys.splice(index,1)
            //toy.color = COLOR_NAMES[game.rnd.integerInRange(0,COLOR_NAMES.length-1)]
            toy.image.color = currentColor
            toy.spine.setSkinByName(toy.image.color)
            var name = TOY_NAMES[game.rnd.integerInRange(0,TOY_NAMES.length-1)]
            toy.spine.setAnimationByName(0,("idle_"+name).toUpperCase(),true)
            toy.image.loadTexture("atlas.game",name)
            toy.spine.setToSetupPose();
        }


        for(var i = 0; i < tempToys.length; i++){
            var toy = tempToys[i]
            toy.image.color = tempColors[game.rnd.integerInRange(0,tempColors.length-1)]
            //toy.color = currentColor
            toy.spine.setSkinByName(toy.image.color)
            var name = TOY_NAMES[game.rnd.integerInRange(0,TOY_NAMES.length-1)]
            toy.spine.setAnimationByName(0,("idle_"+name).toUpperCase(),true)
            toy.image.loadTexture("atlas.game",name)
            toy.spine.setToSetupPose();
        }

        game.add.tween(superiorLine).to({x:game.world.centerX},TWEEN_TIME,Phaser.Easing.linear,true)
        game.add.tween(inferiorLine).to({x:game.world.centerX},TWEEN_TIME,Phaser.Easing.linear,true).onComplete.add(function(){
            canTouch = true
        })

        if(currentToysShot < MAX_TOYS_SHOT){
            currentToysShot+=DELTA_TOYS_SHOT
        }

        if(currentLevel>LEVELS_TO_TIMER){
            if(!timeOn){
                timeOn = true
                positionTimer()
            }
            startTimer(currentTime)

            if(currentTime > MIN_TIME){
                currentTime -= DELTA_TIME
            }
        }

        currentLevel++

    }

    
    function evalTutorial(){

    }

    function clickToy(toy){
        
        if(!toy.group.visible || !canTouch){
            return
        }
        canTouch = false
        waterGun.x = toy.world.x
        var anim = waterGun.setAnimationByName(0,"SHOOT",false)
        anim.onComplete = function(){
	        splash.x = toy.world.x
	        splash.y = toy.world.y
	        canTouch = true

	        //splash.x = game.world.centerX
	        //splash.y = game.world.centerY
	        splash.visible = true
	        splash.animations.play("idle",24,false)
	        //console.log(toy.color,currentColor)

	        
	        waterGun.setAnimationByName(0,"idle",true)
	        if(toy.color == currentColor){
	            Coin({x:toy.world.x,y:toy.world.y},pointsBar,100)
	            toy.group.visible = false

	            currentCorrects++
	            if(currentCorrects==toyNeed){
	                endRound()
	            }

	        }
	        else{
	            missPoint()
	            setTween(toy.group)
	            /*var imageTint = getSlot(toy.group.spine,"toy")
	            imageTint.tint = 0xff0000*/
	        }
	    }
    }


    /*function getSlot(spine,slotName) {
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
		else{
			console.log("no slots")
		}
		

	}*/

    function endRound(){
        if(timeOn){
            stopTimer()
        }

        canTouch = false
        game.add.tween(superiorLine).to({x:-game.world.centerX},TWEEN_TIME,Phaser.Easing.linear,true)
        game.add.tween(inferiorLine).to({x:-game.world.centerX},TWEEN_TIME,Phaser.Easing.linear,true).onComplete.add(function(){
            superiorLine.x = game.world.centerX + game.world.width
            inferiorLine.x = game.world.centerX + game.world.width
            setRound()
        })
    }


    function createToysToLine(lineGroup){
        var initX = - DELTA_OBJECT
        for(var i = 0; i < 3; i++){
            
            var group = game.add.group()
            group.x = initX + (i*DELTA_OBJECT)
            lineGroup.add(group)

            var toy = game.add.spine(0,0,"toys")
            toy.setSkinByName("blue")
            toy.setAnimationByName(0,"IDLE_BALL",true)
            group.addChild(toy)
            group.spine = toy
            totalToys.push(group)

            var image = group.create(0,-80,"atlas.game","ball")
            image.anchor.setTo(0.5)
            image.inputEnabled = true
            image.events.onInputDown.add(clickToy,this)
            image.alpha = 0
            group.image = image
            image.color = "blue"
            image.group = group
        }
    }


    function setTween(toy){

    	//tweenTint(toy, 0xffffff, 0xff0000, 300);
    	//setTimeout(function(){tweenTint(toy, 0xff0000, 0xffffff, 300);},300)

        var tween1 = game.add.tween(toy).to({angle:-30},100,Phaser.Easing.linear)
        var tween2 = game.add.tween(toy).to({angle:30},200,Phaser.Easing.linear)
        var tween3 = game.add.tween(toy).to({angle:-30},200,Phaser.Easing.linear)
        var tween4 = game.add.tween(toy).to({angle:0},100,Phaser.Easing.linear)

        tween1.chain(tween2)
        tween2.chain(tween3)
        tween3.chain(tween4)

        tween1.start()

    }

    function tweenTint(obj, startColor, endColor, time) {    
	    // create an object to tween with our step value at 0    
	    var colorBlend = {step: 0};    
	    // create the tween on this object and tween its step property to 100    
	    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        
	    // run the interpolateColor function every time the tween updates, feeding it the    
	    // updated value of our tween each time, and set the result as our tint    
	    colorTween.onUpdateCallback(function() {      
	    	obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);       
	    });       
	    // set the object to the start color straight away    
	    obj.tint = startColor;            
	    // start the tween    
	    colorTween.start();
	}


    function createBackground(){

        var background = game.add.tileSprite(0,0,game.world.width,game.world.height,"atlas.game","fondo1")
        backgroundGroup.add(background)

        background = game.add.tileSprite(game.world.centerX,game.world.centerY,600,600,"atlas.game","fondo2")
        backgroundGroup.add(background)
        background.anchor.setTo(0.5)

        var bar = backgroundGroup.create(game.world.centerX,game.world.centerY-20,"atlas.game","repisa")
        bar.anchor.setTo(0.5)

        bar = backgroundGroup.create(game.world.centerX,game.world.centerY+180,"atlas.game","repisa")
        bar.anchor.setTo(0.5)

        var arc = backgroundGroup.create(game.world.centerX,game.world.height,"atlas.game","arco")
        arc.anchor.setTo(0.5,1)

        var base = backgroundGroup.create(game.world.centerX,game.world.height,"atlas.game","base")
        base.anchor.setTo(0.5,1)
        base.scale.setTo(1.1)


        superiorLine = game.add.group()
        sceneGroup.add(superiorLine)
        superiorLine.x = game.world.centerX + game.world.width
        superiorLine.y = game.world.centerY-10
        inferiorLine = game.add.group()
        sceneGroup.add(inferiorLine)
        inferiorLine.x = game.world.centerX + game.world.width
        inferiorLine.y = game.world.centerY+190


        createToysToLine(superiorLine)
        createToysToLine(inferiorLine)


        waterGun = game.add.spine(game.world.centerX,game.world.height - 20, "gun")
        waterGun.setSkinByName("red")
        waterGun.setAnimationByName(0,"IDLE",true)
        sceneGroup.add(waterGun)

        splash = sceneGroup.create(0,0,"splash")
        splash.anchor.setTo(0.5)
        var anim = splash.animations.add("idle")
        anim.onComplete.add(function(){
            splash.visible = false
        })
        splash.visible = false
    

        coins=game.add.sprite(game.world.centerX,game.world.centerY, "coin")
        coins.anchor.setTo(0.5)
        coins.scale.setTo(0.5)
        coins.animations.add('coin');
        coins.animations.play('coin', 24, true);
        coins.alpha=0


        hand = sceneGroup.create(0,0,'atlas.game','handUp')
        hand.anchor.setTo(0.5)
        hand.visible = false
    }

    function createScene(){

        sceneGroup = game.add.group() 
        backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)

        initialize()

        createBackground()

        backgroundSound = game.add.audio('gameSong')
        game.sound.setDecodedCallback(backgroundSound, function(){
            backgroundSound.loopFull(0.6)
        }, this);
        
        game.onPause.add(function(){
            game.sound.mute = true
        } , this);

        game.onResume.add(function(){
            game.sound.mute = false
        }, this);



        

        
        createPointsBar()
        createHearts()
        
        correctParticle = createPart('atlas.game','star')

        buttons.getButton(backgroundSound,sceneGroup, game.world.centerX * 0.5 + 70 , 30)


        createTutorial()
    
    }
    
	return {
		assets: assets,
		name: "waterGunner",
        update:update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: createScene
	}
}()
