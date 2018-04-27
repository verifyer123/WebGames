
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var syncphony = function(){
    
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
                name: "atlas.syncphony",
                json: "images/syncphony/atlas.json",
                image: "images/syncphony/atlas.png",
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
				file:"images/syncphony/gametuto.png"
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
                file: soundsPath + 'songs/funny_invaders.mp3'
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
				name:"yogotar",
				file:"images/spines/yogotar.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 188
    var tutoGroup
    var gameSong
    var coin
    var hand
    var instrumentsGroup
    var toolsGroup
    var boxGroup
    var typeName
    var instruments
    var belts = []
    var speed
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        typeName = ["string", "percussion", "wind"]
        instruments = [["violin", "contrabajo", "violonchelo"],
                       ["triangulo", "xilofono", "bombo"],
                       ["trumpet", "saxophone", "flaute"]]
        speed = 8000
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.syncphony','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.syncphony','life_box')

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
        stopFlow()
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
            
        var back = sceneGroup.create(0, 0, "atlas.syncphony", "background")
        back.width = game.world.width
        
        var seats = game.add.tileSprite(0, 10, game.world.width, 180, "atlas.syncphony", "seats")
        sceneGroup.add(seats)
        
        for(var i = 0; i < 5; i++){
            var candles = sceneGroup.create(100 + (i * 150), 0, "atlas.syncphony", "candles")
            candles.anchor.setTo(0.5, 0)
        }
        
        var floor = game.add.tileSprite(0, back.height, game.world.width, game.world.height, "atlas.syncphony", "floor")
        sceneGroup.add(floor)
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
        particle.makeParticles('atlas.syncphony',key);
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

				particle.makeParticles('atlas.syncphony',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.syncphony','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.syncphony','smoke');
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

        sound.play("rightChoice")
        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createYogotars(){
        
        boxGroup = game.add.group()
        sceneGroup.add(boxGroup)
        
        var skins = ["arthurius", "luna", "theffanie"]
        
        var pivot = 0.4
        
        for(var i = 0; i < 3; i++){
            
            var box = game.add.graphics(0, game.world.centerY * pivot - 50)
            box.beginFill(0x0000ff)
            box.drawRect(0, 0, 270, 180)
            box.alpha = 0
            box.type = -1
            boxGroup.add(box)
            
            var yogo = game.add.spine(150, game.world.centerY * pivot + 110 + (15 * i), "yogotar")
            yogo.setAnimationByName(0, "idle", true)
            yogo.setSkinByName(skins[i])
            yogo.scale.setTo(1)
            sceneGroup.add(yogo)
            box.yogo = yogo
            
            var subGroup = game.add.group()
            yogo.add(subGroup)
            yogo.tool = subGroup
            
            for(var j = 0; j < 3; j++){
                
                var item = subGroup.create(-100, -100, "atlas.syncphony", typeName[j])
                item.anchor.setTo(0.5)
                item.scale.setTo(0.5)
                item.alpha = 0
            }
            
            var belt = sceneGroup.create(box.centerX + 150, game.world.centerY * pivot + 20, "atlas.syncphony", "belt")
            belt.scale.setTo(1, 1)
            
            belts[i] = belt.centerY - 40
            
            pivot += 0.38
        }
    }
    
    function createButtons(){
        
        var board = sceneGroup.create(0, game.world.height, "atlas.syncphony", "board")
        board.anchor.setTo(0, 1)
        board.width = game.world.width
        
        var shine = sceneGroup.create(board.centerX, board.centerY - 100, "atlas.syncphony", "shine")
        shine.anchor.setTo(0.5)
        shine.width = game.world.width
        
        toolsGroup = game.add.group()
        
        var pivot = 0.5
        
        for(var i = 0; i < 3; i++){
            
            var base = sceneGroup.create(board.centerX * pivot, board.centerY + 10, "atlas.syncphony", "base" + i)
            base.anchor.setTo(0.5)
            pivot += 0.5
            
            var tool = toolsGroup.create(base.centerX, base.centerY, "atlas.syncphony", typeName[i])
            tool.anchor.setTo(0.5)
            tool.spawnX = tool.x
            tool.spawnY = tool.y
            tool.inputEnabled = true
            tool.input.enableDrag()
            tool.events.onDragStop.add(dragItem, this)
            tool.type = i
            
            var box = game.add.graphics(0, 0)
            box.beginFill(0xff0000)
            box.drawRect(0, 0, 20, 20)
            box.alpha = 0
            tool.addChild(box)
            tool.box = box
        }
        
        sceneGroup.add(toolsGroup)
    }
    
    function dragItem(obj){
        
        for(var i = 0; i < boxGroup.length; i++){

            if(checkOverlap(boxGroup.children[i], obj.box)){
                boxGroup.children[i].type = obj.type
                changeImage(obj.type, boxGroup.children[i].yogo.tool)
                break
            }
        }    
        
        obj.x = obj.spawnX
        obj.y = obj.spawnY       
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()
        
        return boundsA.containsRect(boundsB)//Phaser.Rectangle.intersects(boundsA , boundsB )
    }
    
    function createInstruments(){
        
        instrumentsGroup = game.add.group()
        sceneGroup.add(instrumentsGroup)
        
        for(var i = 0; i < 10; i++){
            
            var obj = instrumentsGroup.create(0, 0, "atlas.syncphony", "star")
            obj.anchor.setTo(0.5)
            obj.row = -1
            obj.type = -1
            obj.option = -1
            obj.exists = false
            obj.visible = false
        }
    }
    
    function trowInstrument(row){
         
        var inst = instrumentsGroup.getFirstExists(false)
        
        if(inst)
        {
            game.time.events.add(game.rnd.integerInRange(200, 1000),function(){
                inst.reset(game.world.width - 100, belts[row])
                inst.alpha = 0
                inst.row = row
                inst.type = getRand(boxGroup.children[inst.row].type)
                inst.option = game.rnd.integerInRange(0, 2)
                inst.loadTexture('atlas.syncphony', typeName[inst.type] + inst.option)
                popObject(inst, 150)
                transportItem(inst)
            },this)
        }
        
        row = getRand(row)
        game.time.events.add(speed * 0.5,function(){
            if(gameActive){
                trowInstrument(row)
            }
        }, this)
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            obj.scale.setTo(1)
            game.add.tween(obj.scale).from({x:0, y:0},200,Phaser.Easing.linear,true).onComplete.add(function(){
                obj.scale.setTo(1)
            })
        },this)
    }
    
    function transportItem(inst){
        
        game.time.events.add(400,function(){
            inst.move = game.add.tween(inst).to({x: inst.x - 350}, speed, Phaser.Easing.linear, true)
            inst.move.onComplete.add(checkAnswer,this)
        },this)
    }
    
    function checkAnswer(obj){
        
        if(gameActive){
       
            game.add.tween(obj.scale).to({x:0, y:0},200,Phaser.Easing.linear,true).onComplete.add(function(){
                obj.scale.setTo(1)
                obj.kill()

                if(obj.type === boxGroup.children[obj.row].type){
                    boxGroup.children[obj.row].yogo.setAnimationByName(0, "play_" + instruments[obj.type][obj.option], true)
                    addCoin(boxGroup.children[obj.row])
                    particleCorrect.x = boxGroup.children[obj.row].yogo.x 
                    particleCorrect.y = boxGroup.children[obj.row].yogo.y
                    particleCorrect.start(true, 1200, null, 10)
                    
                    if(pointsBar.number !== 0 && pointsBar.number % 5 === 0){
                        gameActive = false
                        stopFlow(true)
                        for(var i = 0; i < boxGroup.length; i++){
                            boxGroup.children[i].yogo.setAnimationByName(0, "idle", true)
                        }
                    }
                }
                else{
                    boxGroup.children[obj.row].yogo.setAnimationByName(0, "wrong", true)
                    boxGroup.children[obj.row].yogo.addAnimationByName(0, "lose", true)
                    particleWrong.x = boxGroup.children[obj.row].yogo.x 
                    particleWrong.y = boxGroup.children[obj.row].yogo.y
                    particleWrong.start(true, 1200, null, 10)
                    missPoint()
                }
            })
        }
    }
    
    function stopFlow(repeat){
        
        for(var i = 0; i < instrumentsGroup.length; i++){
            
            if(instrumentsGroup.children[i].move){
                    instrumentsGroup.children[i].move.stop()
            }
            
            if(!repeat){
                instrumentsGroup.children[i].kill()
            }
            
            instrumentsGroup.children[i].x = 0
            instrumentsGroup.children[i].y = 0
            instrumentsGroup.children[i].alpha = 1
            instrumentsGroup.children[i].scale.setTo(1)
            instrumentsGroup.children[i].row = -1
            instrumentsGroup.children[i].type = -1
            instrumentsGroup.children[i].option = -1
            instrumentsGroup.children[i].exists = false
            instrumentsGroup.children[i].visible = false
            instrumentsGroup.children[i].kill()
        }
        game.time.events.add(speed * 0.25,function(){
            if(repeat){
                stopFlow(false)
                instrumentsGroup.callAll("kill")
                game.time.events.add(1000,function(){
                    if(lives !== 0){
                        speed > 2000 ? speed -= 1000 : speed = 2000
                        initGame()
                    }
                })
            }
        })
    }
    
    function initGame(){
        
        game.time.events.add(1000,function(){
            gameActive = true
            trowInstrument(game.rnd.integerInRange(0, 2))
            
        },this)
    }
    
    function getRand(compare){
        var x = game.rnd.integerInRange(0, 2)
        if(x === compare)
            return getRand(compare)
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "syncphony",
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
            createYogotars()
            createInstruments()
            createButtons()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()