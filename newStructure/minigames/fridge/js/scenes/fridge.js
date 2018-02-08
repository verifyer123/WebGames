
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var fridge = function(){
    
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
                name: "atlas.fridge",
                json: "images/fridge/atlas.json",
                image: "images/fridge/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/fridge/timeAtlas.json",
                image: "images/fridge/timeAtlas.png",
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
				file: soundsPath + "wrong.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongAnswer",
				file: soundsPath + "wrongAnswer.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 117
    var overlayGroup
    var fridgeSong
    var fridgeGroup
    var containerGroup
    
    var animalsGroup
    var dairyGroup
    var fruitsGroup
    var vegetablesGroup
    var cerealsGroup
    var legumeGroup
    
    var animalsSpineGroup
    var dairySpineGroup
    var fruitsSpineGroup
    var vegetablesSpineGroup
    var cerealsSpineGroup
    var legumeSpineGroup
    
    var food
    var fontStyle
    var foodValue = {animal: 0, dairy: 1, fruits: 2, vegetables: 3, cereals: 4, legunmes: 5}
    var lvl
    var popPosX, popPosY
    var time
    var fridgeSlots
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        lvl = 1
        time = 60000
        popPosX = -1
        popPosY = -1
        fridgeSlots = 0
        
        fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        if(localization.getLanguage() === 'ES'){
            food = ['Animal', 'Lacteos', 'Frutas', 'Verduras', 'Cereles', 'Leguminosas'] 
        }
        else{
            food = ['Animal', 'Dairy', 'Fruits', 'Vegetables', 'Cerels', 'Legume']
        }
        
        loadSounds()
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("pop")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0.01, y:0.01},200,Phaser.Easing.linear,true).onComplete.add(function(){
            })
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.fridge','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.fridge','life_box')

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
        fridgeSong.stop()
        		
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
        
        game.load.audio('fridgeSong', soundsPath + 'songs/happy_game_memories.mp3');
        
		/*game.load.image('howTo',"images/fridge/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/fridge/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/fridge/introscreen.png")*/

        game.load.image('tutorial_image',"images/fridge/tutorial_image_"+localization.getLanguage()+".png")
        loadType(gameIndex)

		
        game.load.image('fridge',"images/fridge/fridge.png")
        game.load.image('kitchen',"images/fridge/kitchen.png")
        
        game.load.spine("animalSpine", "images/spines/animal/animal.json")
        game.load.spine("cerealesSpine", "images/spines/cereales/cereales.json")
        game.load.spine("frutasSpine", "images/spines/frutas/frutas.json")
        game.load.spine("lacteosSpine", "images/spines/lacteos/lacteos.json")
        game.load.spine("leguminosasSpine", "images/spines/leguminosas/leguminosas.json")
        game.load.spine("verdurasSpine", "images/spines/verduras/verduras.json")
        
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        

        createTutorialGif(overlayGroup,onClickPlay)

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
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.fridge','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.fridge',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.fridge','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var back = game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.fridge", "background")
        sceneGroup.add(back)
        
        var kitchen  = sceneGroup.create(game.world.centerX -100, game.world.centerY, "kitchen") 
        kitchen.anchor.setTo(0.5)
    }

	function update(){

        tutorialUpdate()

        
        for(var f = 0; f < food.length - 1; f++){
            animalsSpineGroup.children[f].x = animalsGroup.children[f].x
            animalsSpineGroup.children[f].y = animalsGroup.children[f].y + 35
            
            dairySpineGroup.children[f].x = dairyGroup.children[f].x
            dairySpineGroup.children[f].y = dairyGroup.children[f].y + 20
            
            fruitsSpineGroup.children[f].x = fruitsGroup.children[f].x
            fruitsSpineGroup.children[f].y = fruitsGroup.children[f].y + 20
            
            vegetablesSpineGroup.children[f].x = vegetablesGroup.children[f].x
            vegetablesSpineGroup.children[f].y = vegetablesGroup.children[f].y + 20
            
            cerealsSpineGroup.children[f].x = cerealsGroup.children[f].x
            cerealsSpineGroup.children[f].y = cerealsGroup.children[f].y + 25
            
            legumeSpineGroup.children[f].x = legumeGroup.children[f].x
            legumeSpineGroup.children[f].y = legumeGroup.children[f].y + 20
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
        particle.makeParticles('atlas.fridge',key);
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

				particle.makeParticles('atlas.fridge',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.fridge','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.fridge','smoke');
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
	
	function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        clock.alpha = 1
        timerGroup.add(clock)
        
        timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timeBar.alpha = 1
        timerGroup.add(timeBar)
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.3
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            stopTimer()
            win(false)
        })
    }
    
    function coolFridge(){
        
        fridgeGroup = game.add.group()
        fridgeGroup.x = game.world.centerX
        fridgeGroup.y = game.world.centerY - 50
        fridgeGroup.scale.setTo(0.75)
        sceneGroup.add(fridgeGroup)
        
        var fridge = fridgeGroup.create(0, 70, "fridge")
        fridge.anchor.setTo(0.5)
        
        var num = 0
        
        for(var r = 0; r < 2; r++){
            for(var c = 0; c < 3; c++){
                var sections = fridgeGroup.create(-130, -102, 'atlas.fridge', "title" + num)
                sections.x += (sections.width + 25) * r 
                sections.y += 300 * c
                sections.anchor.setTo(0.5)
                
                var sectionsText = new Phaser.Text(sceneGroup.game, 0, 0, '0', fontStyle)
                sectionsText.anchor.setTo(0.5)
                sectionsText.y = sections.y + 5
                sectionsText.x = sections.x
                sectionsText.setText(food[num])
                fridgeGroup.add(sectionsText)
                num++
            }
        }
        
        var table = sceneGroup.create(game.world.centerX, game.world.height, "atlas.fridge", "table") 
        table.anchor.setTo(0.5, 1)
        table.scale.setTo(1.5, 1)
    }
    
    function xBox(){
        
        containerGroup = game.add.group()
        //containerGroup.scale.setTo(0.8)
        sceneGroup.add(containerGroup)
        
        var num = 0
        
        for(var r = 0; r < 2; r++){
            for(var c = 0; c < 3; c++){
                var container = game.add.graphics(game.world.centerX - 197, game.world.centerY  - 335)
                container.x += 200 * r
                container.y += 230 * c
                //container.beginFill(0xFF3300);
                container.drawRect(0, 0, 195, 226)
                container.alpha = 0
                container.foodValue = num
                container.slots = [{x: -container.width * 0.20, y: -container.height * 0.30},
                                   {x: container.width * 0.20, y: -container.height * 0.30},
                                   {x: -container.width * 0.20, y: container.height * 0.10},
                                   {x: container.width * 0.20, y: container.height * 0.10},
                                   {x: 0, y: -container.height * 0.15}]
                container.slotPos = 0
                containerGroup.add(container)
                num++
            }
        }
    }
    
    function worldWarFood(){
        
        animalsGroup = game.add.group()
        sceneGroup.add(animalsGroup)
        
        dairyGroup = game.add.group()
        sceneGroup.add(dairyGroup)
        
        fruitsGroup = game.add.group()
        sceneGroup.add(fruitsGroup)
        
        vegetablesGroup = game.add.group()
        sceneGroup.add(vegetablesGroup)
        
        cerealsGroup = game.add.group()
        sceneGroup.add(cerealsGroup)
        
        legumeGroup = game.add.group()
        sceneGroup.add(legumeGroup)
        
        for(var f = 1; f < food.length; f++){
            var animalFood = animalsGroup.create(0, 0, 'atlas.fridge', "animal" + f)
            animalFood.anchor.setTo(0.5)
            animalFood.scale.setTo(0.6)
            animalFood.alpha = 0
            animalFood.foodValue = foodValue.animal
            animalFood.popUpPosX = 0
            animalFood.popUpPosY = 0
            animalFood.inputEnabled = true
            animalFood.input.enableDrag()
            animalFood.events.onDragStop.add(putThatThingDown,this)
            
            var dairyFood = dairyGroup.create(0, 0, 'atlas.fridge', "lacteo" + f)
            dairyFood.anchor.setTo(0.5)
            dairyFood.scale.setTo(0.6)
            dairyFood.alpha = 0
            dairyFood.foodValue = foodValue.dairy
            dairyFood.popUpPosX = 0
            dairyFood.popUpPosY = 0
            dairyFood.inputEnabled = true
            dairyFood.input.enableDrag()
            dairyFood.events.onDragStop.add(putThatThingDown,this)
            
            var fruitFood = fruitsGroup.create(0, 0, 'atlas.fridge', "fruta" + f)
            fruitFood.anchor.setTo(0.5)
            fruitFood.scale.setTo(0.6)
            fruitFood.alpha = 0
            fruitFood.foodValue = foodValue.fruits
            fruitFood.popUpPosX = 0
            fruitFood.popUpPosY = 0
            fruitFood.inputEnabled = true
            fruitFood.input.enableDrag()
            fruitFood.events.onDragStop.add(putThatThingDown,this)
            
            var vegetablesFood = vegetablesGroup.create(0, 0, 'atlas.fridge', "verdura" + f)
            vegetablesFood.anchor.setTo(0.5)
            vegetablesFood.scale.setTo(0.6)
            vegetablesFood.alpha = 0
            vegetablesFood.foodValue = foodValue.vegetables
            vegetablesFood.popUpPosX = 0
            vegetablesFood.popUpPosY = 0
            vegetablesFood.inputEnabled = true
            vegetablesFood.input.enableDrag()
            vegetablesFood.events.onDragStop.add(putThatThingDown,this)
            
            var cerealsFood = cerealsGroup.create(0, 0, 'atlas.fridge', "cereal" + f)
            cerealsFood.anchor.setTo(0.5)
            cerealsFood.scale.setTo(0.6)
            cerealsFood.alpha = 0
            cerealsFood.foodValue = foodValue.cereals
            cerealsFood.popUpPosX = 0
            cerealsFood.popUpPosY = 0
            cerealsFood.inputEnabled = true
            cerealsFood.input.enableDrag()
            cerealsFood.events.onDragStop.add(putThatThingDown,this)
            
            var legumeFood = legumeGroup.create(0, 0, 'atlas.fridge', "leguminosa" + f)
            legumeFood.anchor.setTo(0.5)
            legumeFood.scale.setTo(0.6)
            legumeFood.alpha = 0
            legumeFood.foodValue = foodValue.legunmes
            legumeFood.popUpPosX = 0
            legumeFood.popUpPosY = 0
            legumeFood.inputEnabled = true
            legumeFood.input.enableDrag()
            legumeFood.events.onDragStop.add(putThatThingDown,this)
        }
    }
    
    function worldWarFoodAnimated(){
        
        animalsSpineGroup = game.add.group()
        sceneGroup.add(animalsSpineGroup)
        
        dairySpineGroup = game.add.group()
        sceneGroup.add(dairySpineGroup)
        
        fruitsSpineGroup = game.add.group()
        sceneGroup.add(fruitsSpineGroup)
        
        vegetablesSpineGroup = game.add.group()
        sceneGroup.add(vegetablesSpineGroup)
        
        cerealsSpineGroup = game.add.group()
        sceneGroup.add(cerealsSpineGroup)
        
        legumeSpineGroup = game.add.group()
        sceneGroup.add(legumeSpineGroup)
        
        for(var f = 1; f < food.length; f++){
            var animalSpine = game.add.spine(0, 0, "animalSpine")
            animalSpine.setAnimationByName(0, "IDLE", true)
            animalSpine.setSkinByName("animal" + f)
            animalSpine.scale.setTo(0.6)
            animalSpine.alpha = 0
            animalsSpineGroup.add(animalSpine)
            
            var dairySpine = game.add.spine(0, 0, "lacteosSpine")
            dairySpine.setAnimationByName(0, "IDLE", true)
            dairySpine.setSkinByName("lacteos" + f)
            dairySpine.scale.setTo(0.6)
            dairySpine.alpha = 0
            dairySpineGroup.add(dairySpine)
            
            var fruitsSpine = game.add.spine(0, 0, "frutasSpine")
            fruitsSpine.setAnimationByName(0, "IDLE", true)
            fruitsSpine.setSkinByName("frutas" + f)
            fruitsSpine.scale.setTo(0.6)
            fruitsSpine.alpha = 0
            fruitsSpineGroup.add(fruitsSpine)
            
            var vegetablesSpine = game.add.spine(0, 0, "verdurasSpine")
            vegetablesSpine.setAnimationByName(0, "IDLE", true)
            vegetablesSpine.setSkinByName("verduras" + f)
            vegetablesSpine.scale.setTo(0.6)
            vegetablesSpine.alpha = 0
            vegetablesSpineGroup.add(vegetablesSpine)
            
            var cerealsSpine = game.add.spine(0, 0, "cerealesSpine")
            cerealsSpine.setAnimationByName(0, "IDLE", true)
            cerealsSpine.setSkinByName("cereal" + f)
            cerealsSpine.scale.setTo(0.6)
            cerealsSpine.alpha = 0
            cerealsSpineGroup.add(cerealsSpine)
            
            var legumeSpine = game.add.spine(0, 0, "leguminosasSpine")
            legumeSpine.setAnimationByName(0, "IDLE", true)
            legumeSpine.setSkinByName("leguminosas" + f)
            legumeSpine.scale.setTo(0.6)
            legumeSpine.alpha = 0
            legumeSpineGroup.add(legumeSpine)
        }
    }
    
    function putThatThingDown(food){
        
        var cont
        var ration = food.getBounds()
        var wrong = true
        
        for(var f = 0; f < containerGroup.length; f++){
            cont = containerGroup.children[f].getBounds()
            
            if(cont.containsRect(ration) && containerGroup.children[f].foodValue === food.foodValue){
                sound.play('rightChoice')
                food.x = containerGroup.children[f].centerX + containerGroup.children[f].slots[containerGroup.children[f].slotPos].x
                food.y = containerGroup.children[f].centerY + containerGroup.children[f].slots[containerGroup.children[f].slotPos].y
                food.inputEnabled = false
                containerGroup.children[f].slotPos++
                if(containerGroup.children[f].slotPos === lvl){
                    particleCorrect.x = containerGroup.children[f].centerX
                    particleCorrect.y = containerGroup.children[f].centerY
                    particleCorrect.start(true, 1200, null, 6)
                    win(true)
                }
                wrong = false
                break
            } 
            else{
                food.x = food.popUpPosX
                food.y = food.popUpPosY
            }
        }
        if(wrong){
            /*particleWrong.x = food.x
            particleWrong.y = food.y
            particleWrong.start(true, 1200, null, 6)*/
            sound.play('wrongAnswer')
        }
    }
    
    function win(complete){
        
        if(complete){
            fridgeSlots++
            addPoint(1)
        }
        else{
            missPoint()
             game.time.events.add(500,function(){
                restarLvl()
            },this)
        }

        if(fridgeSlots === food.length){
            if(lvl > 3){
                stopTimer()
            }
            if(lvl < 5){
                lvl++
            }
            if(lvl === 5){
                time -= 5000
            }
            game.time.events.add(500,function(){
                restarLvl()
            },this)
        }
    }
    
    function restarLvl(){
        gameActive = false
        fridgeSlots = 0
        
        for(var f = 0; f < containerGroup.length; f++){
            containerGroup.children[f].slotPos = 0
        }
        
        if(lives > 0){
             theWalkingFridge()
        }
        
        if(lvl > 3){
            timerGroup.alpha = 1
        }
    }
    
    function theWalkingFridge(){
        
        tableFront.alpha = 1
        game.add.tween(fridgeGroup).to({y: game.world.height * 1.5}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
            fridgeGroup.y = - 500
            game.add.tween(fridgeGroup).to({y: game.world.centerY - 50}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                animalsSpineGroup.setAll('alpha', 0)
                dairySpineGroup.setAll('alpha', 0)
                fruitsSpineGroup.setAll('alpha', 0)
                vegetablesSpineGroup.setAll('alpha', 0)
                cerealsSpineGroup.setAll('alpha', 0)
                legumeSpineGroup.setAll('alpha', 0)
                initGame()
            })
        })
        
        for(var f = 0; f < lvl; f++){
            game.add.tween(animalsGroup.children[f]).to({y: game.world.height * 1.5}, 1000, Phaser.Easing.linear, true)
            game.add.tween(dairyGroup.children[f]).to({y: game.world.height * 1.5}, 1000, Phaser.Easing.linear, true)
            game.add.tween(cerealsGroup.children[f]).to({y: game.world.height * 1.5}, 1000, Phaser.Easing.linear, true)
            game.add.tween(fruitsGroup.children[f]).to({y: game.world.height * 1.5}, 1000, Phaser.Easing.linear, true)
            game.add.tween(vegetablesGroup.children[f]).to({y: game.world.height * 1.5}, 1000, Phaser.Easing.linear, true)
            game.add.tween(legumeGroup.children[f]).to({y: game.world.height * 1.5}, 1000, Phaser.Easing.linear, true)
        }
    }
    
    function initGame(){
       
        tableFront.alpha = 0
        inception()
        delay = cloudyWithAChanceOfMeatballs()
        
        game.time.events.add(delay,function(){
            gameActive = true
            
            animalsGroup.setAll('inputEnabled', true)
            dairyGroup.setAll('inputEnabled', true)
            fruitsGroup.setAll('inputEnabled', true)
            vegetablesGroup.setAll('inputEnabled', true)
            cerealsGroup.setAll('inputEnabled', true)
            legumeGroup.setAll('inputEnabled', true)
            
            if(lvl > 3){
                startTimer(time)
            }
        },this)
    }
    
    function inception(){
        
        for(var f = 0; f < lvl; f++){
            popPosX = getRandX()
            popPosY = getRandY()
            
            animalsGroup.children[f].x = popPosX
            animalsGroup.children[f].popUpPosX = popPosX
            animalsGroup.children[f].y = popPosY
            animalsGroup.children[f].popUpPosY = popPosY
        }
        
        for(var f = 0; f < lvl; f++){
            popPosX = getRandX()
            popPosY = getRandY()
            
            dairyGroup.children[f].x = popPosX
            dairyGroup.children[f].popUpPosX = popPosX
            dairyGroup.children[f].y = popPosY
            dairyGroup.children[f].popUpPosY = popPosY
        }
        
        for(var f = 0; f < lvl; f++){
            popPosX = getRandX()
            popPosY = getRandY()
            
            vegetablesGroup.children[f].x = popPosX
            vegetablesGroup.children[f].popUpPosX = popPosX
            vegetablesGroup.children[f].y = popPosY
            vegetablesGroup.children[f].popUpPosY = popPosY
        }
        
        for(var f = 0; f < lvl; f++){
            popPosX = getRandX()
            popPosY = getRandY()
            
            fruitsGroup.children[f].x = popPosX
            fruitsGroup.children[f].popUpPosX = popPosX
            fruitsGroup.children[f].y = popPosY
            fruitsGroup.children[f].popUpPosY = popPosY
        }
        
        for(var f = 0; f < lvl; f++){
            popPosX = getRandX()
            popPosY = getRandY()
            
            cerealsGroup.children[f].x = popPosX
            cerealsGroup.children[f].popUpPosX = popPosX
            cerealsGroup.children[f].y = popPosY
            cerealsGroup.children[f].popUpPosY = popPosY
        }
        
        for(var f = 0; f < lvl; f++){
            popPosX = getRandX()
            popPosY = getRandY()
            
            legumeGroup.children[f].x = popPosX
            legumeGroup.children[f].popUpPosX = popPosX
            legumeGroup.children[f].y = popPosY
            legumeGroup.children[f].popUpPosY = popPosY
        }
    }
    
    function getRandX(){
        var x = game.rnd.integerInRange(game.world.centerX - tableFront.width * 0.4, 
                                        game.world.centerX + tableFront.width * 0.4)
        if(x === popPosX)
            return getRandX()
        else
            return x     
    }
    
    function getRandY(){
        var x = game.rnd.integerInRange(game.world.centerY + 400, game.world.height - 50)
        if(x === popPosY)
            return getRandY()
        else
            return x     
    }
     
    function cloudyWithAChanceOfMeatballs(){
        
        animalsGroup.setAll('inputEnabled', false)
        dairyGroup.setAll('inputEnabled', false)
        fruitsGroup.setAll('inputEnabled', false)
        vegetablesGroup.setAll('inputEnabled', false)
        cerealsGroup.setAll('inputEnabled', false)
        legumeGroup.setAll('inputEnabled', false)
        
        var delay = 500
        
        for(var f = 0; f < lvl; f++){
            popObject(animalsSpineGroup.children[f], delay)
            delay += 200
        }
        
        for(var f = 0; f < lvl; f++){
            popObject(dairySpineGroup.children[f], delay)
            delay += 200
        }
        
        for(var f = 0; f < lvl; f++){
            popObject(fruitsSpineGroup.children[f], delay)
            delay += 200
        }
        
        for(var f = 0; f < lvl; f++){
            popObject(vegetablesSpineGroup.children[f], delay)
            delay += 200
        }
        
        for(var f = 0; f < lvl; f++){
            popObject(cerealsSpineGroup.children[f], delay)
            delay += 200
        }
        
        for(var f = 0; f < lvl; f++){
            popObject(legumeSpineGroup.children[f], delay)
            delay += 200
        }
        
        return delay
    }
    
    function initTable(){
        
        tableFront = sceneGroup.create(game.world.centerX, game.world.height, "atlas.fridge", "table") 
        tableFront.anchor.setTo(0.5, 1)
        tableFront.scale.setTo(1.5, 1)
    }
    
	return {
		
		assets: assets,
		name: "fridge",
		update: update,
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            fridgeSong = game.add.audio('fridgeSong')
            game.sound.setDecodedCallback(fridgeSong, function(){
                fridgeSong.loopFull(0.6)
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
            positionTimer()
            coolFridge()
            xBox()
            worldWarFood()
            worldWarFoodAnimated()
            initTable()
            createParticles()
           
			buttons.getButton(fridgeSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()