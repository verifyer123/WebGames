
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var scaryShadows = function(){
    
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
                name: "atlas.scaryShadows",
                json: "images/scaryShadows/atlas.json",
                image: "images/scaryShadows/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/scaryShadows/timeAtlas.json",
                image: "images/scaryShadows/timeAtlas.png",
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
				file:"images/scaryShadows/gametuto.png"
			},
            {
				name:'background',
				file:"images/scaryShadows/tile.png"
			},
            {
				name:'water',
				file:"images/scaryShadows/waterTile.png"
			},
            {
				name:'gradiant',
				file:"images/scaryShadows/gradiant.png"
			},
            {
				name:'board',
				file:"images/scaryShadows/board.png"
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
            {	name: "gear",
				file: soundsPath + "gear.mp3"},
            {	name: "bah",
				file: soundsPath + "bah.mp3"},
            {	name: "uuh",
				file: soundsPath + "uuh.mp3"},
            {   name: 'spaceSong',
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
				name:"oof",
				file:"images/spines/oof/oof.json"
			},
            {
				name:"ship",
				file:"images/spines/ship/ship.json"
			},
            {
				name:"triton",
				file:"images/spines/triton/triton.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 181
    var tutoGroup
    var spaceSong
    var coin
    var hand
    var timerGroup
    var oof
    var triton
    var shapesGroup
    var boxesGroup
    var slotsGroup
    var click
    var rand
    var numPieces
    var timeAtack
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        click = false
        rand = -1
        numPieces = 0
        timeAtack = false
        gameTime = 15000
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.scaryShadows','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.scaryShadows','life_box')

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
        spaceSong.stop()
        		
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
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "background"))
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "gradiant"))
        
        var board = sceneGroup.create(game.world.centerX, game.world.centerY - 50, "board")
        board.anchor.setTo(0.5)
        board.scale.setTo(1.6, 1)
        sceneGroup.board = board
    }

	function update(){
        sceneGroup.water.tilePosition.x += 2
        sceneGroup.water.y += Math.cos(sceneGroup.theta += 0.03)
        
        if(click){
            
            for(var i = 0; i < shapesGroup.length; i++){
                shapesGroup.children[i].x = boxesGroup.children[i].x
                shapesGroup.children[i].y = boxesGroup.children[i].y
            }
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
        particle.makeParticles('atlas.scaryShadows',key);
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

				particle.makeParticles('atlas.scaryShadows',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.scaryShadows','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.scaryShadows','smoke');
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
        triton.tweenScare.stop()
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        triton.tweenScare = game.add.tween(triton).to({x:game.world.centerX}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            triton.setAnimationByName(0, "scare", false)
            triton.addAnimationByName(0, "win", true)
            sound.play("bah")
            game.time.events.add(800,function(){
                sound.play("uuh")
            })
            win()
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
    
    function createCharacters(){
        
        oof = game.add.spine(game.world.centerX + 250, game.world.height - 150, "oof")
        oof.setAnimationByName(0, "idle", true)
        oof.setSkinByName("normal")
        oof.scale.setTo(-0.6, 0.6)
        sceneGroup.add(oof)
        
        var ship = game.add.spine(game.world.centerX + 30, oof.y + 30, "ship")
        ship.setAnimationByName(0, "idle", true)
        ship.setSkinByName("normal")
        ship.scale.setTo(1.1)
        sceneGroup.add(ship)
    }
    
    function createTriton(){
        
        triton = game.add.spine(100, game.world.height + 50, "triton")
        triton.setAnimationByName(0, "idle", true)
        triton.setSkinByName("normal")
        triton.scale.setTo(0.8)
        triton.originX = triton.x
        triton.originY = triton.y
        triton.y += 250
        sceneGroup.add(triton)
        
        var water = game.add.tileSprite(0, game.world.height + 35, game.world.width, 140, "water")
        water.anchor.setTo(0, 1)
        sceneGroup.add(water)
        sceneGroup.water = water
        
        sceneGroup.theta = 0
    }
    
    function createAssets(){
        
        slotsGroup = game.add.group()
        sceneGroup.add(slotsGroup)
        
        shapesGroup = game.add.group()
        sceneGroup.add(shapesGroup)
        
        boxesGroup = game.add.group()
        sceneGroup.add(boxesGroup)
        
        for(var i = 0; i < 7; i++){
            
            var shpae = shapesGroup.create(game.world.centerX - 60, game.world.centerY + 165, "atlas.scaryShadows", "piece" + i)
            shpae.anchor.setTo(0.5)
            
            var slot = slotsGroup.create(0, 0, "atlas.scaryShadows", "piece" + i)
            slot.anchor.setTo(0.5)
            slot.tag = -1
            slot.tint = 0xdddddd
            slot.alpha = 0
            slot.empty = true
        }
        
        var pivot = shapesGroup.children[0]
        
        shapesGroup.children[1].x = pivot.x + 50
        shapesGroup.children[1].y = pivot.y - 50
        
        shapesGroup.children[2].x = pivot.x + 126
        shapesGroup.children[2].y = pivot.y - 50
        
        shapesGroup.children[3].x = pivot.x + 50
        shapesGroup.children[3].y = pivot.y + 26
        
        shapesGroup.children[4].x = pivot.x + 100
        shapesGroup.children[4].y = pivot.y + 50
        
        shapesGroup.children[5].x = pivot.x + 26
        shapesGroup.children[5].y = pivot.y + 75
        
        shapesGroup.children[6].x = pivot.x + 100
        shapesGroup.children[6].y = pivot.y 
                
        var poliyPoints = [{x0: -0.5, y0: -0.5, x1: 0.5, y1: 0, x2: -0.5, y2: 0.5},
                           {x0: -0.5, y0: -0.5, x1: 0.5, y1: -0.5, x2: 0, y2: 0.5},
                           {x0: -0.5, y0: 0, x1: 0.5, y1: -0.5, x2: 0.5, y2: 0.5},
                           {x0: -0.5, y0: 0.5, x1: 0, y1: -0.5, x2: 0.5, y2: 0.5},
                           {x0: -0.5, y0: 0.5, x1: 0.5, y1: -0.5, x2: 0.5, y2: 0.5},
                           {x0: -0.15, y0: -0.5, x1: 0.5, y1: -0.5, x2: 0.15, y2: 0.5, x3: -0.5, y3:0.5},
                           {x0: -0.5, y0: 0, x1: 0, y1: -0.5, x2: 0.5, y2: 0, x3: 0, y3:0.5}]
        
        for(var i = 0; i < shapesGroup.length; i++){
            
            var pivot = shapesGroup.children[i]
        
            if(i < 5){
                var poly = new Phaser.Polygon([ new Phaser.Point(pivot.width * poliyPoints[i].x0, pivot.height * poliyPoints[i].y0), 
                                                new Phaser.Point(pivot.width * poliyPoints[i].x1, pivot.height * poliyPoints[i].y1), 
                                                new Phaser.Point(pivot.width * poliyPoints[i].x2, pivot.height * poliyPoints[i].y2) ])
            }
            else{
                var poly = new Phaser.Polygon([ new Phaser.Point(pivot.width * poliyPoints[i].x0, pivot.height * poliyPoints[i].y0), 
                                                new Phaser.Point(pivot.width * poliyPoints[i].x1, pivot.height * poliyPoints[i].y1), 
                                                new Phaser.Point(pivot.width * poliyPoints[i].x2, pivot.height * poliyPoints[i].y2),
                                                new Phaser.Point(pivot.width * poliyPoints[i].x3, pivot.height * poliyPoints[i].y3) ])
            }

            var box = game.add.graphics(pivot.x, pivot.y)
            box.beginFill(0x00ff00)
            box.drawPolygon(poly.points)
            box.alpha = 0
            box.inputEnabled = true
            box.input.enableDrag()
            box.events.onDragStart.add(pickUpPiece, this)
            box.events.onDragStop.add(placeDownPiece, this)
            box.tag = i
            box.originX = box.x
            box.originY = box.y
            box.used = false
            boxesGroup.add(box)
        }
        
        boxesGroup.setAll("inputEnabled", false)
        
        var squarePoints = [[-15, -10, 15, 20],
                            [-10, -20, 20, 20],
                            [0, -10, 10, 15],
                            [-10, 0, 15, 10],
                            [10, 10, 20, 20],
                            [-10, -10, 20, 20],
                            [-10, -10, 20, 20]]
        
        
        for(var i = 0; i < slotsGroup.length; i++){
            
            var pivot = slotsGroup.children[i]
            
            var boxColl = game.add.graphics(0, 0)
            boxColl.beginFill(0x0000ff)
            boxColl.drawRect(squarePoints[i][0], squarePoints[i][1], squarePoints[i][2], squarePoints[i][3])
            boxColl.alpha = 0
            pivot.addChild(boxColl)
            pivot.boxColl = boxColl
        }
        
        slotsGroup.setAll("alpha", 0)
    }
    
    function pickUpPiece(obj){
        
        if(gameActive){
            click = true
            
            if(obj.used){
                numPieces > 0 ? numPieces-- : numPieces = 0
                obj.used = false
                
                for(var i = 0; i < slotsGroup.length; i++){
                    if(slotsGroup.children[i].tag === obj.tag){
                        slotsGroup.children[i].tag = -1
                        slotsGroup.children[i].empty = true
                    }
                }
            }
        }
    }
    
    function placeDownPiece(obj){
        
        click = false
        var index = boxesGroup.getIndex(obj)
        sound.play("gear")
        
        for(var i = 0; i < slotsGroup.length; i++){
            
            if(checkOverlap(obj, slotsGroup.children[i].boxColl) && slotsGroup.children[i].empty){
                shapesGroup.children[index].x = obj.x = slotsGroup.children[i].centerX
                shapesGroup.children[index].y = obj.y = slotsGroup.children[i].centerY
                shapesGroup.children[index].angle = obj.angle = slotsGroup.children[i].angle
                slotsGroup.children[i].empty = false
                slotsGroup.children[i].tag = obj.tag
                obj.used = true
                numPieces++
                break
            }
            else{
                shapesGroup.children[index].x = obj.x = obj.originX
                shapesGroup.children[index].y = obj.y = obj.originY
                shapesGroup.children[index].angle = obj.angle = 0
                obj.used = false
            }
        }
        
        if(numPieces === shapesGroup.length){
            win()
        }
    }
    
    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds()
        var boundsB = spriteB.getBounds()
        
        return boundsA.containsRect(boundsB)//Phaser.Rectangle.contains(boundsB, boundsA.centerX, boundsA.centerY)
    }
    
    function createFigures(){
        
        var bear = [{x: sceneGroup.board.x - slotsGroup.children[0].width * 1.5, y: sceneGroup.board.y - slotsGroup.children[0].height * 0.5, angle: 180},
                    {x: 88,     y: - 70,    angle: 135},
                    {x: 293,    y: - 52,    angle: 315},
                    {x: 0,    y: 90,      angle: 225},
                    {x: 143,    y: - 50,    angle: 0},
                    {x: 190,      y: 40,      angle: 225},
                    {x: 235,    y: - 70,    angle: 45}]
        
        var cocodrile = [{x: sceneGroup.board.x + 20, y: sceneGroup.board.y - slotsGroup.children[0].height * 0.5, angle: 90},
                    {x: 140,    y: - 35,    angle: 180},
                    {x: 37,     y: 43,      angle: 90},
                    {x: - 155,  y: - 27,    angle: 180},
                    {x: - 105,  y: 25,      angle: 225},
                    {x: - 245,  y: - 55,    angle: 135},
                    {x: - 210,  y: 0,       angle: 0},]
        
        var snake = [{x: sceneGroup.board.x - slotsGroup.children[0].width - 20, y: sceneGroup.board.y - slotsGroup.children[0].height * 0.7, angle: 270},
                    {x: 100,    y: 105,     angle: 0},
                    {x: 340,    y: - 27,    angle: 270},
                    {x: 305,    y: 0,       angle: 225},
                    {x: 155,    y: - 1,     angle: 0},
                    {x: - 80,   y: 80,      angle: 0},
                    {x: 247,    y: - 17,    angle: 45}]
        
        var eagle = [{x: sceneGroup.board.x + slotsGroup.children[0].width * 0.5, y: sceneGroup.board.y - slotsGroup.children[0].height, angle: 270},
                    {x: - 70,   y: 90,      angle: 135},
                    {x: 152,    y: 26,      angle: 90},
                    {x: - 105,  y: 225,     angle: 0},
                    {x: -160,   y: 110,     angle: 0},
                    {x: - 185,  y: 190,     angle: 0},
                    {x: 104,    y: - 2,     angle: 0},]
        
        var tiger = [{x: sceneGroup.board.x - slotsGroup.children[0].width, y: sceneGroup.board.y - slotsGroup.children[0].height * 0.2, angle: 135},
                    {x: 80,     y: - 70,    angle: 45},
                    {x: 160,    y: - 140,   angle: 180},
                    {x: 220,    y: - 140,   angle: 270},
                    {x: 40,     y: - 110,   angle: 135},
                    {x: 145,    y: 30,      angle: 45},
                    {x: 190,    y: - 90,    angle: 0},]
        
        slotsGroup.bear = bear 
        slotsGroup.cocodrile = cocodrile 
        slotsGroup.snake = snake 
        slotsGroup.eagle = eagle 
        slotsGroup.tiger = tiger 
    }
    
    function win(){
        
        gameActive = false
        boxesGroup.setAll("inputEnabled", false)
        
        if(timeAtack)
            stopTimer()
        
        if(checkAnswer()){
            oof.setAnimationByName(0, "good", true)
            sound.play("rightChoice")
            addCoin()
            if(timeAtack){
                triton.setAnimationByName(0, "lose", true)
                gameTime -= 500
            }
        }
        else{
            if(!timeAtack)
                oof.setAnimationByName(0, "lose", true)
            else
                oof.setAnimationByName(0, "bad", true)
            missPoint()
        }
        
        if(lives !== 0){
            game.time.events.add(1000,function(){

                for(var i = 0; i < shapesGroup.length; i++){

                    boxesGroup.children[i].x = boxesGroup.children[i].originX
                    boxesGroup.children[i].y = boxesGroup.children[i].originY
                    boxesGroup.children[i].angle = 0

                    game.add.tween(shapesGroup.children[i]).to({angle: 0}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true)
                    game.add.tween(shapesGroup.children[i]).to({x: boxesGroup.children[i].originX, y: boxesGroup.children[i].originY}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true)

                    var slot = slotsGroup.children[i]
                    game.add.tween(slot).to({alpha: 0}, game.rnd.integerInRange(1000, 1500), Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                        slot.x = 0
                        slot.y = 0
                        slot.angle = 0
                    })
                }
            })
            
            if(pointsBar.number === 9){
                game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
                timeAtack = true
            }
            
            if(!timeAtack){
                game.time.events.add(3000,function(){
                    oof.setAnimationByName(0, "idle", true)
                    initGame()
                })
            }
            else{
                game.time.events.add(3000,function(){
                    game.add.tween(triton).to({y: triton.y + 250}, 1000,Phaser.Easing.linear, true).onComplete.add(function(){
                        triton.x = triton.originX
                        oof.setAnimationByName(0, "idle", true)
                        triton.setAnimationByName(0, "idle", true)
                        initGame()
                    })
                })
            }
        }
    }
    
    function checkAnswer(){
        
        var ans
        
        for(var i = 0; i < slotsGroup.length; i++){
            
            if(slotsGroup.children[i].tag === boxesGroup.children[i].tag){
                ans = true
            }
            else{
                ans = false
                break
            }
        }
        
        return ans
    }
    
    function initGame(){
        
        numPieces = 0
        rand = getRand()
        slotsGroup.setAll("tag", -1)
        slotsGroup.setAll("empty", true)
        boxesGroup.setAll("used", false)
        
        if(timeAtack){
            game.add.tween(triton).to({y: triton.originY}, 700,Phaser.Easing.linear, true)
        }
        
        var delay = displayFigure()
        
        game.time.events.add(delay + 100,function(){
            boxesGroup.setAll("inputEnabled", true)
            gameActive = true
            if(timeAtack)
                startTimer(gameTime)
        })
        
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 4)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function displayFigure(){
        
        switch(rand){
            case 0:
                var fig = slotsGroup.bear
            break
            case 1:
                var fig = slotsGroup.cocodrile
            break
            case 2:
                var fig = slotsGroup.snake
            break
            case 3:
                var fig = slotsGroup.eagle
            break
            case 4:
                var fig = slotsGroup.tiger
            break
        }
        
        var delay = 200
        
        slotsGroup.children[0].x = fig[0].x
        slotsGroup.children[0].y = fig[0].y
        slotsGroup.children[0].angle = fig[0].angle
        popObject(slotsGroup.children[0], delay)
        
        var pivot = slotsGroup.children[0]
        delay += 200
        
        for(var i = 1; i < slotsGroup.length; i++){
            
            slotsGroup.children[i].x = fig[i].x + pivot.x
            slotsGroup.children[i].y = fig[i].y + pivot.y
            slotsGroup.children[i].angle = fig[i].angle
            popObject(slotsGroup.children[i], delay)
            delay += 200
        }
        
        return delay
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 0.4
            game.add.tween(obj.scale).from({x:0, y:0},250,Phaser.Easing.linear,true)
        },this)
    }
	
	return {
		
		assets: assets,
		name: "scaryShadows",
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
                        			
            /*spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
                spaceSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            spaceSong = sound.play("spaceSong", {loop:true, volume:0.6})
            
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
            createCharacters()
            createAssets()
            createTriton()
            createFigures()
            initCoin()
            createParticles()
			
			buttons.getButton(spaceSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()