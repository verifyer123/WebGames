var soundsPath = "../../shared/minigames/sounds/"
var puebla = function(){


    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/puebla/atlas.json",
                image: "images/puebla/atlas.png",
            },
        ],
        images: [
        	{name: "estadio",
        	file:"images/puebla/estadio.png"
        	},
        	{name: "cancha",
        	file:"images/puebla/cancha.png"
        	},

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "punch",
                file: soundsPath + "punch1.mp3"},  
            {   name: "cheers",
                file: soundsPath + "cheers.mp3"}, 
        ],
        
    }
    
    var INITIAL_LIVES = 1
    var INITIAL_TIME_APPEAR = 2000
    var DELTA_TIME_APPEAR = 50
    var MIN_TIME_APPEAR =500 
    var MAX_GOOD = 3

    var VEL_FLOOR = 3
    var PERFECT_TO_GOL = 5

    var skinTable
    
    var gameIndex = 29
    var gameId = 100016
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null


    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var player, playerSpine

    var currentTimeAppear

    var ballGroup
    var arrayCurrentBall
    var canTap

    var timer
    var floorMaterial
    var ballCollisionGroup, floorCollisionGroup

    var selectionGroup
    var man, woman, selectionButton
    var field, stadium
    var ligthsGroup
    var lastLigth
    var distanceToBall 
    var sandEmitter
    var confetiEmitter, confetiEmitter2, confetiEmitter3, confetiEmitter4

    var middleText
    var perfectCount


    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        currentTimeAppear = INITIAL_TIME_APPEAR
        arrayCurrentBall = []
        perfectCount = 0
    }
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        //gameActive = true

    }
    
    
    function preload() {
        
        game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
                
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/shooting_stars.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/shooting_stars.mp3');
        }

        game.load.spine('player', "images/spines/skeleton.json");
    }

    
    function stopGame(win){

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        if(amazing.getMinigameId() && marioSong!=null){
            marioSong.pause()
        }else{
            marioSong.stop()
        }
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
        tweenScene.onComplete.add(function(){
            
            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number,gameIndex)
        
            sceneloader.show("result")
        })
    }
    
    function addPoint(number,obj){
        
        //sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }

    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.game','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.anchor.setTo(0.5,0)
        pointsText.x = pointsImg.x + pointsImg.width * 0.6
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.game','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.x
            pointsText.y = obj.y - 60
            pointsText.setText(text)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }

    
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.game',idString);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y- 25;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
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
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.x
            particle.y = obj.y
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
        }
        
        
    }
    
    function createParticles(tag,number){
        
        tag+='Part'
        
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'textPart'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                particle = particlesGroup.create(-200,0,'atlas.game',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }

    function missPoint(){
    	if(lives<0){
    		return
    	}
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)

        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        stopTouch = true
        
        if(lives === 0){
            stopGame()
        }
    
    }


    function update(){
        
        if(!gameActive){
            return
        }

        if(arrayCurrentBall.length!=0){
            player.y = arrayCurrentBall[0].body.y

            player.enfoque.scale.setTo(0.6 + ((arrayCurrentBall[0].body.x-player.x)/distanceToBall)*0.2)

            if(arrayCurrentBall[0].body.x + arrayCurrentBall[0].width/2 < player.x - player.width/2){
            	playerSpine.setAnimationByName(0,"lose1",false)
                missPoint()
                arrayCurrentBall.splice(0,1)
            }
        }

        for(var i =1; i< arrayCurrentBall.length; i++){
        	if(arrayCurrentBall[i].body.x < arrayCurrentBall[0].body.x){
        		var temp = arrayCurrentBall[0]
        		arrayCurrentBall[0] = arrayCurrentBall[i]
        		arrayCurrentBall[i] = temp
        	}
        }

        for(var i =0; i < ballGroup.length; i++){
            if(ballGroup.children[i].visible){
                if(ballGroup.children[i].hitted){
                    if(ballGroup.children[i].body.x > game.world.width + 100){
                        ballGroup.children[i].visible = false
                        ballGroup.children[i].body.velocity.x = 0
                        ballGroup.children[i].body.velocity.y = 0
                    }
                }

                ballGroup.children[i].shadow.x = ballGroup.children[i].x
            }
        }

        field.tilePosition.x -= VEL_FLOOR
        stadium.tilePosition.x -= VEL_FLOOR

        for(var i=0; i< ligthsGroup.length; i++){
        	ligthsGroup.children[i].x -=VEL_FLOOR
        	if(ligthsGroup.children[i].x < -ligthsGroup.children[i].width){
        		var x = game.rnd.integerInRange(200,400)
        		ligthsGroup.children[i].x=lastLigth.x+x
        		ligthsGroup.children[i].loadTexture("atlas.game","luz"+game.rnd.integerInRange(1,2))
        		lastLigth = ligthsGroup.children[i]
        	}
        }

        if(playerSpine.y < game.world.height-300){
        	playerSpine.y+=5
        	if(playerSpine.y>=game.world.height-300){
        		playerSpine.y=game.world.height-300
        		playerSpine.setAnimationByName(0,"run",true)
        	}
        }
        
    }

    function kickBall(){
    	if(lives<=0){
    		return
    	}

    	if(arrayCurrentBall.length==0){
    		playerSpine.setAnimationByName(0,"lose2",false)
            missPoint()
            arrayCurrentBall.splice(0,1)
            return
    	}

        if(arrayCurrentBall[0].body.x - arrayCurrentBall[0].width/2 > player.x + player.width/2){
        	playerSpine.setAnimationByName(0,"lose2",false)
            missPoint()
            arrayCurrentBall.splice(0,1)
        }
        else if(arrayCurrentBall[0].body.x + arrayCurrentBall[0].width/2 > player.x - player.width/2){
        	
        	sound.play("punch")
        	if( arrayCurrentBall[0].body.y > playerSpine.y - 200){
        		playerSpine.setAnimationByName(0,"kick",false)
        		playerSpine.addAnimationByName(0,"run",true)
        	}
        	else{
        		playerSpine.setAnimationByName(0,"header",false)
        		var delta = playerSpine.y - arrayCurrentBall[0].body.y
        		playerSpine.y=playerSpine.y -delta+150
        		/*setTimeout(function () {
        			playerSpine.y = game.world.height-300
        		},200)*/
        		/*game.add.tween(playerSpine).to({y:playerSpine.y-150},200,Phaser.Easing.linear,true).onComplete.add(function(){
        			game.add.tween(playerSpine).to({y:playerSpine.y+150},300,Phaser.Easing.linear,true)
        		})*/
        	}

        	
            var deltaX = Math.abs(arrayCurrentBall[0].body.x - player.x)
            arrayCurrentBall[0].body.velocity.x = -arrayCurrentBall[0].body.velocity.x*1.5
            arrayCurrentBall[0].hitted = true
            arrayCurrentBall[0].lines.visible = true
            
            sandEmitter.x = arrayCurrentBall[0].body.x
            sandEmitter.y = arrayCurrentBall[0].body.y
            sandEmitter.start(true,100,null,2)

            

            arrayCurrentBall.splice(0,1)

            if(deltaX < player.width/4){
                addPoint(3,{x:game.world.width-50,y:50})
                perfectCount++
                if(!middleText.inAnim){
	                if(perfectCount<PERFECT_TO_GOL){
	                	sound.play("magic")
	                	middleText.loadTexture("atlas.game","perfect")
	                }
	                else{
	                	sound.play("cheers")
	                	middleText.loadTexture("atlas.game","gool")
		                confetiEmitter.start(true,500,null,5)
			            confetiEmitter2.start(true,500,null,5)
			            confetiEmitter3.start(true,500,null,5)
			            confetiEmitter4.start(true,500,null,5)
			        }
			        middleText.inAnim = true
		            game.add.tween(middleText.scale).to({x:1,y:1},300,Phaser.Easing.linear,true).onComplete.add(function(){
		            	game.add.tween(middleText.scale).to({x:0,y:0},300,Phaser.Easing.linear,true,500).onComplete.add(function(){
		            		middleText.inAnim = false
		            	})
		            })
		        }
            }
            else{
                addPoint(1,{x:game.world.width-50,y:50})
            }
        }

    }


    function setRound(){
        timer = setTimeout(getBall,INITIAL_TIME_APPEAR)
        gameActive = true
    }

    function getBall(){

        if(!gameActive){
            return
        }

        if(currentTimeAppear > MIN_TIME_APPEAR){
            currentTimeAppear-=DELTA_TIME_APPEAR
        }

        var x = game.world.width+50
        var y = game.rnd.integerInRange(game.world.centerY-200,game.world.centerY+100)
        var velX = -game.rnd.integerInRange(300,500)
        var velY = game.rnd.integerInRange(0,50)

        for(var i =0; i < ballGroup.length; i++){
            if(!ballGroup.children[i].visible){
                ballGroup.children[i].visible = true
                ballGroup.children[i].body.x = x
                ballGroup.children[i].body.y = y
                ballGroup.children[i].body.velocity.x = velX
                ballGroup.children[i].body.velocity.y = velY
                ballGroup.children[i].hitted = false
                ballGroup.children[i].lines.visible = false
                arrayCurrentBall.push(ballGroup.children[i])
                timer = setTimeout(getBall,currentTimeAppear)
                return
            }
        }

        var ball = ballGroup.create(x,y,"atlas.game","balon")
        
        //ball.drawCircle(0,0,50)
        //ball.endFill()
        game.physics.p2.enable(ball,false)
        ball.body.clearShapes()
        ball.body.setCircle(25,0,0)
        ball.body.velocity.x = velX
        ball.body.velocity.y = velY
        ball.body.setCollisionGroup(ballCollisionGroup);
        ball.body.collides([floorCollisionGroup]);

        var ballMaterial = game.physics.p2.createMaterial('spriteMaterial', ball.body);

        var contactMaterial = game.physics.p2.createContactMaterial(floorMaterial, ballMaterial);

        contactMaterial.friction = 0;     // Friction to use in the contact of these two materials.
        contactMaterial.restitution =1.15;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
        contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
        contactMaterial.relaxation = 3; 
        ball.hitted = false
        arrayCurrentBall.push(ball)

        timer = setTimeout(getBall,currentTimeAppear)

        ball.shadow = sceneGroup.create(x,field.y +168,"atlas.game","sombra_balon")
        ball.shadow.anchor.setTo(0.5)

        ball.lines = sceneGroup.create(0,0,"atlas.game","lineas_balon")
        ball.lines.anchor.setTo(1,0)
        ball.lines.visible = false
        ball.addChild(ball.lines)

    }


    function createPlayer(){
    	

        playerSpine = game.add.spine(game.world.centerX - 200,game.world.height-300,"player")
        playerSpine.setSkinByName("normal1")
        playerSpine.setAnimationByName(0,"run",true)
        playerSpine.scale.setTo(0.7)
        sceneGroup.add(playerSpine)

        var playerShadow = sceneGroup.create(game.world.centerX - 200,game.world.height-300,"atlas.game","sombra_jugador")
        playerShadow.anchor.setTo(0.5)


        player = sceneGroup.create(game.world.centerX - 110,game.world.height - 350,"atlas.game","enfoque_circulo")
    	player.anchor.setTo(0.5)

    	player.enfoque = sceneGroup.create(0,0,"atlas.game","enfoque")
    	player.enfoque.anchor.setTo(0.5)
    	player.enfoque.scale.setTo(0.8)
    	player.addChild(player.enfoque)

    	distanceToBall = game.world.width - player.x
    }

    function createBackground(){

        var background = game.add.graphics()
       	background.beginFill(0x121933)
       	background.drawRect(0,0,game.world.width,game.world.height)
       	background.endFill()
       	sceneGroup.add(background)
        field = game.add.tileSprite(0,game.world.height-257-210,game.world.width,256,"cancha")
        sceneGroup.add(field)

        var table = sceneGroup.create(game.world.centerX,game.world.height,"atlas.game","tablero_textura")
        table.anchor.setTo(0.5,1)

        var logo = sceneGroup.create(game.world.centerX-160,game.world.height-table.height/2+50,"atlas.game","logo_puebla")
        logo.anchor.setTo(0.5)

        logo = sceneGroup.create(game.world.centerX+160,game.world.height-table.height/2+50,"atlas.game","logo_puebla")
        logo.anchor.setTo(0.5)

        var button = sceneGroup.create(game.world.centerX,game.world.height-table.height/2+50,"atlas.game","boton_off")
        button.anchor.setTo(0.5)
        button.inputEnabled = true
        button.events.onInputDown.add(function(target){
            target.loadTexture("atlas.game","boton_on")
            kickBall()
        })
        button.events.onInputUp.add(function(target){
            target.loadTexture("atlas.game","boton_off")
        }) 

        

        ligthsGroup = game.add.group()
        sceneGroup.add(ligthsGroup)
        
        stadium =game.add.tileSprite(0,field.y-416,game.world.width,512,"estadio")
        sceneGroup.add(stadium)

        var x = game.rnd.integerInRange(0,300)
        
        while(x < game.world.width*2){
        	var r = game.rnd.integerInRange(1,2)
        	var l = ligthsGroup.create(x,stadium.y+80,"atlas.game","luz"+r)
        	l.anchor.setTo(0.5,1)
        	x += game.rnd.integerInRange(200,400)
        	lastLigth = l
        }


        var floor = game.add.graphics()
        floor.x = game.world.centerX
        floor.y = game.world.height - 250
        //floor.beginFill(0x000000)
        floor.drawRect(-game.world.width,-50,game.world.width*2,100)
        //floor.endFill()
        game.physics.p2.enable(floor,false)
        sceneGroup.add(floor)
        floor.body.kinematic = true
        floor.body.setCollisionGroup(floorCollisionGroup);
        floor.body.collides([ballCollisionGroup]);
        floorMaterial = game.physics.p2.createMaterial('spriteMaterial', floor.body);

        ballGroup = game.add.group()
        sceneGroup.add(ballGroup)

        sandEmitter = game.add.emitter(0, 0, 10);
        sandEmitter.x = game.world.centerX - 150
        sandEmitter.y = game.world.height-350
        sandEmitter.makeParticles("atlas.game","particulas_balon");
        sandEmitter.gravity = 1000;

        confetiEmitter = game.add.emitter(0, 0, 10);
        confetiEmitter.x = game.world.centerX - 150
        confetiEmitter.y = stadium.y+350
        confetiEmitter.makeParticles("atlas.game","confetti1");
        confetiEmitter.gravity = 1000;
        confetiEmitter.minParticleScale = 0.5;
   		confetiEmitter.maxParticleScale = 0.7;

        confetiEmitter2 = game.add.emitter(0, 0, 10);
        confetiEmitter2.x = game.world.centerX - 80
        confetiEmitter2.y = stadium.y+150
        confetiEmitter2.makeParticles("atlas.game","confetti2");
        confetiEmitter2.gravity = 1000;
        confetiEmitter2.minParticleScale = 0.5;
   		confetiEmitter2.maxParticleScale = 0.7;

        confetiEmitter3 = game.add.emitter(0, 0, 10);
        confetiEmitter3.x = game.world.centerX + 80
        confetiEmitter3.y = stadium.y+150
        confetiEmitter3.makeParticles("atlas.game","confetti3");
        confetiEmitter3.gravity = 1000;
        confetiEmitter3.minParticleScale = 0.5;
   		confetiEmitter3.maxParticleScale = 0.7;

        confetiEmitter4 = game.add.emitter(0, 0, 10);
        confetiEmitter4.x = game.world.centerX + 150
        confetiEmitter4.y = stadium.y+350
        confetiEmitter4.makeParticles("atlas.game","confetti4");
        confetiEmitter4.gravity = 1000;
        confetiEmitter4.minParticleScale = 0.5;
   		confetiEmitter4.maxParticleScale = 0.7;

   		middleText = sceneGroup.create(game.world.centerX,game.world.centerY-100,"atlas.game","perfect")
   		middleText.anchor.setTo(0.5)
   		middleText.scale.setTo(0)
   		middleText.inAnim = false

    }


    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function createSelection(){
        selectionGroup = game.add.group()

        var back = game.add.graphics()
        back.beginFill(0xff0000)
        back.drawRect(0,0,game.world.width,game.world.height)
        back.endFill()

        selectionGroup.add(back)

        man = game.add.graphics()
        man.x = game.world.centerX - 200
        man.y = game.world.centerY
        man.beginFill(0x00ff00)
        man.drawRect(-50,-50,100,100)
        man.endFill()
        man.alpha = 0.5

        selectionGroup.add(man)

        man.inputEnabled = true
        man.events.onInputDown.add(function(){
            man.alpha = 1
            woman.alpha = 0.5
            selectionButton.alpha = 1
            selectionButton.inputEnabled = true
        })

        woman = game.add.graphics()
        woman.x = game.world.centerX + 200
        woman.y = game.world.centerY
        woman.beginFill(0x0000ff)
        woman.drawRect(-50,-50,100,100)
        woman.endFill()
        woman.alpha = 0.5

        selectionGroup.add(woman)

        woman.inputEnabled = true
        woman.events.onInputDown.add(function(){
            man.alpha = 0.5
            woman.alpha = 1
            selectionButton.alpha = 1
            selectionButton.inputEnabled = true
        })

        selectionButton = game.add.graphics()
        selectionButton.x = game.world.centerX 
        selectionButton.y = game.world.centerY + 200
        selectionButton.beginFill(0xffffff)
        selectionButton.drawRect(-50,-50,100,100)
        selectionButton.endFill()
        selectionButton.alpha = 0.5

        selectionGroup.add(selectionButton)

        selectionButton.inputEnabled = false
        selectionButton.events.onInputDown.add(function(){
            game.add.tween(selectionGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                selectionGroup.visible = false
                sceneGroup.visible = true
                game.add.tween(sceneGroup).to({alpha:1},500,Phaser.Easing.linear,true).onComplete.add(function(){
                    setRound()
                })
            })
        })

    }

    
    function create(){
    	
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 900
        game.physics.p2.setBoundsToWorld(false,false,false,false,false)

        ballCollisionGroup = game.physics.p2.createCollisionGroup();
        floorCollisionGroup = game.physics.p2.createCollisionGroup();

        sceneGroup = game.add.group()
        sceneGroup.alpha = 0
        sceneGroup.visible = false

        game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        initialize()

        createBackground()
        createPlayer()

        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('arcadeSong')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

        game.onPause.add(function(){
			
			if(amazing.getMinigameId()){
				marioSong.pause()
			}

			if(timer!=null){
				clearTimeout(timer)
			}
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			
			if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}

			timer = setTimeout(getBall,currentTimeAppear)
			
	        game.sound.mute = false
	    }, this);

        spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        createPointsBar()
        createHearts()

        animateScene()

        loadSounds()

        createObjects()
        sceneGroup.visible = true
        setRound()
        //createSelection()
    }

    
    return {
        assets: assets,
        name: "puebla",
        create: create,
        preload: preload,
        update: update
    }
}()