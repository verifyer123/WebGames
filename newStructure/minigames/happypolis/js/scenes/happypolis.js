
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var happypolis = function(){
    
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
                name: "atlas.happypolis",
                json: "images/happypolis/atlas.json",
                image: "images/happypolis/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/happypolis/timeAtlas.json",
                image: "images/happypolis/timeAtlas.png",
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
				file:"images/happypolis/tutorial_image_%input.png"
			},
            {
				name:'clean',
				file:"images/happypolis/clean.png"
			},
            {
				name:'dirty',
				file:"images/happypolis/dirty.png"
			},
            {
				name:'floor',
				file:"images/happypolis/floor.png"
			},
            {
				name:'pat',
				file:"images/happypolis/pat.png"
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
            {   name: 'citySong',
                file: soundsPath + 'songs/timberman.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            }
        ],
        spines:[
			{
				name:"ocean_animals",
				file:"images/spines/ocean_animals/ocean_animals.json"
			},
            {
				name:"bornTree",
				file:"images/spines/tree/tree.json"
			},
            {
				name:"factories",
				file:"images/spines/factories/factories.json"
			},
            {
				name:"city",
				file:"images/spines/city/city.json"
			},
            {
				name:"forest_animals",
				file:"images/spines/forest_animals/forest_animals.json"
			},
            {
				name:"luna",
				file:"images/spines/luna/luna.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 165
    var tutoGroup
    var citySong
    var coin
    var timerGroup
    var scenariosGroup
    var happypolisGroup
    var river
    var forest
    var factory
    var level = {forestLvl: 0, riverLvl: 1, factoryLvl: 2}
    var currentLvl
    var limit
    var pointer
    var click
    var list = []
    var speed
    var counterTime
    var trowDelay
    var colector
    var trowObjects
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        speed = 100
        counterTime = 0
        trowDelay = 1000
        colector = 0
        trowObjects = false
        currentLvl = level.forestLvl
        
        limit = {left: 100, right: game.world.width - 100, top: 200, down: game.world.height - 200}
        
        loadSounds()
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.happypolis','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.happypolis','life_box')

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
        citySong.stop()
        		
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
        gameTransition()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        //river.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.happypolis', 'smoke'))
        
        
        //factory.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.happypolis', 'star'))

    }

	function update(){
        
        if(gameActive){
            
            if(click){
            
                pointer.x = game.input.x
                pointer.y = game.input.y
                
                if(currentLvl === level.factoryLvl)
                    checkBox()
            }
            
            if(trowObjects)
                trowTrash()
            
            if(currentLvl === level.riverLvl)
                game.physics.arcade.overlap(river.colider, river.trash, collisionHandler, null, this)    
        }
    }
    
    function checkBox(){
        
        for(var i = 0; i < factory.boxes.length; i++){
            
            if(checkOverlap(pointer, factory.boxes.children[i])){
                if(Math.abs(pointer.x - factory.boxes.children[i].centerX) < 30 && 
                   Math.abs(pointer.y - factory.boxes.children[i].centerY) < 30){
                    drawLine(i)
                }
            }
        }
    }
    
    function drawLine(index){
        
        if(!gameActive || !factory.boxes.children[index].active){
			return
		}
        
        var obj = factory.boxes.children[index]
        obj.active = false
        
        list[list.length] = obj
        
        if(list.length > 1){
            
            var start = list[list.length - 2]
        
            var line = factory.lines.children[0]
            line.moveTo(start.centerX, start.centerY)
            line.lineTo(obj.centerX, obj.centerY)
            line.alpha = 1
            sound.play('pop')
        }
        
        game.add.tween(obj.scale).to({x:0.6,y:0.6},100,"Linear",true,0,0).yoyo(true,0).onComplete.add(function(){
            obj.scale.setTo(1)
        })
        
        
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB );

    }
    
    function collisionHandler(cols, tra){
        
        if(tra.col){
            tra.col = false
            gameActive = false
            trowObjects = false
            //river.trash.setAll('body.velocity.y', 0)
            river.trash.setAll('col', false)
            game.add.tween(river.fishes).to({alpha: 0}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                win(false)
            })
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
        particle.makeParticles('atlas.happypolis',key);
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

				particle.makeParticles('atlas.happypolis',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.happypolis','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.happypolis','smoke');
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
        timerGroup.y = clock.height * 0.5
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
            win(false)
        })
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        var time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createGames(){
        
        scenariosGroup = game.add.group()
        sceneGroup.add(scenariosGroup)
        
        river = game.add.group()
        river.numTrash = 10
        scenariosGroup.add(river)
        
        river.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.happypolis', 'riverTile'))
        river.add(game.add.tileSprite(0, game.world.height - 90, game.world.width, 240, 'atlas.happypolis', 'kelpTile')).anchor.setTo(0,1)
        river.add(game.add.tileSprite(0, game.world.height, game.world.width, 100, 'atlas.happypolis', 'sand')).anchor.setTo(0,1)
        
        river.create(game.world.width + 50, game.world.height, 'atlas.happypolis', 'rocks').anchor.setTo(1)
        
        var rock = river.create(-90, game.world.height, 'atlas.happypolis', 'rocks')
        rock.anchor.setTo(1)
        rock.scale.setTo(-1, 1)
        
         
        factory = game.add.group()
        factory.time = 5000
        scenariosGroup.add(factory)
    
        factory.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.happypolis', 'forestTile'))
        
        var floor = factory.create(0, 0, 'floor')
        floor.width = game.world.width
        
        var dirty = factory.create(-170, 200, 'dirty')
        factory.dirty = dirty
        
        var clean = factory.create(-170, 200, 'clean')
        clean.alpha = 0
        factory.clean = clean
        
        var pat = factory.create(50, 170, 'pat')
        factory.pat = pat
        
        
        forest = game.add.group()
        forest.numTrees = 4
        scenariosGroup.add(forest)
        
        forest.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.happypolis', 'forestTile'))
        forest.add(game.add.tileSprite(0, game.world.height, game.world.width, 120, 'atlas.happypolis', 'ground')).anchor.setTo(0,1)
        
        forest.create(-20, -60, 'atlas.happypolis', 'tree0')
        forest.create(game.world.width - 150, -60, 'atlas.happypolis', 'tree1')
        
        var animals = game.add.group()
        forest.add(animals)
        forest.animals = animals
        
        var anim = game.add.spine(0, 0, 'forest_animals')
        anim.scale.setTo(0.5)
        anim.setAnimationByName(0, "idle", true)
        anim.setSkinByName("bunny")
        animals.add(anim)
        
        anim = game.add.spine(0, 0, 'forest_animals')
        anim.scale.setTo(0.5)
        anim.setAnimationByName(0, "idle", true)
        anim.setSkinByName("squirrel")
        animals.add(anim)
        
        happyCity()
    }
    
    function happyCity(){
        
        happypolisGroup = game.add.group()
        sceneGroup.add(happypolisGroup)
        
        var winTile = happypolisGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.happypolis', 'tile_win'))
        happypolisGroup.win = winTile
        
        var loseTile = happypolisGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.happypolis', 'tile_lose'))
        loseTile.alpha = 0
        happypolisGroup.lose = loseTile
        
        var luna = game.add.spine(game.world.centerX - 130, game.world.centerY -150, 'luna')
        luna.scale.setTo(0.7)
        luna.setAnimationByName(0, "idle", true)
        luna.setSkinByName('normal')
        happypolisGroup.add(luna)
        happypolisGroup.luna = luna
        
        var city = game.add.spine(game.world.centerX, game.world.height + 100, 'city')
        //city.scale.setTo(0.9)
        city.setAnimationByName(0, "idle", true)
        city.setSkinByName('normal')
        happypolisGroup.add(city)
        
        var happy = happypolisGroup.create(game.world.centerX, game.world.centerY - 110, 'atlas.happypolis', 'happy' + localization.getLanguage())
        happy.anchor.setTo(0.5)
        happy.alpha = 0
        happypolisGroup.happy = happy
        
        var unhappy = happypolisGroup.create(game.world.centerX, game.world.centerY - 110, 'atlas.happypolis', 'unhappy' + localization.getLanguage())
        unhappy.anchor.setTo(0.5)
        unhappy.alpha = 0
        happypolisGroup.unhappy = unhappy
    }
    
    function createPointer(){
        
        pointer = game.add.group()
        sceneGroup.add(pointer)
         
        var point = pointer.create(0,0,'atlas.happypolis', 'seeds')
        point.scale.setTo(0.7)
        point.anchor.setTo(0.5)
        point.angle = - 45
        
        point = pointer.create(0,0,'atlas.happypolis','star')
		point.scale.setTo(0.5)
		point.anchor.setTo(0.5)
        
        game.input.onDown.add(clickDown,this)
		game.input.onUp.add(clickUp,this)
    }
    
    function clickDown(){

        if(gameActive){
            sound.play('pop')
            click = true
        }
    }
    
    function clickUp(){
        
        click = false
        pointer.y = -100
        
        if(currentLvl === level.factoryLvl && gameActive){
            
            var acomplished 
            
            if(list.length > 1){
                
                gameActive = false
                stopTimer() 
                
                if(list.length < 4){
                    win(false)
                    return
                }
                else{
                    
                    for(var i = 0; i < 3; i++){
            
                        if(list[i].secuence === i){
                            acomplished = true
                        }
                        else{
                            acomplished = false
                        }
                    }
                    
                    if(acomplished){
                        factory.clean.alpha = 1
                        factory.dirty.alpha = 0
                    }
                    
                    win(acomplished)
                }
            }
            
            missClick()
        }    
    }
    
    function missClick(){
        
        if(list.length <= 1){
            
            factory.boxes.setAll('active', true)
            
            list = []
        }
    }
    
    function fillForest(){
        
        var holesGroup = game.add.group()
        forest.add(holesGroup)
        forest.holes = holesGroup
        
        var restoredGroup = game.add.group()
        forest.add(restoredGroup)
        forest.restored = restoredGroup
        forest.restoredTrees = 0
        
        var space = (game.world.height - 250)/forest.numTrees
        var pivot = space + 100
        var delay = 250
        
        for(var i = 0; i < forest.numTrees; i++){
            
            var hole = holesGroup.create(game.rnd.integerInRange(limit.left, limit.right), pivot, 'atlas.happypolis', 'hole')
            hole.anchor.setTo(0.5)
            hole.alpha = 0
            hole.counter = 3
            hole.inputEnabled = true
            hole.events.onInputDown.add(reforestation ,this)
            pivot += space
            
            popObject(hole, delay)
            delay += 250
        }
        
        for(var j = 0; j < forest.animals.length; j++){
            
            var treeHole = holesGroup.children[game.rnd.integerInRange(0, holesGroup.length - 1)]
            var posX
            
            if(treeHole.x > game.world.centerX){
                posX = game.world.centerX - game.rnd.integerInRange(50, 250)
            }
            else{
                posX = game.world.centerX + game.rnd.integerInRange(50, 250)
            }
            
            forest.animals.children[j].x = posX
            forest.animals.children[j].y = treeHole.centerY
        }
        
        return delay
    }
    
    function reforestation(hole){
        
        if(gameActive){
            
            if(hole.counter > 1){
                sound.play('rightChoice')
                hole.counter--
            }
            else{
                hole.inputEnabled = false
                hole.alpha = 0
                forest.restoredTrees++
                var tree = game.add.spine(hole.x, hole.y + 20, 'bornTree')
                tree.scale.setTo(0.3)
                tree.setAnimationByName(0, "born", false)
                tree.setSkinByName("normal")
                forest.restored.add(tree)
                if(forest.restoredTrees === forest.numTrees){
                    stopTimer() 
                    win(true)
                }
            }
        }
    }
    
    function openFactory(){
        
        for(var i = 0; i < 2; i++){
            var anim = game.add.spine(150, game.world.centerY - 70, 'factories')
            //anim.scale.setTo(0.8)
            anim.setAnimationByName(0, "factory_a", true)
            anim.setSkinByName("normal")
            factory.add(anim)
        }
        
        factory.children[6].setAnimationByName(0, "factory_b", true)
        factory.children[6].x = game.world.width - 100
        factory.children[6].y = game.world.height - 200 

        var boxGroup = game.add.group()
		factory.add(boxGroup)
        factory.boxes = boxGroup
        
        for(var i = 0; i < 4; i++){
            
            var box = boxGroup.create(game.world.centerX + 50, game.world.centerY - 120, 'atlas.happypolis', 'star')
            box.anchor.setTo(0.5)
            box.active = true
            box.secuence = i
            boxGroup.add(box)
        }
        boxGroup.children[1].x = 55
        boxGroup.children[1].y = game.world.centerY + 60
        
        boxGroup.children[2].x = game.world.centerX + 50
        boxGroup.children[2].y = game.world.centerY + 170
        
        boxGroup.children[3].x = 120
        boxGroup.children[3].y = game.world.height - 50
    }
    
    function factoryLines(){
        
        var lines = game.add.group()
        factory.add(lines)
        
        var line = game.add.graphics(0,0)
        line.lineStyle(15, 0xFF0077, 1)
        line.beginFill()
        line.moveTo(0,0)
        line.lineTo(-100,-100)
        line.endFill()
        line.alpha = 0
        lines.add(line)
        
        factory.lines = lines
    }
    
    function restarElements(){
        
        factoryLines()
        
        factory.boxes.setAll('active', true)
        
        list = []
    }
    
    function underTheSea(){
        
        var coliderGroup = game.add.group()
        coliderGroup.enableBody = true;
        coliderGroup.physicsBodyType = Phaser.Physics.ARCADE;
        river.add(coliderGroup)
        river.colider = coliderGroup
        
        var fishGroup = game.add.group()
        river.add(fishGroup)
        river.fishes = fishGroup
        
        var trashGroup = game.add.group()
        trashGroup.enableBody = true;
        trashGroup.physicsBodyType = Phaser.Physics.ARCADE;
        river.add(trashGroup)
        river.trash = trashGroup
        
        var fishSkins = ['fish', 'octopus', 'piranha']
        
        var pivot = -2
        
        for(var j = 0; j < 5; j++){
             
            var box = game.add.graphics(game.world.centerX - 50, game.rnd.integerInRange(game.world.centerY, limit.down))
            box.x += 100 * pivot
            box.beginFill(0x0000ff)
            box.drawRect(0, 0, 100, 100)
            box.alpha = 0
            coliderGroup.add(box)
            pivot ++
            
            var anim = game.add.spine(box.centerX, box.centerY + 70, 'ocean_animals')
            anim.scale.setTo(0.7)
            anim.setAnimationByName(0, "idle", true)
            anim.setSkinByName(fishSkins[game.rnd.integerInRange(0, 2)])
            fishGroup.add(anim)
        }
        
        for(var i = 0; i < 10; i++){
            
            var trash = trashGroup.create(300, 0, 'atlas.happypolis', 'trash' + i)
            trash.anchor.setTo(0.5, 1)
            //trash.body.velocity.y = speed;
            trash.exists = false;
            trash.visible = false;
            trash.checkWorldBounds = true;
            trash.events.onOutOfBounds.add(resetObj, this);
            trash.inputEnabled = true
            trash.events.onInputDown.add(colectTrash ,this)
            trash.col = true
        }
    }
    
    function resetObj(obj){
        obj.kill()
    }
    
    function trowTrash(){
                    
            if (game.time.now > counterTime)
            {
                var trashy = river.trash.getFirstExists(false);
                
                if (trashy)
                {
                    trashy.reset(game.rnd.integerInRange(limit.left, limit.right), 0);
                    trashy.loadTexture('atlas.happypolis', 'trash' + game.rnd.integerInRange(0, 9))
                    trashy.body.velocity.y = speed
                    trashy.col = true
                    counterTime = game.time.now + trowDelay
                }
            }
        
    }
    
    function colectTrash(obj){
        
        if(gameActive){
            obj.kill()
            colector++

            if(colector === 10){
                trowObjects = false
                river.trash.setAll('col', false)
                river.trash.setAll('alpha', 0)
                win(true)
            }
        }
    }
    
    function win(ans){
        
        gameActive = false
        
        if(ans){
            addCoin()
        }
        else{
            missPoint()
        }
        
        game.time.events.add(1500,function(){
            if(lives !== 0)
                lvlUp(ans)
        })
    }
    
    function gameTransition(){
        
        game.time.events.add(1500,function(){
            game.add.tween(happypolisGroup).to({alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                initGame()
            })          
        })
    }
    
    function initGame(){
         
        switch(currentLvl){
            
            case 0:
                game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
                changeImage(0, pointer)
                var delay = fillForest()
                game.time.events.add(delay + 200,function(){
                    gameActive = true
                    startTimer(10000)
                })
            break
            
            case 1:
                changeImage(1, pointer)
                //underTheSea()
                game.time.events.add(1000,function(){
                    gameActive = true
                    trowObjects = true
                })
            break
            
            case 2:
                game.add.tween(timerGroup).to({alpha: 1}, 300, Phaser.Easing.linear, true)
                changeImage(1, pointer)
                restarElements()
                game.time.events.add(1000,function(){
                    gameActive = true
                    startTimer(factory.time)
                })
            break
        }
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function lvlUp(complete){
        
        if(complete){
            happypolisGroup.win.alpha = 1
            happypolisGroup.lose.alpha = 0
            happypolisGroup.luna.setAnimationByName(0, "win", true)
            happypolisGroup.happy.alpha = 1
            happypolisGroup.unhappy.alpha = 0
        }
        else{
            happypolisGroup.win.alpha = 0
            happypolisGroup.lose.alpha = 1
            happypolisGroup.luna.setAnimationByName(0, "lose", true)
            happypolisGroup.happy.alpha = 0
            happypolisGroup.unhappy.alpha = 1
        }
        happypolisGroup.alpha = 1
        
        switch(currentLvl){
                
            case 0:
                if(complete){
                    forest.numTrees += 2
                }
                game.add.tween(timerGroup).to({alpha: 0}, 300, Phaser.Easing.linear, true)
                game.add.tween(happypolisGroup).from({y: game.world.height}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                    scenariosGroup.bringToTop(river)
                    forest.holes.destroy()
                    forest.restored.destroy()
                    underTheSea()
                    currentLvl = level.riverLvl
                    gameTransition()
                })
            break
            
            case 1:
                if(complete){
                    speed += 200
                    counterTime = 0
                    trowDelay -= 200
                    colector = 0
                }
                game.add.tween(happypolisGroup).from({x: game.world.width}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                    scenariosGroup.bringToTop(factory)
                    river.colider.destroy()
                    river.fishes.destroy()
                    river.trash.destroy()
                    currentLvl = level.factoryLvl
                    gameTransition()
                })
            break
            
            case 2:
                if(complete)
                    factory.time -= 200
                game.add.tween(timerGroup).to({alpha: 0}, 300, Phaser.Easing.linear, true)
                game.add.tween(happypolisGroup).from({x: -game.world.width}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
                    scenariosGroup.bringToTop(forest)
                    factory.lines.destroy()
                    currentLvl = level.forestLvl
                    gameTransition()
                })
            break
        }
        
    }
	
	return {
		
		assets: assets,
		name: "happypolis",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
           
            
			sceneGroup = game.add.group()
            
			createBackground()
			addParticles()
            
            initialize()
            citySong = sound.play("citySong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            createGames()
			createPointsBar()
			createHearts()
            positionTimer()
            openFactory()
            createPointer()
            initCoin()
            createParticles()
			
			buttons.getButton(citySong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()