
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var nestlingQuest = function(){
    
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
                name: "atlas.nestlingQuest",
                json: "images/nestlingQuest/atlas.json",
                image: "images/nestlingQuest/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/nestlingQuest/timeAtlas.json",
                image: "images/nestlingQuest/timeAtlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/nestlingQuest/gametuto.png"
			},
            {
				name:'background',
				file:"images/nestlingQuest/background.png"
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
            {   name: 'gameSong',
                file: soundsPath + 'songs/jungle_fun.mp3'
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
				name:"babybirds",
				file:"images/spines/babybirds/babybirds.json"
			},
            {
				name:"parents",
				file:"images/spines/parents/parents.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 193
    var tutoGroup
    var gameSong
    var coin
    var hand
    var parentsGroup
    var babiesGroup
    var objectsGroup
    var skins
    var handicap
    var timeAttack
    var gameTime
    var counter
    var roundsCounter
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        skins = ["blue", "orange", "purple", "red"]
        handicap = 2
        timeAttack = false
        gameTime = 8000
        counter = 0
        roundsCounter = 0
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.nestlingQuest','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.nestlingQuest','life_box')

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
        gameSong.stop()
        		
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
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
            
        var bacground = sceneGroup.create(0, 0, "background")
        bacground.width = game.world.width
        bacground.height = game.world.height
        
        var branch = sceneGroup.create(0, game.world.centerY + 30, "atlas.nestlingQuest", "branch0")
        branch.anchor.setTo(0, 0.5)
        
        branch = sceneGroup.create(game.world.width + 10, game.world.centerY - 50, "atlas.nestlingQuest", "branch1")
        branch.anchor.setTo(1, 0)
        
        branch = sceneGroup.create(-20, game.world.centerY - 120, "atlas.nestlingQuest", "branch2")
        branch.anchor.setTo(0, 1)
        branch.scale.setTo(1, 1.5)
    }

	function update(){
       
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
        particle.makeParticles('atlas.nestlingQuest',key);
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

				particle.makeParticles('atlas.nestlingQuest',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.nestlingQuest','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.nestlingQuest','smoke');
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
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        timerGroup.add(clock)
        
        var timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timerGroup.add(timeBar)
        timerGroup.timeBar = timeBar
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.3
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            gameActive = false
            stopTimer()
            missPoint(game.world)
            restartAssets()
        })
    }
	
	function initCoin(){
        
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
               })
           })
        })
    }
    
    function createBirds(){
        
        var nest = sceneGroup.create(game.world.centerX, game.world.height, "atlas.nestlingQuest", "nest")
        nest.anchor.setTo(0.5, 1)
        nest.scale.setTo(1.1)
        
        parentsGroup = game.add.group()
        sceneGroup.add(parentsGroup)
        
        babiesGroup = game.add.group()
        sceneGroup.add(babiesGroup)
        
        objectsGroup = game.add.group()
        sceneGroup.add(objectsGroup)
        
        for(var i = 0; i < 4; i++){
            
            var anim = game.add.spine(game.world.centerX, game.world.centerY, assets.spines[1].name)
            anim.setAnimationByName(0, "idle", true)
            anim.setSkinByName(skins[i])
            anim.alpha = 0
            parentsGroup.add(anim)
            
            var box = game.add.graphics(0, 0)
            box.beginFill(0x00ff00)
            box.drawRect(-anim.width * 0.5, -anim.height * 0.5, anim.width * 0.8, anim.height* 0.5)
            box.alpha = 0
            box.bird = -1
            anim.addChild(box)
            anim.box = box
            
            anim = game.add.spine(nest.centerX, nest.centerY, assets.spines[0].name)
            anim.setAnimationByName(0, "idle", true)
            anim.setSkinByName(skins[i])
            anim.alpha = 0
            babiesGroup.add(anim)
            
            var obj = objectsGroup.create(0, 0, "atlas.nestlingQuest", "smoke")
            obj.anchor.setTo(0.5, 1)
            obj.scale.setTo(1.3)
            obj.alpha = 0
            obj.inputEnabled = true
            obj.index = i
            obj.bird = -1
            obj.input.enableDrag()
            obj.events.onDragUpdate.add(dragBird, this)
            obj.events.onDragStop.add(placeBrid, this)
           
        }
        
        parentsGroup.children[0].x -= 130
        parentsGroup.children[0].y -= 170
        
        parentsGroup.children[1].x -= 190
        parentsGroup.children[1].y += 80
        
        parentsGroup.children[2].x += 200
        parentsGroup.children[2].y -= 175
        parentsGroup.children[2].scale.setTo(-1, 1)
        
        parentsGroup.children[3].x += 160
        parentsGroup.children[3].y += 30
        parentsGroup.children[3].scale.setTo(-1, 1)
        
        objectsGroup.children[0].x = babiesGroup.children[0].spawnX =  babiesGroup.children[0].x += 140
        objectsGroup.children[0].y = babiesGroup.children[0].spawnY =  babiesGroup.children[0].y -= 90
        
        objectsGroup.children[1].x = babiesGroup.children[1].spawnX = babiesGroup.children[1].x -= 140
        objectsGroup.children[1].y = babiesGroup.children[1].spawnY = babiesGroup.children[1].y -= 20
        
        objectsGroup.children[2].x = babiesGroup.children[2].spawnX = babiesGroup.children[2].x -= 40
        objectsGroup.children[2].y = babiesGroup.children[2].spawnY = babiesGroup.children[2].y -= 90
        
        objectsGroup.children[3].x = babiesGroup.children[3].spawnX = babiesGroup.children[3].x += 40
        objectsGroup.children[3].y = babiesGroup.children[3].spawnY = babiesGroup.children[3].y += 20
        
        objectsGroup.setAll("inputEnabled", false)
    }
    
    function dragBird(obj){
        
        if(gameActive){
            babiesGroup.children[obj.index].x = obj.x
            babiesGroup.children[obj.index].y = obj.y
        }
    }
    
    function placeBrid(obj){
        
        if(gameActive){
            
            for(var i = 0; i < parentsGroup.length; i++){
                
                var dad = parentsGroup.children[i]
                
                if(checkOverlap(obj, dad.box)){
                    
                    var kid = babiesGroup.children[obj.index]
                    
                    if(obj.bird === dad.box.bird){
                        kid.x = dad.x
                        kid.y = dad.y
                        kid.setAnimationByName(0, "win", true)
                        addCoin(dad)
                    }
                    else{
                        var trueDad = parentsGroup.children[kinshipTest(obj)]
                        kid.x = trueDad.x
                        kid.y = trueDad.y
                        kid.setAnimationByName(0, "lose", true)
                        missPoint(dad)
                        game.add.tween(kid).from({x:dad.x, y:dad.y}, 500, Phaser.Easing.Cubic.InOut,true)
                    }
                    obj.inputEnabled = false
                    counter++
                    if(counter === handicap){
                        roundsCounter++
                        restartAssets()
                    }
                    break
                }
                else{
                    obj.x = babiesGroup.children[obj.index].x = babiesGroup.children[obj.index].spawnX
                    obj.y = babiesGroup.children[obj.index].y = babiesGroup.children[obj.index].spawnY
                }
            }
        }
    }
    
    function kinshipTest(kid){
        
        for(var i = 0; i < parentsGroup.length; i++){
            if(kid.bird === parentsGroup.children[i].box.bird){
                break
            }
        }
        return i
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );
    }
    
    function restartAssets(){
        
        gameActive = false
        objectsGroup.setAll("inputEnabled", false)
        counter = 0
        
        if(timeAttack){
            stopTimer()
            gameTime -= 500
        }
        
        game.time.events.add(1000,function(){
            for(var i = 0; i < babiesGroup.length; i++){

                game.add.tween(babiesGroup.children[i]).to({alpha: 0}, 500, Phaser.Easing.Cubic.InOut,true)
                game.add.tween(parentsGroup.children[i]).to({alpha: 0}, 500, Phaser.Easing.Cubic.InOut,true)
                objectsGroup.children[i].bird = -1
                parentsGroup.children[i].box.bird = -1
            }
        })
        
        if(roundsCounter % 2 === 0 && handicap < 4){
            handicap++
        }

        if(roundsCounter === 2){
            game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
            timeAttack = true
        }
        
        game.time.events.add(1600,function(){
            for(var i = 0; i < babiesGroup.length; i++){
                objectsGroup.children[i].x = babiesGroup.children[i].x = babiesGroup.children[i].spawnX
                objectsGroup.children[i].y = babiesGroup.children[i].y = babiesGroup.children[i].spawnY
                babiesGroup.children[i].setAnimationByName(0, "idle", true)
                parentsGroup.children[i].setAnimationByName(0, "idle", true)
            }
            if(lives !== 0){
                initGame()
            }
        })
    }
    
    function initGame(){
        
        var random = [0, 1, 2, 3]
        Phaser.ArrayUtils.shuffle(random)
        
        var delay = bringBrid(random)
        
        game.time.events.add(delay,function(){
            for(var i = 0; i < handicap; i++){
                objectsGroup.children[random[i]].inputEnabled = true
            }
            gameActive = true
            if(timeAttack)
                startTimer(gameTime)
        })
    }
    
    function bringBrid(random){
        
        var delay = 250
        
        for(var i = 0; i < handicap; i++){
            
            babiesGroup.children[random[i]].setAnimationByName(0, "idle", true)
            babiesGroup.children[random[i]].setSkinByName(skins[i])
            popObject(babiesGroup.children[random[i]], delay, true)

            objectsGroup.children[random[i]].bird = i
            
            delay += 250
        }
        
        //Phaser.ArrayUtils.shuffle(random)
        
        game.time.events.add(delay - 1000,function(){

            for(var i = 0; i < handicap; i++){

                parentsGroup.children[random[i]].setAnimationByName(0, "idle", true)
                parentsGroup.children[random[i]].setSkinByName(skins[i])
                parentsGroup.children[random[i]].box.bird = i
                popObject(parentsGroup.children[random[i]], delay, false)
                
                delay += 250
            }
        })
        
        return delay + 1500
    }
    
    function popObject(obj,delay, pop){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            if(pop){
                obj.alpha = 1
                game.add.tween(obj.scale).from({x:0, y:0}, 250, Phaser.Easing.Cubic.InOut,true)
            }
            else
                game.add.tween(obj).to({alpha: 1}, 500, Phaser.Easing.Cubic.InOut,true)
        },this)
    }
	
	return {
		
		assets: assets,
		name: "nestlingQuest",
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
			            
			createPointsBar()
			createHearts()
            positionTimer()
            createBirds()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()