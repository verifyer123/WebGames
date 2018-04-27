
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var gourmetTraveller = function(){
    
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
    

    var	assets = {
        atlases: [
            {   
                name: "atlas.gourmetTraveller",
                json: "images/gourmetTraveller/atlas.json",
                image: "images/gourmetTraveller/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/gourmetTraveller/timeAtlas.json",
                image: "images/gourmetTraveller/timeAtlas.png",
            },
        ],
        images: [
            {
                name: "base",
                file: "images/gourmetTraveller/base.png"
            }, 
            {
                name: "board",
                file: "images/gourmetTraveller/board.png"
            }, 
            {
                name: "tile",
                file: "images/gourmetTraveller/tile.png"
            }, 
            {
				name:'tutorial_image',
				file:"images/gourmetTraveller/tutorial_image_%input.png"
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
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gourmetSong',
                file: soundsPath + 'songs/cooking_in_loop.mp3'}
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            }
        ]
    }
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 143
    var tutoGroup
    var timerGroup, timeBar, tweenTiempo
    var gourmetSong
    var coin
    var flags = ['Germany', 'Canada', 'China', 'France', 'Italy', 'México', 'Thailand']
    var foods = [{country: 'México', name: 'Pozole'},
                {country: 'México', name: 'Chile en nogada'},
                {country: 'México', name: 'Tacos'},
                {country: 'Germany', name: 'Brezel'},
                {country: 'Germany', name: 'Kartoffelbrei'},
                {country: 'Germany', name: 'Bockwurst'},
                {country: 'Canada', name: 'Calgary Beef Hash'},
                {country: 'Canada', name: 'Poutine'},
                {country: 'Canada', name: 'Pudding au Chomeur'},
                {country: 'China', name: 'Tallarines Lo Mein'},
                {country: 'China', name: 'Dim sum'},
                {country: 'China', name: 'Shahe fen'},
                {country: 'France', name: 'Ratatouille'},
                {country: 'France', name: 'Aligot'},
                {country: 'France', name: 'Crépes'},
                {country: 'Italy', name: 'Pasta'},
                {country: 'Italy', name: 'Pizza'},
                {country: 'Italy', name: 'Panna cotta'},
                {country: 'Thailand', name: 'Pad thai'},
                {country: 'Thailand', name: 'Gaeng kiew wan'},
                {country: 'Thailand', name: 'Som tam'}]
    var flagsGroup
    var foodGroup
    var glowGroup
    var rnd
    var country
    var time 
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rnd = -1
        country = ''
        time = 5000
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.gourmetTraveller','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.gourmetTraveller','life_box')

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
        
        sound.stop("gourmetSong")		
        gourmetSong.stop()
        
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
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

	function createBackground(){
        
        var back = sceneGroup.create(0, 0, 'atlas.gourmetTraveller', 'background')
        back.width = game.world.width
        back.height = game.world.centerY
        
        var tile = game.add.tileSprite(0, 0, game.world.width, game.world.centerY, "tile")
        sceneGroup.add(tile)
        
        var base = sceneGroup.create(0, game.world.centerY, 'base')
        base.width = game.world.width
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
        particle.makeParticles('atlas.gourmetTraveller',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = 1.3;
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

				particle.makeParticles('atlas.gourmetTraveller',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.gourmetTraveller','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.gourmetTraveller','smoke');
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
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        //timerGroup.alpha = 0
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
        timerGroup.y = clock.height * 0.4
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            gameActive = false
            stopTimer()
            missPoint()
            win()
        })
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
        
        coin.x = objectBorn.centerX
        coin.y = objectBorn.centerY
        var timer = 300

        game.add.tween(coin).to({alpha:1}, timer, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, timer + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function worldFlags(){
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        var flagName
        
        if(localization.getLanguage() === 'EN'){
            
            flagName = ['Germany', 'Canada', 'China', 'France', 'Italy', 'Mexico', 'Thailand']
        }
        else{
            
            flagName = ['Alemania', 'Canada', 'China', 'Francia', 'Italia', 'México', 'Tailandia']
        }
        
        var board = sceneGroup.create(game.world.centerX, game.world.centerY, 'board')
        board.anchor.setTo(0.5, 1)
        
        flagsGroup = game.add.group()
        sceneGroup.add(flagsGroup)
        
        for(var i = 0; i < flags.length; i++){
            
            var flag = game.add.group()
            flag.x = board.centerX
            flag.y = board.centerY - 60
            flagsGroup.add(flag)
            
            var image = flag.create(0, 0, 'atlas.gourmetTraveller', flags[i])
            image.anchor.setTo(0.5)
            flag.image = image
            
            var name = new Phaser.Text(sceneGroup.game, 0, 130, flagName[i], fontStyle)
            name.anchor.setTo(0.5)
            flag.add(name)
            flag.country = name
        }
        
        flagsGroup.setAll('alpha', 0)
    }
    
    function blingBling(){
        
        glowGroup = game.add.group()
        sceneGroup.add(glowGroup)
        
        for(var i = -1; i < 2; i+=2){
            
            var glow = game.add.group()
            glowGroup.add(glow)
            
            var shadow = glow.create(game.world.centerX + (150 * i), game.world.centerY + 200, 'atlas.gourmetTraveller', 'shadow')
            shadow.anchor.setTo(0.5)
            glow.shadow = shadow
            
            var name = glow.create(game.world.centerX + (150 * i), game.world.height - 90, 'atlas.gourmetTraveller', 'name')
            name.anchor.setTo(0.5)
            name.scale.setTo(1.4, 1.2)
            glow.name = name
        }
    }
    
    function worldFood(){
        
        var fontStyle = {font: "23px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        foodGroup = game.add.group()
        sceneGroup.add(foodGroup)
        
        var aux = 0
        
        for(var i = 0; i < foods.length; i++){
            
            var food = game.add.group()
            food.country = foods[i].country
            food.value = aux
            foodGroup.add(food)
            
            var image = food.create(0, 0, 'atlas.gourmetTraveller', foods[i].name)
            image.anchor.setTo(0.5)
            image.inputEnabled = true
            image.events.onInputDown.add(IChoseYou, this)
            food.image = image
            
            var name = new Phaser.Text(sceneGroup.game, 0, 0, foods[i].name, fontStyle)
            name.anchor.setTo(0.5)
            food.add(name)
            food.name = name
            
            if(aux < 2){
                aux++
            }
            else aux = 0
        }
        
        foodGroup.setAll('alpha', 0)
        
    }
    
    function IChoseYou(obj){
        
        var delay 
        if(gameActive){
            gameActive = false
            stopTimer()
            
            sound.play('pop')
            game.add.tween(obj.scale).to({x:0.5,y:0.5}, 100, Phaser.Easing.linear, true, 0, 0).yoyo(true,0).onComplete.add(function(){
                obj.scale.setTo(1)
                
                if(country === obj.parent.country){
                    delay = 1300
                    game.add.tween(obj).to({x: game.world.centerX, y: game.world.centerY}, 300, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                        particleCorrect.x = obj.x
                        particleCorrect.y = obj.y
                        particleCorrect.start(true, 1300, null, 10)   
                        sound.play('rightChoice')
                        addCoin(obj)
                    })
                }
                else{
                    delay = 300
                    particleWrong.x = obj.x 
                    particleWrong.y = obj.y 
                    particleWrong.start(true, 1300, null, 10)  
                    missPoint()
                }
                
                game.time.events.add(delay,function(){
                    win()
                },this)
            })        
        }
    }
    
    function win(){
        
        for(var i = 0; i < foodGroup.length; i++){
            game.add.tween(foodGroup.children[i]).to({alpha: 0}, 300, Phaser.Easing.Cubic.InOut,true)
        }
        
        if(pointsBar.number % 10){
            time -= 500
        }
        
        game.time.events.add(1500,function(){
            if(lives !== 0){
                cleanTable()
                initGame()
            }
        },this)
    }
    
    function initGame(){
        
        beOurGuest()
        
        game.time.events.add(800,function(){
            gameActive = true
            startTimer(time)
        },this)
    }
    
    function beOurGuest(){
        
        var dish
        var pos 

        rnd = getRand()
        country = flags[rnd]
        changeImage(rnd, flagsGroup)
        sound.play("cut")
        game.add.tween(flagsGroup.children[rnd].image.scale).from({y: 0}, 300, Phaser.Easing.Cubic.InOut,true)
        game.add.tween(flagsGroup.children[rnd].country).from({alpha: 0}, 500, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            
            dish = game.rnd.integerInRange(0, 2)
            pos = game.rnd.integerInRange(0, 1)

            for(var i = 0; i < foodGroup.length; i++){

                if(foodGroup.children[i].country === country && foodGroup.children[i].value === dish){
                    miseEnPlace(foodGroup.children[i], pos)
                }
            }
            
            if(pos === 0)
                pos = 1
            else pos = 0
            
            dish = game.rnd.integerInRange(0, 2)
            rnd = getRand()
            
            for(var i = 0; i < foodGroup.length; i++){

                if(foodGroup.children[i].country === flags[rnd] && foodGroup.children[i].value === dish){
                    miseEnPlace(foodGroup.children[i], pos)
                }
            }
        })
    }
    
    function miseEnPlace(dish, pos){
        
        sound.play("cut")
        dish.alpha = 1
        dish.image.x = glowGroup.children[pos].shadow.centerX
        dish.image.y = glowGroup.children[pos].shadow.centerY
        dish.name.x = glowGroup.children[pos].name.centerX
        dish.name.y = glowGroup.children[pos].name.centerY
        game.add.tween(dish.image.scale).from({y: 0}, 300, Phaser.Easing.Cubic.InOut,true)
        game.add.tween(dish.name).from({alpha: 0}, 500, Phaser.Easing.Cubic.InOut,true)
    }
    
    function cleanTable(){
        
        for(var i = 0; i < foodGroup.length; i++){
            foodGroup.children[i].setAll('x', 0)
            foodGroup.children[i].setAll('y', 0)
        }
        foodGroup.setAll('alpha', 0)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, flags.length-1)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "gourmetTraveller",
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            /*gourmetSong = game.add.audio('gourmetSong')
            game.sound.setDecodedCallback(gourmetSong, function(){
                gourmetSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            gourmetSong = sound.play("gourmetSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            initCoin()
            positionTimer()
            worldFlags()
            blingBling()
            worldFood()
            createParticles()
			
			buttons.getButton(gourmetSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()