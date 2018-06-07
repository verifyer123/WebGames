
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var diggyBuddy = function(){
    
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
                name: "atlas.diggyBuddy",
                json: "images/diggyBuddy/atlas.json",
                image: "images/diggyBuddy/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/diggyBuddy/timeAtlas.json",
                image: "images/diggyBuddy/timeAtlas.png",
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
				file:"images/diggyBuddy/tutorial_image_%input.png"
			},
            {
				name:'board',
				file:"images/diggyBuddy/board.png"
			},
            {
				name:'clouds',
				file:"images/diggyBuddy/clouds.png"
			},
            

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
				name:"tomiko",
				file:"images/spines/tomiko.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 102
    var tutoGroup
    var timerGroup
    var gameSong
    var coin
    var hand
    var toolAction
    var click
    var fossilsGroup
    var rocksGroup
    var optionsGroup
    var toolsGroup
    var bigRock
    var rand
    var timeAttack
    var gameTime
    var rocksLevel
    var canSmash
    var canDrill
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        toolAction = -1
        click = false
        rand = -1
        timeAttack = false
        gameActive = 30000
        rocksLevel = 3
        canSmash = false
        canDrill = false
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.diggyBuddy','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.diggyBuddy','life_box')

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
            
    }

	function update(){
        
        if (game.input.activePointer.isDown && gameActive && toolAction === 0){
            var x = game.input.x - cloudBitmap.x
            var y = game.input.y - cloudBitmap.y
            var rgba = cloudBitmap.getPixel(x, y)
            if (rgba.a > 0){
                cloudBitmap.blendDestinationOut()
                cloudBitmap.circle(x, y, 50, 'rgba(0, 0, 0, 255')
                cloudBitmap.blendReset()
                cloudBitmap.dirty = true
            }
        }
        
        if(click && !clickOnSound()){
            pointer.x = game.input.x
            pointer.y = game.input.y
        }
        
        if(click && toolAction === 2 && canDrill){
            bigRock.alpha -= 0.01
            if(bigRock.alpha < 0){
                canDrill = false
                showOptions()
                console.log("done")
            }
        }
    }
    
    function clickOnSound(){
        
        if((game.input.x > 515 && game.input.y < 60) || game.input.y > game.world.height - 200){
            return true
        }
        else{
            return false
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
        particle.makeParticles('atlas.diggyBuddy',key);
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

				particle.makeParticles('atlas.diggyBuddy',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.diggyBuddy','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.diggyBuddy','smoke');
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
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
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
    
    function createAssets(){
        
        fossilsGroup = game.add.group()
        sceneGroup.add(fossilsGroup)
        
        bigRock = sceneGroup.create(game.world.centerX, game.world.centerY - 100, "atlas.diggyBuddy", "smoke")
        bigRock.anchor.setTo(0.5)
        bigRock.scale.setTo(2.5)
        bigRock.inputEnabled = true
        bigRock.events.onInputDown.add(drillRock,this)
        
        rocksGroup = game.add.group()
        sceneGroup.add(rocksGroup)
        
        for(var i = 0; i < 3; i++){
            var fossil = fossilsGroup.create(game.world.centerX, game.world.centerY - 100, "atlas.diggyBuddy", "fossil" + i)
            fossil.anchor.setTo(0.5)
            fossil.scale.setTo(2.5)
            fossil.alpha = 0
        }
        
        for(var i = 0; i < 10; i++){

            var rock = rocksGroup.create(-50, 0, "atlas.diggyBuddy", "star")
            rock.anchor.setTo(0.5)
            rock.scale.setTo(1.5)
            rock.hardness = 2
            rock.resize = 1.4
            rock.inputEnabled = true
            rock.events.onInputDown.add(destroyRock,this)
        }
    }
    
    function initBitmap(){
        
        board = sceneGroup.create(game.world.centerX, game.world.centerY - 100, 'board')
        board.anchor.setTo(0.5)
        
        createAssets()
        
        cloudBitmap = game.add.bitmapData(board.width, board.height)
        cloudBitmap.load('clouds')
        cloudBitmap.update()
        cloudBitmap.x = board.centerX - (board.width * 0.5)
        cloudBitmap.y = board.centerY - (board.height * 0.5)
        var map = cloudBitmap.addToWorld(cloudBitmap.x, cloudBitmap.y)
        
        //cloudBitmap.clear()
        sceneGroup.add(map)
        
    }
    
    function countPixels(){
      
        if(getPixels(cloudBitmap.ctx) < 0.35){
            canSmash = true
            cloudBitmap.clear()
            console.log("canSmash")
        }
    }
    
    function getPixels(ctx) {
        
        var alphaPixels = 0
        var data = ctx.getImageData(0,0, ctx.canvas.width,ctx.canvas.height).data

        for(var i=3; i<data.length; i+=4){
            if(data[i] > 0) 
                alphaPixels++
        }

        return alphaPixels / (ctx.canvas.width * ctx.canvas.height)
    }
    
    function createButtons(){
        
        var bar = sceneGroup.create(0, game.world.height, "atlas.diggyBuddy", "bar")
        bar.anchor.setTo(0, 1)
        bar.width = game.world.width

        optionsGroup = game.add.group()
        sceneGroup.add(optionsGroup)
        
        toolsGroup = game.add.group()
        sceneGroup.add(toolsGroup)
        
        var pivot = 0.5
        
        for(var i = 0; i < 3; i++){
            
            var foss = optionsGroup.create(bar.centerX * pivot, bar.centerY, "atlas.diggyBuddy", "fossil" + i)
            foss.anchor.setTo(0.5)
            foss.tag = i
            foss.inputEnabled = true
            foss.events.onInputDown.add(fossilSelect,this)
            
            var tool = toolsGroup.create(bar.centerX * pivot, bar.centerY, "atlas.diggyBuddy", "tool" + i)
            tool.anchor.setTo(0.5)
            tool.tag = i
            tool.spawnX = tool.x
            tool.spawnY = tool.y
            tool.inputEnabled = true
            tool.events.onInputDown.add(toolSelect,this)

            pivot += 0.5
        }
        
        optionsGroup.setAll("inputEnabled", false)
        optionsGroup.alpha = 0
        
        pointer = sceneGroup.create(-50, 0, "atlas.diggyBuddy", "tool0")
        pointer.alpha = 0
		pointer.scale.setTo(0.5)
		pointer.anchor.setTo(0.5)
        
        game.input.onDown.add(clickDown,this)
		game.input.onUp.add(clickUp,this)
    }
    
    function clickDown(){
        
        if(gameActive){
            click = true
        }
    }
    
    function clickUp(){
        
        click = false
        pointer.x = -50
        if(!canSmash && gameActive)
            countPixels()
    }
    
    function toolSelect(tool){
        
        for(var i = 0; i < toolsGroup.length; i++){
            toolsGroup.children[i].scale.setTo(1)
        }
        tool.scale.setTo(1.2)
        toolAction = tool.tag
        pointer.loadTexture("atlas.diggyBuddy", "tool" + tool.tag)
        pointer.alpha = 1
    }
    
    function destroyRock(obj){
        
        if(gameActive && canSmash){
            if(toolAction === 1){

                if(obj.hardness > 0){
                    obj.hardness--
                    obj.scale.setTo(obj.resize)
                    obj.resize -= 0.1
                }
                else{
                    obj.alpha = 0
                    obj.inputEnabled = false
                    rocksLevel--
                    
                    if(rocksLevel === 0){
                        console.log("canDrill")
                        canDrill = true
                    }
                }
            }
            else{
                console.log("bad")
            }
        }
    }
    
    function drillRock(rock){
    
        if(toolAction !== 2 && canDrill){
            click = false
            console.log("bad")
        }
    }
    
    function showOptions(){
        
        toolsGroup.setAll("inputEnabled", false)
        toolsGroup.alpha = 0
        
        optionsGroup.setAll("inputEnabled", true)
        optionsGroup.alpha = 1
        
        pointer.alpha = 0
    }
    
    function fossilSelect(foss){
        
        if(gameActive){
            
            gameActive = false
            
            if(foss.tag === rand){
                addCoin(foss)
            }
            else{
                missPoint(foss)
            }   
        }
        
        if(lives !== 0){
            restarAssests()
        }
    }
    
    function restarAssests(){
        
        canSmash = false
        canDrill = false
        
        bigRock.alpha = 1
        for(var i = 0; i < rocksGroup.length; i++){
            rocksGroup.children[i].hardness = 3
            rocksGroup.children[i].resize = 1.4
            rocksGroup.children[i].alpha = 1
            rocksGroup.children[i].scale.setTo(1.5)
            rocksGroup.children[i].inputEnabled = true
        }
        
        for(var i = 0; i < toolsGroup.length; i++){
            toolsGroup.children[i].scale.setTo(1)
        }
        
        toolsGroup.setAll("inputEnabled", true)
        toolsGroup.alpha = 1
        
        optionsGroup.setAll("inputEnabled", false)
        optionsGroup.alpha = 0
        
        cloudBitmap.load('clouds')
        
        toolAction = -1
        rocksLevel = 3
        
        game.time.events.add(1000,function(){
            initGame()
        },this)
    }
    
    function initGame(){
        
        rand = getRand()
        fillRocks()
        changeImage(rand, fossilsGroup)
        
        game.time.events.add(1000,function(){
            gameActive = true
        },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function fillRocks(){
        
        for(var i = 0; i < rocksLevel; i++){
            
            rocksGroup.children[i].x = game.rnd.integerInRange(200, game.world.width - 200)
            rocksGroup.children[i].y = game.rnd.integerInRange(200, game.world.width - 200)
        }
    }
    
    function createTomiko(){
        
        var tomiko = game.add.spine(game.world.centerX, game.world.centerY, "tomiko")
        tomiko.setAnimationByName(0, "idle", true)
        tomiko.setSkinByName("normal")
        sceneGroup.add(tomiko)
    }
	
	return {
		
		assets: assets,
		name: "diggyBuddy",
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
            initBitmap()
            createButtons()
            //createTomiko()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()